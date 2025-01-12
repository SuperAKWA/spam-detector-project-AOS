const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/spam-detector', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur lors de la connexion à MongoDB :', err));

// Import des routes
const emailAnalysisRoutes = require('./routes/emailAnalysisRoutes'); 
const fileAnalysisRoutes = require('./routes/fileAnalysisRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const emailRoutes = require('./routes/emailRoutes'); 

// Utilisation des routes
app.use('/auth', authRoutes);            // Routes pour l'authentification
app.use('/analyze', emailAnalysisRoutes); // Routes pour l'analyse via formulaire
app.use('/file', fileAnalysisRoutes);    // Routes pour l'analyse via fichiers
app.use('/email', emailRoutes);          // Routes pour gérer les emails

// Middleware pour les routes non trouvées
app.use((req, res) => {
  console.error(`Route non trouvée : ${req.method} ${req.originalUrl}`);
  res.status(404).send('Route non trouvée');
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});
