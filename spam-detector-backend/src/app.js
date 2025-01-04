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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur lors de la connexion à MongoDB :', err));

// Import des routes
console.log('Configuration des routes...');
const emailAnalysisRoutes = require('./routes/emailAnalysisRoutes'); 
console.log('Routes emailAnalysisRoutes chargées.');

const authRoutes = require('./routes/authRoutes'); 
console.log('Routes authRoutes chargées.');

const emailRoutes = require('./routes/emailRoutes');
console.log('Routes emailRoutes chargées.');

// Utilisation des routes
app.use('/auth', authRoutes);
app.use('/analyze', emailAnalysisRoutes);
app.use('/email', emailRoutes);

console.log('Routes configurées.');

app.use((req, res, next) => {
  console.log(`Route non trouvée : ${req.method} ${req.originalUrl}`);
  res.status(404).send('Route non trouvée');
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur backend démarré sur le port ${port}`);
});

app.use('/analyze', (req, res, next) => {
  console.log('Request received for /analyze');
  next();
});
