import React from 'react';

const AnalysisResult = ({ result, details }) => {
  if (!result) return null;

  return (
    <div style={styles.container}>
      <h3>Résultat de l'analyse</h3>
      <p><strong>Type : </strong>{result}</p>
      <p><strong>Détails : </strong></p>
      <ul>
        <li>Spam : {details.isSpam ? 'Oui' : 'Non'}</li>
        <li>Phishing : {details.isPhishing ? 'Oui' : 'Non'}</li>
      </ul>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
};

export default AnalysisResult;
