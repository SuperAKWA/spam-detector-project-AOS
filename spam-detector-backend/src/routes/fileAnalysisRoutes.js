const express = require('express');
const router = express.Router();
const multer = require('multer'); // Middleware pour le traitement des fichiers uploadés
const { simpleParser } = require('mailparser'); // Utilisé pour parser les fichiers EML
const mammoth = require('mammoth'); // Utilisé pour extraire du texte brut des fichiers DOCX
const axios = require('axios'); // Librairie pour effectuer des requêtes HTTP
const keywords = require('../data/keywords.json'); // Fichier contenant les mots-clés et leurs poids

const upload = multer(); // Configuration de multer pour l'upload des fichiers

/* 
Fonction pour détecter les liens dans un texte.
Elle utilise une expression régulière pour identifier les URL.
*/
const extractLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || []; // Retourne un tableau des liens trouvés ou un tableau vide
};

/* 
Fonction pour vérifier les liens via VirusTotal.
Elle soumet chaque lien à l'API VirusTotal et retourne un tableau avec les statuts des liens (Malicious, Safe ou Unknown).
*/
const checkLinksWithAPI = async (links) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY; // Clé API à configurer dans le fichier .env
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
        results.push({ link, status: 'Malicious' }); // Ajout du lien avec un statut "Malicious"
        console.log(`Lien détecté comme malveillant : ${link}`);
      } else {
        results.push({ link, status: 'Safe' }); // Ajout du lien avec un statut "Safe"
        console.log(`Lien détecté comme sûr : ${link}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l’analyse de l’URL ${link}:`, error.response?.data || error.message);
      results.push({ link, status: 'Unknown' }); // En cas d'erreur, on marque le lien comme "Unknown"
    }
  }

  console.log('Fin de la vérification des liens avec VirusTotal.');
  return results;
};

/* 
Fonction pour analyser un email.
Elle calcule les probabilités que l'email soit du spam, du phishing ou une promotion, 
en fonction des mots-clés et des liens détectés.
*/
const analyzeEmail = async (subject, body) => {
  const totalWords = (subject + " " + body).split(/\s+/).length; // Nombre total de mots
  let totalWeights = { spam: 0, phishing: 0, promotion: 0 }; // Poids cumulés pour chaque catégorie
  let keywordsUsed = { spam: [], phishing: [], promotion: [] }; // Mots-clés détectés pour chaque catégorie
  const alerts = []; // Alertes à renvoyer (ex. : liens malveillants)

  console.log('Extraction des liens dans le contenu...');
  const links = extractLinks(subject + " " + body); // Extraction des liens dans l'email
  console.log(`Liens détectés : ${links.join(', ')}`);

  console.log('Début de l’analyse des liens...');
  const apiResults = await checkLinksWithAPI(links); // Analyse des liens avec VirusTotal
  const maliciousLinks = apiResults.filter((result) => result.status === 'Malicious').map((result) => result.link);
  console.log(`Liens malveillants détectés : ${maliciousLinks.join(', ')}`);

  if (maliciousLinks.length > 0) {
    alerts.push(`Attention : ${maliciousLinks.length} lien(s) malveillant(s) détecté(s).`);
  }

  const impactFactor = 1.2; // Facteur d'impact pour les mots-clés détectés

  for (const category in keywords) {
    keywords[category].forEach(({ word, weight }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Recherche exacte des mots-clés
      const matches = (subject + " " + body).match(regex);
      if (matches) {
        totalWeights[category] += weight * matches.length * impactFactor; // Calcul du poids total pour chaque catégorie
        keywordsUsed[category].push(word);
      }
    });
  }

  const probabilities = {
    spam: Math.min(100, (Math.sqrt(totalWeights.spam) / Math.sqrt(totalWords)) * 100), // Probabilité pour le spam
    phishing: Math.min(100, (Math.sqrt(totalWeights.phishing) / Math.sqrt(totalWords)) * 100), // Probabilité pour le phishing
    promotion: Math.min(100, (Math.sqrt(totalWeights.promotion) / Math.sqrt(totalWords)) * 100), // Probabilité pour les promotions
  };

  Object.keys(probabilities).forEach((category) => {
    if (keywordsUsed[category].length >= 3) {
      probabilities[category] += 5; // Bonus si plusieurs mots-clés sont détectés
    }
    if (keywordsUsed[category].length === 1) {
      probabilities[category] *= 0.9; // Réduction si un seul mot-clé est détecté
    }
  });

  if (maliciousLinks.length > 0) {
    probabilities.phishing += maliciousLinks.length * 20; // Impact des liens malveillants sur la probabilité de phishing
  }

  if (probabilities.spam > 100){
    probabilities.spam = 100;
  }

  if (probabilities.phishing > 100){
    probabilities.phishing = 100;
  }

  if (probabilities.promotion > 100){
    probabilities.promotion = 100;
  }

  const labels = Object.keys(probabilities).filter(cat => probabilities[cat] > 20); // Catégories à signaler

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
router.post('/', upload.single('emailFile'), async (req, res) => {
  /* 
  Cette route permet de soumettre un fichier contenant un email (JSON, TXT, EML ou DOCX) pour analyse.
  Elle retourne les résultats de l'analyse du fichier.
  */
  const file = req.file;

  if (!file) {
    console.log('Fichier non fourni.');
    return res.status(400).send('Fichier requis.');
  }

  try {
    const fileExtension = file.originalname.split('.').pop().toLowerCase(); // Détection du type de fichier
    let subject = 'Fichier importé';
    let body;

    console.log(`Analyse d’un fichier de type : ${fileExtension}`);
    if (fileExtension === 'json') {
      const jsonContent = JSON.parse(file.buffer.toString()); // Lecture des fichiers JSON
      subject = jsonContent.subject || 'Sans objet';
      body = jsonContent.body || '';
    } else if (fileExtension === 'txt' || fileExtension === 'eml') {
      body = file.buffer.toString();
      if (fileExtension === 'eml') {
        const parsed = await simpleParser(body); // Parsing des fichiers EML
        subject = parsed.subject || 'Sans objet';
        body = parsed.text || parsed.html || '';
      }
    } else if (fileExtension === 'docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer }); // Extraction de texte pour DOCX
      body = result.value;
    } else {
      console.log('Type de fichier non pris en charge.');
      return res.status(400).send('Type de fichier non pris en charge.');
    }

    console.log('Début de l’analyse du fichier...');
    const result = await analyzeEmail(subject, body); // Analyse du contenu du fichier
    console.log('Résultat de l’analyse :', JSON.stringify(result, null, 2));

    res.status(200).send(result); // Retourne les résultats de l'analyse
  } catch (error) {
    console.error('Erreur lors de l’analyse via fichier:', error.message);
    res.status(500).send('Erreur lors de l’analyse.');
  }
});

module.exports = router;
