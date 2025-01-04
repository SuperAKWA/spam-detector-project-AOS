import React, { useState } from 'react';
import DragAndDropEmail from '../components/DragAndDropEmail';
import axios from 'axios';

const Home = () => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/analyze', {
        subject: emailSubject,
        body: emailBody,
      });
      setAnalysisResult(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError("L'analyse a échoué.");
      setAnalysisResult(null);
    }
  };

  const handleAnalysisResult = (result) => {
    setAnalysisResult(result);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Soumettre un email</h1>
      <div style={styles.dragAndDrop}>
        <DragAndDropEmail onAnalysisResult={handleAnalysisResult} />
      </div>
      <p style={styles.orText}>Ou entrez l'email manuellement :</p>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Objet de l'email"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Corps de l'email"
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>
          Analyser
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {analysisResult && (
        <div style={styles.resultContainer}>
          <h2 style={styles.resultTitle}>Résultat de l'analyse</h2>
          <p>
            <strong>Labels détectés :</strong>{' '}
            {analysisResult.labels.length > 0 ? analysisResult.labels.join(', ') : 'Aucun'}
          </p>
          <h3>Probabilités :</h3>
          <ul>
            <li>Spam : {analysisResult.probabilities.spam.toFixed(2)}%</li>
            <li>Phishing : {analysisResult.probabilities.phishing.toFixed(2)}%</li>
            <li>Promotion : {analysisResult.probabilities.promotion.toFixed(2)}%</li>
          </ul>
          <h3>Mots-clés détectés :</h3>
          <ul>
            <li>Spam : {analysisResult.details.keywordsUsed.spam.join(', ') || 'Aucun'}</li>
            <li>Phishing : {analysisResult.details.keywordsUsed.phishing.join(', ') || 'Aucun'}</li>
            <li>Promotion : {analysisResult.details.keywordsUsed.promotion.join(', ') || 'Aucun'}</li>
          </ul>
          <p>
            <strong>Total de mots :</strong> {analysisResult.details.totalWords}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: 'auto',
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1E293B',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    margin: '20px 0',
    fontSize: '16px',
    color: '#4B5563',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    width: '100%',
    maxWidth: '500px',
    fontSize: '16px',
  },
  textarea: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    width: '100%',
    maxWidth: '500px',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  resultContainer: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: '#F9FAFB',
  },
  resultTitle: {
    fontSize: '20px',
    marginBottom: '10px',
    color: '#1E293B',
  },
};

export default Home;
