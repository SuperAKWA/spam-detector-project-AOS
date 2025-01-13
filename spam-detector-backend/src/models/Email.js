// Import de Mongoose pour gérer les interactions avec la base de données MongoDB
const mongoose = require('mongoose');

// Définition du schéma pour les emails analysés
const emailSchema = new mongoose.Schema({
  object: {
    type: String, // Le sujet de l'email
    required: true, // Le sujet est obligatoire
  },
  body: {
    type: String, // Le corps du message
    required: true, // Le corps est obligatoire
  },
  result: {
    type: String, // Le résultat de l'analyse de l'email
    enum: ['spam', 'non-spam', 'phishing'], // Limité aux valeurs possibles
    required: true, // Le résultat est obligatoire
  },
  date: {
    type: Date, // Date d'analyse de l'email
    default: Date.now, // Par défaut, la date actuelle
  },
});

// Création du modèle Email basé sur le schéma défini
const Email = mongoose.model('Email', emailSchema);

// Export du modèle pour pouvoir l'utiliser dans d'autres fichiers
module.exports = Email;
