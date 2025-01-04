// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Récupérer le token d'authentification depuis les en-têtes de la requête
  const token = req.headers.authorization?.split(' ')[1]; // Format attendu : "Bearer <token>"

  if (!token) {
    return res.status(401).send('Accès non autorisé');
  }

  try {
    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter l'information de l'utilisateur au req pour les utiliser dans les routes si besoin
    next(); // Passer au middleware suivant ou à la route
  } catch (err) {
    return res.status(403).send('Token invalide');
  }
};

module.exports = authMiddleware;
