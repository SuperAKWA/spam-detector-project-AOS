const axios = require('axios');

const testVirusTotalAPI = async () => {
  const apiKey = 'c59ea4bc9b1db78f7492244ce9425458a287efdf9fe80d46097d0c11aaad2712';
  const link = 'https://www.google.com'; // Changez ce lien pour tester d'autres URLs

  try {
    // Étape 1 : Enregistrement de l'URL dans VirusTotal
    const submitResponse = await axios.post(
      'https://www.virustotal.com/api/v3/urls',
      new URLSearchParams({ url: link }).toString(),
      {
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded', // Important pour ce type de requête
        },
      }
    );

    // Étape 2 : Récupération de l'ID d'analyse
    const urlId = submitResponse.data.data.id;

    // Étape 3 : Analyse des résultats
    const analysisResponse = await axios.get(
      `https://www.virustotal.com/api/v3/analyses/${urlId}`,
      {
        headers: { 'x-apikey': apiKey },
      }
    );

    console.log('Analyse VirusTotal:', analysisResponse.data);
  } catch (error) {
    console.error('Erreur lors de l’appel à VirusTotal:', error.message);
    if (error.response) {
      console.error('Détails de l’erreur:', error.response.data);
    }
  }
};

testVirusTotalAPI();
