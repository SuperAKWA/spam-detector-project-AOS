// src/pages/HistoryPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import History from '../components/History';

const HistoryPage = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Appel API pour récupérer l'historique des emails
    const fetchEmails = async () => {
      try {
        const response = await axios.get('/api/emails');
        setEmails(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'historique', err);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div>
      <h1>Historique des emails analysés</h1>
      <History emails={emails} />
    </div>
  );
};

export default HistoryPage;
