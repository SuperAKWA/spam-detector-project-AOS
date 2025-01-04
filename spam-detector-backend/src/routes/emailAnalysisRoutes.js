const express = require('express');
const router = express.Router();
const keywords = require('../data/keywords.json');

// Fonction pour détecter les liens dans un texte
const extractLinks = (text) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || [];
};

// Fonction pour vérifier si un lien est suspect
const isLinkSuspect = (link) => {
  const suspiciousPatterns = [
    /free/, /bonus/, /verify/, /account/, /secure/, /bank/, 
    /login/, /password/, /update/, /prize/, /win/
  ];
  return suspiciousPatterns.some((pattern) => pattern.test(link));
};

// Fonction d'analyse de l'email
const analyzeEmail = (subject, body) => {
  const totalWords = (subject + " " + body).split(/\s+/).length;
  let totalWeights = { spam: 0, phishing: 0, promotion: 0 };
  let keywordsUsed = { spam: [], phishing: [], promotion: [] };
  const links = extractLinks(subject + " " + body);
  const suspiciousLinks = links.filter(isLinkSuspect);

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
    promotion: Math.min(100, (Math.sqrt(totalWeights.promotion) / Math.sqrt(totalWords)) * 100)
  };

  Object.keys(probabilities).forEach((category) => {
    if (keywordsUsed[category].length >= 3) {
      probabilities[category] += 5;
    }
    if (keywordsUsed[category].length === 1) {
      probabilities[category] *= 0.9;
    }
  });

  if (suspiciousLinks.length > 0) {
    probabilities.phishing += suspiciousLinks.length * 5;
  }

  const labels = Object.keys(probabilities).filter(cat => probabilities[cat] > 20);

  return {
    labels,
    probabilities,
    details: {
      keywordsUsed,
      totalWeight: totalWeights,
      totalWords,
      links: {
        detected: links,
        suspicious: suspiciousLinks
      }
    }
  };
};

// Route pour l'analyse de l'email
router.post('/', async (req, res) => {
  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).send('Objet et corps d’email requis.');
  }

  try {
    const result = analyzeEmail(subject, body);
    res.status(200).send(result);
  } catch (error) {
    console.error('Erreur lors de l’analyse:', error);
    res.status(500).send('Erreur lors de l’analyse.');
  }
});

module.exports = router;
