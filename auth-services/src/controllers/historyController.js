const User = require('../models/User');

exports.addToHistory = async (req, res) => {
  const userId = req.user.userId;
  const analysisData = req.body;

  console.log(`Ajout à l'historique pour l'utilisateur ID : ${userId}`);
  console.log(`Données à ajouter à l'historique :`, analysisData);

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error(`Utilisateur non trouvé avec l'ID : ${userId}`);
      return res.status(404).send('Utilisateur non trouvé');
    }

    console.log(`Utilisateur trouvé : ${user.email}`);
    user.history.push(analysisData);
    await user.save();

    console.log(`Historique mis à jour pour l'utilisateur : ${user.email}`);
    res.status(200).send('Analyse ajoutée à l\'historique');
  } catch (error) {
    console.error(`Erreur lors de l'ajout à l'historique pour l'utilisateur ID : ${userId}`, error);
    res.status(500).send('Erreur lors de l\'ajout à l\'historique');
  }
};
