const express = require('express');
const router = express.Router();
const multer = require('multer');
const { simpleParser } = require('mailparser');
const mammoth = require('mammoth');
const keywords = require('../data/keywords.json');

const upload = multer();

// Fonction pour analyser un email
const analyzeEmail = (subject, body) => {
  const totalWords = (subject + " " + body).split(/\s+/).length;
  let totalWeights = { spam: 0, phishing: 0, promotion: 0 };
  let keywordsUsed = { spam: [], phishing: [], promotion: [] };

  for (const category in keywords) {
    keywords[category].forEach(({ word, weight }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (subject + " " + body).match(regex);
      if (matches) {
        totalWeights[category] += weight * matches.length;
        keywordsUsed[category].push(word);
      }
    });
  }

  const probabilities = {
    spam: Math.min(100, (totalWeights.spam / totalWords) * 100),
    phishing: Math.min(100, (totalWeights.phishing / totalWords) * 100),
    promotion: Math.min(100, (totalWeights.promotion / totalWords) * 100),
  };

  const labels = Object.keys(probabilities).filter((cat) => probabilities[cat] > 20);

  return {
    labels,
    probabilities,
    details: {
      keywordsUsed,
      totalWeight: totalWeights,
      totalWords,
    },
  };
};

// Route pour l'analyse via fichiers uploadés
router.post('/', upload.single('emailFile'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('Fichier requis.');
  }

  try {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    let subject = 'Fichier importé';
    let body;

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
      return res.status(400).send('Type de fichier non pris en charge.');
    }

    const result = analyzeEmail(subject, body);
    res.status(200).send(result);
  } catch (error) {
    console.error('Erreur lors de l’analyse via fichier:', error);
    res.status(500).send('Erreur lors de l’analyse.');
  }
});

module.exports = router;
