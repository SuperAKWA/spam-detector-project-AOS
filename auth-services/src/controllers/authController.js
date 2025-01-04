// src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ token });
  } catch (err) {
    res.status(400).send('Erreur lors de l\'inscription');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('Utilisateur non trouvé');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).send('Mot de passe incorrect');

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).send({ token });
  } catch (err) {
    res.status(500).send('Erreur serveur lors de la connexion');
  }
};

module.exports = { register, login };
