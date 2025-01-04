// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/forgot-password', { email });
      setMessage('Un email de réinitialisation a été envoyé.');
    } catch (err) {
      setError('Erreur lors de la demande. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <h1>Mot de passe oublié</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Réinitialiser le mot de passe</button>
      </form>
    </div>
  );
};

const styles = {
  input: {
    display: 'block',
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    maxWidth: '300px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default ForgotPassword;
