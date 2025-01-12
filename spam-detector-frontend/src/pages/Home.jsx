import React, { useState } from 'react';
import DragAndDropEmail from '../components/DragAndDropEmail';
import AnalysisResult from '../components/AnalysisResult'; // Réutilisation du composant AnalysisResult
import axios from 'axios';

const Home = () => {
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Utilisateur non authentifié. Veuillez vous connecter.');
      }

      console.log('Token JWT récupéré :', token);

      // Appel de l'API pour analyser l'email
      const response = await axios.post(
        'http://localhost:5001/analyze',
        { subject: emailSubject, body: emailBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnalysisResult(response.data); // Enregistrement du résultat de l'analyse
      setError('');
    } catch (err) {
      console.error(err);
      setError(err.message || "L'analyse a échoué.");
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisResult = (result) => {
    setAnalysisResult(result);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analysez vos emails</h1>
      <div style={styles.dragAndDrop}>
        <DragAndDropEmail onAnalysisResult={handleAnalysisResult} />
      </div>
      <p style={styles.orText}>Ou soumettez un email manuellement :</p>
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
          {loading ? <span className="spinner" /> : 'Analyser'}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      {analysisResult && (
        <div style={styles.resultContainer}>
          <AnalysisResult result={analysisResult} isLoading={loading} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: 'auto',
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1E293B',
    textAlign: 'center',
  },
  dragAndDrop: {
    marginBottom: '20px',
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
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  resultContainer: {
    marginTop: '30px',
  },
};

export default Home;
