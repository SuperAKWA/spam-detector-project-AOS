// Import de Mongoose pour gérer les interactions avec MongoDB
const mongoose = require('mongoose');
// Import de bcrypt pour le hachage et la vérification des mots de passe
const bcrypt = require('bcryptjs');

// Définition du schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
  email: {
    type: String, // Champ pour l'email de l'utilisateur
    required: true, // L'email est obligatoire
    unique: true, // Chaque email doit être unique dans la base de données
    lowercase: true, // Convertit automatiquement l'email en lettres minuscules
  },
  password: {
    type: String, // Champ pour le mot de passe de l'utilisateur
    required: true, // Le mot de passe est obligatoire
  },
});

// Middleware exécuté avant de sauvegarder un utilisateur
userSchema.pre('save', async function (next) {
  // Vérifie si le mot de passe a été modifié
  if (this.isModified('password')) {
    // Hash le mot de passe avec bcrypt et une complexité de 8
    this.password = await bcrypt.hash(this.password, 8);
  }
  // Passe au prochain middleware ou termine l'exécution
  next();
});

// Méthode pour vérifier si un mot de passe correspond à celui stocké
userSchema.methods.comparePassword = async function (password) {
  // Compare le mot de passe fourni avec le mot de passe haché dans la base
  return bcrypt.compare(password, this.password);
};

// Création du modèle User basé sur le schéma défini
const User = mongoose.model('User', userSchema);

// Export du modèle pour permettre son utilisation dans d'autres parties de l'application
module.exports = User;
