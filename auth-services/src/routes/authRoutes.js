// routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  console.log("Route /signup appelée avec : ", req.body); // Log pour vérifier si la requête est bien reçue
  const { email, password } = req.body;

  try {
    console.log("Tentative de création d'utilisateur...");
    const user = new User({ email, password });
    await user.save();
    console.log("Utilisateur enregistré avec succès :", user); // Log pour vérifier si l'utilisateur est bien créé

    // Générer un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ token });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err); // Log pour voir les détails de l'erreur
    res.status(422).send('Erreur lors de l\'inscription');
  }
});

// Connexion
router.post('/login', async (req, res) => {
  console.log('Requête reçue sur /login :', req); // Vérifie si la requête est bien reçue  
  console.log('Route /login appelée avec :', req.body); // Suivi
  const { email, password } = req.body;
  console.log(`/login called with: { email: ${email}, password: ${password} }`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé avec cet email : ', email); // Suivi
      return res.status(404).send('Utilisateur non trouvé');
    }

    console.log('Mot de passe reçu pour comparaison :', password);
    console.log('Mot de passe hashé dans la base :', user.password);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Mot de passe incorrect pour l\'email :', email); // Suivi
      return res.status(401).send('Mot de passe incorrect');
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log('Connexion réussie, token généré pour l\'utilisateur :', user.email); // Log en cas de succès
    res.send({ token });
  } catch (err) {
    console.error('Erreur serveur lors de la connexion :', err); // Log détaillé
    res.status(500).send('Erreur serveur lors de la connexion');
  }
});

module.exports = router;
