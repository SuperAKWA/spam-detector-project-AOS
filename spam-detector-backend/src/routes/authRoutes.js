const express = require('express');
const User = require('../models/User'); // Importation du modèle User pour interagir avec la base de données
const jwt = require('jsonwebtoken'); // Utilisé pour générer des tokens JWT

const router = express.Router(); // Création d'un routeur Express pour définir les routes spécifiques

// Inscription
router.post('/signup', async (req, res) => {
  /* 
  Route POST pour permettre à un utilisateur de s'inscrire
     - L'utilisateur envoie un email et un mot de passe
     - Le mot de passe est automatiquement haché avant d'être sauvegardé grâce à la méthode définie dans le modèle User 
  */
  const { email, password } = req.body;
  try {
    // Création d'une nouvelle instance de User avec les données reçues
    const user = new User({ email, password });
    await user.save(); // Sauvegarde de l'utilisateur dans la base de données

    // Génération d'un token JWT pour identifier l'utilisateur après son inscription
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Réponse avec le token généré
    res.status(201).send({ token });
  } catch (err) {
    // En cas d'erreur (ex. email déjà utilisé), retourner une erreur 422
    res.status(422).send('Erreur lors de l\'inscription');
  }
});

// Connexion
router.post('/login', async (req, res) => {
  /* 
  Route POST pour permettre à un utilisateur de se connecter
     - L'utilisateur fournit son email et son mot de passe
     - Vérification si l'utilisateur existe et si le mot de passe est correct 
  */
  const { email, password } = req.body;
  try {
    // Recherche de l'utilisateur dans la base de données par son email
    const user = await User.findOne({ email });
    if (!user) {
      // Si l'utilisateur n'existe pas, retourner une erreur 404
      return res.status(404).send('Utilisateur non trouvé');
    }

    // Vérification du mot de passe fourni avec celui stocké dans la base de données
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Si le mot de passe est incorrect, retourner une erreur 401
      return res.status(401).send('Mot de passe incorrect');
    }

    // Génération d'un token JWT pour identifier l'utilisateur après sa connexion
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    // Réponse avec le token généré
    res.send({ token });
  } catch (err) {
    // En cas d'erreur serveur, retourner une erreur 500
    res.status(500).send('Erreur serveur lors de la connexion');
  }
});

module.exports = router; // Exportation du routeur pour l'utiliser dans l'application principale
