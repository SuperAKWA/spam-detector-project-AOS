// controllers/emailController.js
const Email = require('../models/Email');

// Enregistrer un email analysé
const saveEmail = async (emailContent, result) => {
  const email = new Email({
    content: emailContent,
    result: result,
  });

  try {
    await email.save();
    console.log('Email enregistré dans MongoDB');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'email:', err);
  }
};

// Lire les emails depuis la base de données
const getEmails = async () => {
  try {
    const emails = await Email.find();
    return emails;
  } catch (err) {
    console.error('Erreur lors de la récupération des emails:', err);
  }
};

// Exporter les fonctions pour les utiliser ailleurs
module.exports = {
  saveEmail,
  getEmails
};
