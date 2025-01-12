import React, { useEffect, useState } from 'react';
import axios from 'axios';
import History from '../components/History';

const HistoryPage = () => {
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get('/auth/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log('Données récupérées pour l\'historique :', response.data); // Log pour vérifier
        setEmails(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'historique', err);
      }
    };
  
    fetchEmails();
  }, []);
  

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      {emails.length > 0 ? (
        <History emails={emails} />
      ) : (
        <p>Aucun email analysé pour l'instant.</p>
      )}
    </div>
  );
};

export default HistoryPage;
