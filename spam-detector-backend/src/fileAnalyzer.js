const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fileAnalysisRoutes = require('./routes/fileAnalysisRoutes');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.FILE_ANALYZER_PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/file', fileAnalysisRoutes);

app.use((req, res, next) => {
  console.log(`Requête reçue : ${req.method} ${req.originalUrl}`);
  next();
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur d'analyse de fichiers démarré sur le port ${port}`);
});
