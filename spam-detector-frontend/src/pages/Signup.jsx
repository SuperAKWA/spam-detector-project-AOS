import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/signup', { email, password });
      navigate('/login');
    } catch (err) {
      setError('Erreur lors de l\'inscription.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Inscription</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">S'inscrire</button>
      </form>
      <div className="link-container">
        <p>
          Déjà un compte ? <Link to="/login" className="link">Connexion</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
