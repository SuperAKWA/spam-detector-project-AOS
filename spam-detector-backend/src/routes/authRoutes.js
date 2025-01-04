const express = require('express');
const User = require('../models/User'); // Vérifie aussi que le fichier User.js existe !
const jwt = require('jsonwebtoken');

const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ token });
  } catch (err) {
    res.status(422).send('Erreur lors de l\'inscription');
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).send('Mot de passe incorrect');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (err) {
    res.status(500).send('Erreur serveur lors de la connexion');
  }
});

module.exports = router;
