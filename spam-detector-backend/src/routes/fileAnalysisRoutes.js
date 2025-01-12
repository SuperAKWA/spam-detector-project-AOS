const express = require('express');
const router = express.Router();
const multer = require('multer');
const { simpleParser } = require('mailparser');
const mammoth = require('mammoth');
const axios = require('axios');
const keywords = require('../data/keywords.json');

const upload = multer();

// Fonction pour détecter les liens dans un texte
const extractLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || [];
};

// Fonction pour vérifier les liens via VirusTotal
const checkLinksWithAPI = async (links) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  const results = [];

  console.log('Début de la vérification des liens avec VirusTotal...');
  for (const link of links) {
    try {
      console.log(`Analyse de l’URL : ${link}`);
      
      // Étape 1 : Soumettre l’URL pour analyse
      const submitResponse = await axios.post(
        'https://www.virustotal.com/api/v3/urls',
        new URLSearchParams({ url: link }).toString(),
        {
          headers: {
            'x-apikey': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log(`Soumission réussie pour l’URL : ${link}`);

      // Étape 2 : Récupérer les résultats de l’analyse
      const analysisId = submitResponse.data.data.id;
      console.log(`ID d’analyse obtenu : ${analysisId}`);

      const analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { 'x-apikey': apiKey },
        }
      );

      const stats = analysisResponse.data.data.attributes.stats;
      if (stats.malicious > 0) {
        results.push({ link, status: 'Malicious' });
        console.log(`Lien détecté comme malveillant : ${link}`);
      } else {
        results.push({ link, status: 'Safe' });
        console.log(`Lien détecté comme sûr : ${link}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l’analyse de l’URL ${link}:`, error.response?.data || error.message);
      results.push({ link, status: 'Unknown' });
    }
  }

  console.log('Fin de la vérification des liens avec VirusTotal.');
  return results;
};

// Fonction pour analyser un email
const analyzeEmail = async (subject, body) => {
  const totalWords = (subject + " " + body).split(/\s+/).length;
  let totalWeights = { spam: 0, phishing: 0, promotion: 0 };
  let keywordsUsed = { spam: [], phishing: [], promotion: [] };
  const alerts = [];

  console.log('Extraction des liens dans le contenu...');
  const links = extractLinks(subject + " " + body);
  console.log(`Liens détectés : ${links.join(', ')}`);

  console.log('Début de l’analyse des liens...');
  const apiResults = await checkLinksWithAPI(links);
  const maliciousLinks = apiResults.filter((result) => result.status === 'Malicious').map((result) => result.link);
  console.log(`Liens malveillants détectés : ${maliciousLinks.join(', ')}`);

  if (maliciousLinks.length > 0) {
    alerts.push(`Attention : ${maliciousLinks.length} lien(s) malveillant(s) détecté(s).`);
  }

  const impactFactor = 1.2;

  for (const category in keywords) {
    keywords[category].forEach(({ word, weight }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (subject + " " + body).match(regex);
      if (matches) {
        totalWeights[category] += weight * matches.length * impactFactor;
        keywordsUsed[category].push(word);
      }
    });
  }

  const probabilities = {
    spam: Math.min(100, (Math.sqrt(totalWeights.spam) / Math.sqrt(totalWords)) * 100),
    phishing: Math.min(100, (Math.sqrt(totalWeights.phishing) / Math.sqrt(totalWords)) * 100),
    promotion: Math.min(100, (Math.sqrt(totalWeights.promotion) / Math.sqrt(totalWords)) * 100),
  };

  Object.keys(probabilities).forEach((category) => {
    if (keywordsUsed[category].length >= 3) {
      probabilities[category] += 5;
    }
    if (keywordsUsed[category].length === 1) {
      probabilities[category] *= 0.9;
    }
  });

  if (maliciousLinks.length > 0) {
    probabilities.phishing += maliciousLinks.length * 5;
  }

  const labels = Object.keys(probabilities).filter(cat => probabilities[cat] > 20);

  console.log('Analyse terminée.');
  return {
    labels,
    probabilities,
    alerts,
    details: {
      keywordsUsed,
      totalWeight: totalWeights,
      totalWords,
      links: {
        detected: links,
        malicious: maliciousLinks,
      },
    },
  };
};


// Route pour l’analyse via fichiers uploadés
// Route pour l’analyse via fichiers uploadés
router.post('/', upload.single('emailFile'), async (req, res) => {
  const file = req.file;

  if (!file) {
    console.log('Fichier non fourni.');
    return res.status(400).send('Fichier requis.');
  }

  try {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    let subject = 'Fichier importé';
    let body;

    console.log(`Analyse d’un fichier de type : ${fileExtension}`);
    if (fileExtension === 'json') {
      const jsonContent = JSON.parse(file.buffer.toString());
      subject = jsonContent.subject || 'Sans objet';
      body = jsonContent.body || '';
    } else if (fileExtension === 'txt' || fileExtension === 'eml') {
      body = file.buffer.toString();
      if (fileExtension === 'eml') {
        const parsed = await simpleParser(body);
        subject = parsed.subject || 'Sans objet';
        body = parsed.text || parsed.html || '';
      }
    } else if (fileExtension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      body = result.value;
    } else {
      console.log('Type de fichier non pris en charge.');
      return res.status(400).send('Type de fichier non pris en charge.');
    }

    console.log('Début de l’analyse du fichier...');
    const result = await analyzeEmail(subject, body);
    console.log('Résultat de l’analyse :', JSON.stringify(result, null, 2));

    // Ajout de l'analyse à l'historique utilisateur
    const token = req.headers.authorization?.split(' ')[1]; // Récupère le token d'authentification
    if (token) {
      console.log('Ajout de l’analyse à l’historique utilisateur (drag and drop)...');
      await axios.post(
        'http://auth-services:4000/auth/history', 
        { subject, body, ...result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Analyse ajoutée à l\'historique utilisateur (drag and drop).');
    } else {
      console.log('Aucun token fourni, historique non mis à jour (drag and drop).');
    }

    res.status(200).send(result);
  } catch (error) {
    console.error('Erreur lors de l’analyse via fichier:', error.message);
    res.status(500).send('Erreur lors de l’analyse.');
  }
});


module.exports = router;
