const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/auth-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB pour auth-service connecté'))
  .catch((err) => console.error('Erreur lors de la connexion à MongoDB :', err));


// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Lancer le serveur
app.listen(port, () => {
  console.log(`auth-service démarré sur le port ${port}`);
});
