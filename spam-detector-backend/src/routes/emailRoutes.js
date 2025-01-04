// routes/emailRoutes.js
const express = require('express');
const Email = require('../models/Email');
const authMiddleware = require('../middleware/authMiddleware'); // Importer le middleware d'authentification

const router = express.Router();

// Route pour soumettre un email pour analyse
router.post('/analyze', authMiddleware, async (req, res) => {
  const { object, body } = req.body;

  try {
    // Logique de détection de spam (simple pour l'exemple)
    let result;
    if (body.includes('prize') || body.includes('win')) {
      result = 'spam';
    } else {
      result = 'non-spam';
    }

    const email = new Email({ object, body, result });
    await email.save();
    res.status(201).send(email);
  } catch (err) {
    res.status(500).send('Erreur lors de l\'analyse de l\'email');
  }
});

// Route pour récupérer l'historique des emails analysés
router.get('/emails', authMiddleware, async (req, res) => {
  try {
    const emails = await Email.find();
    res.status(200).send(emails);
  } catch (err) {
    res.status(500).send('Erreur lors de la récupération des emails');
  }
});

module.exports = router;
