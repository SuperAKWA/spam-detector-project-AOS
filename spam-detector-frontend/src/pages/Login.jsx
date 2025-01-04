import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      login(response.data.token); // Utilise le contexte pour mettre à jour l'état global
      navigate('/');
    } catch (err) {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Connexion</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="submit-button">Se connecter</button>
      </form>
      <div className="link-container">
        <p>
          Pas encore de compte ? <Link to="/signup" className="link">Inscription</Link>
        </p>
        <p>
          <Link to="/forgot-password" className="link">Mot de passe oublié ?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
