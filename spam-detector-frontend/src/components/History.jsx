// src/components/History.jsx
import React from 'react';

const History = ({ emails }) => {
  return (
    <ul style={styles.list}>
      {emails.map((email) => (
        <li key={email._id} style={styles.listItem}>
          <strong>Objet :</strong> {email.object || 'Aucun objet'} <br />
          <strong>Résultat :</strong> {email.result} <br />
          <strong>Date :</strong> {new Date(email.date).toLocaleString()}
        </li>
      ))}
    </ul>
  );
};

const styles = {
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    marginBottom: '20px',
    padding: '10px',
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
  },
};

export default History;
