// routes/authRoutes.js
const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { addToHistory, getHistory } = require('../controllers/historyController'); // Import des fonctions du contrôleur d'historique

const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  console.log("Route /signup appelée avec : ", req.body);
  const { email, password } = req.body;

  try {
    console.log("Tentative de création d'utilisateur...");
    const user = new User({ email, password });
    await user.save();
    console.log("Utilisateur enregistré avec succès :", user);

    // Générer un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ token });
  } catch (err) {
    console.error('Erreur lors de l\'inscription :', err);
    res.status(422).send('Erreur lors de l\'inscription');
  }
});

// Connexion
router.post('/login', async (req, res) => {
  console.log('Route /login appelée avec :', req.body);
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé avec cet email : ', email);
      return res.status(404).send('Utilisateur non trouvé');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Mot de passe incorrect pour l\'email :', email);
      return res.status(401).send('Mot de passe incorrect');
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    console.log('Connexion réussie, token généré pour l\'utilisateur :', user.email);
    res.send({ token });
  } catch (err) {
    console.error('Erreur serveur lors de la connexion :', err);
    res.status(500).send('Erreur serveur lors de la connexion');
  }
});

// Ajouter à l'historique
// Ajouter à l'historique
router.post('/history', authMiddleware, async (req, res) => {
  const userId = req.user.userId; // ID récupéré depuis le token
  const { subject, body, labels, probabilities, details } = req.body;

  try {
    console.log(`Requête reçue pour ajouter une analyse pour l'utilisateur ID : ${userId}`);

    const newAnalysis = {
      subject,
      body,
      result: { labels, probabilities, details },
      date: new Date(),
    };

    console.log('Analyse à ajouter :', newAnalysis);

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { history: newAnalysis } }, // Ajout à l'historique
      { new: true, upsert: true }          // Retourne le document mis à jour
    );

    console.log('Utilisateur après mise à jour :', user);

    res.status(200).send('Analyse ajoutée à l\'historique.');
  } catch (err) {
    console.error('Erreur lors de l\'ajout à l\'historique :', err);
    res.status(500).send('Erreur serveur.');
  }
});

// Récupérer l'historique
router.get('/history', authMiddleware, async (req, res) => {
  const userId = req.user.userId; // ID récupéré depuis le token

  try {
    console.log(`Requête reçue pour récupérer l'historique pour l'utilisateur ID : ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log('Utilisateur introuvable pour ID :', userId);
      return res.status(404).send('Utilisateur non trouvé.');
    }

    console.log(`Historique récupéré pour l'utilisateur ID : ${userId}`, user.history);

    res.status(200).send(user.history);
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'historique :', err);
    res.status(500).send('Erreur serveur.');
  }
});

module.exports = router;
