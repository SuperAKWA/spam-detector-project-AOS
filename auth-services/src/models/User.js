const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Définition d'un sous-schéma pour l'historique
const historySchema = new mongoose.Schema({
  subject: { type: String, required: true },
  body: { type: String, required: true },
  result: {
    labels: [String],
    probabilities: {
      spam: { type: Number, required: true },
      phishing: { type: Number, required: true },
      promotion: { type: Number, required: true },
    },
    details: {
      keywordsUsed: {
        spam: [String],
        phishing: [String],
        promotion: [String],
      },
      totalWeight: {
        spam: { type: Number, required: true },
        phishing: { type: Number, required: true },
        promotion: { type: Number, required: true },
      },
      totalWords: { type: Number, required: true },
      links: {
        detected: [String],
        malicious: [String],
      },
    },
  },
  date: { type: Date, default: Date.now },
});

// Schéma principal pour l'utilisateur
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  history: {
    type: Array,
    default: [], // Définit un tableau vide par défaut
  },
});



// Hashage du mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Méthode pour vérifier le mot de passe
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
