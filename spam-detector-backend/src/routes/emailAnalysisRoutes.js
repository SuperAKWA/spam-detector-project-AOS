const express = require('express');
const router = express.Router(); // Création d'un routeur Express
const axios = require('axios'); // Utilisé pour effectuer des requêtes HTTP
const keywords = require('../data/keywords.json'); // Importation des mots-clés pour l'analyse

// Fonction pour détecter les liens dans un texte
const extractLinks = (text) => {
  
  // Utilise une expression régulière pour extraire toutes les URL présentes dans le texte 
  const urlRegex = /https?:\/\/[^\s]+/g;
  return text.match(urlRegex) || []; // Retourne les liens trouvés ou un tableau vide
};

// Fonction pour vérifier les liens via VirusTotal
const checkLinksWithAPI = async (links) => {
  /* 
  Envoie les liens fournis à l'API VirusTotal pour vérifier leur statut
     (par exemple : "Malicious", "Safe", etc.) 
  */
  const apiKey = process.env.VIRUSTOTAL_API_KEY; // Clé API nécessaire pour authentifier les requêtes
  const results = [];

  console.log('Début de la vérification des liens avec VirusTotal...');
  for (const link of links) {
    try {
      console.log(`Analyse de l’URL : ${link}`);
      
      // Étape 1 : Soumettre le lien à VirusTotal
      const submitResponse = await axios.post(
        'https://www.virustotal.com/api/v3/urls',
        new URLSearchParams({ url: link }).toString(),
        {
          headers: {
            'x-apikey': apiKey,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log(`Soumission réussie pour l’URL : ${link}`);
      const analysisId = submitResponse.data.data.id;

      // Étape 2 : Récupérer les résultats de l’analyse
      const analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: { 'x-apikey': apiKey },
        }
      );

      // Analyse des résultats obtenus
      const stats = analysisResponse.data.data.attributes.stats;
      if (stats.malicious > 0) {
        results.push({ link, status: 'Malicious' }); // Si le lien est malveillant
        console.log(`Lien détecté comme malveillant : ${link}`);
      } else {
        results.push({ link, status: 'Safe' }); // Si le lien est sûr
        console.log(`Lien détecté comme sûr : ${link}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l’analyse de l’URL ${link}:`, error.response?.data || error.message);
      results.push({ link, status: 'Unknown' }); // En cas d'erreur, le statut est "Unknown"
    }
  }

  console.log('Fin de la vérification des liens avec VirusTotal.');
  return results;
};

// Fonction pour analyser un email
const analyzeEmail = async (subject, body) => {
  /* 
  Analyse un email en utilisant :
     - Les liens extraits du contenu
     - Les mots-clés pour détecter les probabilités de spam/phishing/promotion 
  */
  const totalWords = (subject + " " + body).split(/\s+/).length; // Compte le nombre total de mots
  let totalWeights = { spam: 0, phishing: 0, promotion: 0 };
  let keywordsUsed = { spam: [], phishing: [], promotion: [] };
  const alerts = [];

  console.log('Extraction des liens dans le contenu...');
  const links = extractLinks(subject + " " + body); // Extraction des liens
  console.log(`Liens détectés : ${links.join(', ')}`);

  console.log('Début de l’analyse des liens...');
  const apiResults = await checkLinksWithAPI(links); // Vérification des liens avec VirusTotal
  const maliciousLinks = apiResults.filter((result) => result.status === 'Malicious').map((result) => result.link);
  console.log(`Liens malveillants détectés : ${maliciousLinks.join(', ')}`);

  if (maliciousLinks.length > 0) {
    alerts.push(`Attention : ${maliciousLinks.length} lien(s) malveillant(s) détecté(s).`);
  }

  const impactFactor = 1.2; // Facteur de pondération pour ajuster l'impact des mots-clés

  // Analyse des mots-clés dans le sujet et le corps de l'email
  for (const category in keywords) {
    keywords[category].forEach(({ word, weight }) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = (subject + " " + body).match(regex);
      if (matches) {
        totalWeights[category] += weight * matches.length * impactFactor;
        keywordsUsed[category].push(word);
      }
    });
  }

  // Calcul des probabilités pour chaque catégorie
  const probabilities = {
    spam: Math.min(100, (Math.sqrt(totalWeights.spam) / Math.sqrt(totalWords)) * 100),
    phishing: Math.min(100, (Math.sqrt(totalWeights.phishing) / Math.sqrt(totalWords)) * 100),
    promotion: Math.min(100, (Math.sqrt(totalWeights.promotion) / Math.sqrt(totalWords)) * 100),
  };

  // Ajustements basés sur les mots-clés trouvés
  Object.keys(probabilities).forEach((category) => {
    if (keywordsUsed[category].length >= 3) {
      probabilities[category] += 5;
    }
    if (keywordsUsed[category].length === 1) {
      probabilities[category] *= 0.9;
    }
  });

  // Augmente la probabilité de phishing si des liens malveillants sont détectés
  if (maliciousLinks.length > 0) {
    probabilities.phishing += maliciousLinks.length * 20;
  }

  if (probabilities.spam > 100){
    probabilities.spam = 100;
  }

  if (probabilities.phishing > 100){
    probabilities.phishing = 100;
  }

  if (probabilities.promotion > 100){
    probabilities.promotion = 100;
  }

  // Détermination des catégories de l'email
  const labels = Object.keys(probabilities).filter(cat => probabilities[cat] > 20);

  console.log('Analyse terminée.');
  return {
    labels,
    probabilities,
    alerts,
    details: {
      keywordsUsed,
      totalWeight: totalWeights,
      totalWords,
      links: {
        detected: links,
        malicious: maliciousLinks,
      },
    },
  };
};

// Route pour l’analyse classique via formulaire
router.post('/', async (req, res) => {
  // Reçoit une requête avec le sujet et le corps d'un email pour analyse
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token reçu dans la requête :', token); // Log du token pour le débogage

  const { subject, body } = req.body;

  if (!subject || !body) {
    return res.status(400).send('Objet et corps d’email requis.'); // Validation des données
  }

  try {
    console.log('Début de l’analyse de l’email via formulaire...');
    const result = await analyzeEmail(subject, body); // Appel à la fonction d'analyse
    console.log('Résultat de l’analyse :', JSON.stringify(result, null, 2));

    if (token) {
      // Envoi des résultats à l'historique utilisateur via une API externe
      console.log('Envoi de l’analyse à l\'historique utilisateur...');
      await axios.post(
        'http://auth-services:4000/auth/history', 
        { subject, body, ...result },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Analyse ajoutée à l\'historique utilisateur.');
    } else {
      console.log('Aucun token fourni, historique non mis à jour.');
    }

    res.status(200).send(result); // Retourne les résultats de l'analyse
  } catch (error) {
    console.error('Erreur lors de l’analyse classique :', error);
    res.status(500).send('Erreur lors de l’analyse.');
  }
});

module.exports = router; // Exportation du routeur
