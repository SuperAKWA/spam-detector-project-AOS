const express = require('express');
const router = express.Router();
const axios = require('axios');
const keywords = require('../data/keywords.json');

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
      const analysisId = submitResponse.data.data.id;

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

// Route pour l’analyse classique via formulaire
router.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token reçu dans la requête :', token); // Log pour vérifier le token

  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).send('Objet et corps d’email requis.');
  }

  try {
    console.log('Début de l’analyse de l’email via formulaire...');
    const result = await analyzeEmail(subject, body);
    console.log('Résultat de l’analyse :', JSON.stringify(result, null, 2));

    // Ajout de l'analyse à l'historique utilisateur
    //const token = req.headers.authorization?.split(' ')[1]; // Récupère le token d'authentification
    if (token) {
      console.log('Envoi de l’analyse à l\'historique utilisateur...');
      await axios.post(
        'http://auth-services:4000/auth/history', 
        { subject, body, ...result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Analyse ajoutée à l\'historique utilisateur.');
    } else {
      console.log('Aucun token fourni, historique non mis à jour.');
    }

    res.status(200).send(result);
  } catch (error) {
    console.error('Erreur lors de l’analyse classique :', error);
    res.status(500).send('Erreur lors de l’analyse.');
  }
});


module.exports = router;
