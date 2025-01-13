// routes/emailRoutes.js

const express = require('express');
const Email = require('../models/Email'); // Modèle pour gérer les emails dans la base de données
const authMiddleware = require('../middleware/authMiddleware'); // Middleware pour vérifier l'authentification

const router = express.Router(); // Création d'un routeur Express

// Route pour soumettre un email pour analyse
router.post('/analyze', authMiddleware, async (req, res) => {
  /* 
  Cette route permet de soumettre un email (sujet et corps) pour analyse.
     Elle est protégée par un middleware d'authentification. 
  */
  const { object, body } = req.body; // Récupération des champs de l'email

  try {
    // Logique simple pour détecter les spams
    let result;
    if (body.includes('prize') || body.includes('win')) {
      /* 
      Si le corps de l'email contient certains mots-clés spécifiques, 
         on le marque comme spam. 
      */
      result = 'spam';
    } else {
      result = 'non-spam';
    }

    // Création d'une instance d'email à partir du modèle
    const email = new Email({ object, body, result });
    await email.save(); // Sauvegarde de l'email dans la base de données

    res.status(201).send(email); // Retourne l'email enregistré avec son analyse
  } catch (err) {
    // Gestion des erreurs pendant le traitement
    res.status(500).send('Erreur lors de l\'analyse de l\'email');
  }
});

// Route pour récupérer l'historique des emails analysés
router.get('/emails', authMiddleware, async (req, res) => {
  /* 
  Cette route permet de récupérer tous les emails analysés.
     Elle est protégée par un middleware d'authentification. 
  */
  try {
    const emails = await Email.find(); // Récupère tous les emails depuis la base de données
    res.status(200).send(emails); // Retourne la liste des emails analysés
  } catch (err) {
    // Gestion des erreurs pendant la récupération
    res.status(500).send('Erreur lors de la récupération des emails');
  }
});

module.exports = router; // Exportation du routeur
