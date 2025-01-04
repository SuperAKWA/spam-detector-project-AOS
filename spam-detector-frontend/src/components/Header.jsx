import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>Spam Detector</Link>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Accueil</Link>
        {isAuthenticated && (
          <>
            <Link to="/history" style={styles.link}>Historique</Link>
            <span style={styles.userIcon}>👤</span>
            <button onClick={logout} style={styles.button}>Déconnexion</button>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login" style={styles.link}>Connexion</Link>
            <Link to="/signup" style={styles.link}>Inscription</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    padding: '10px 20px',
    color: 'white',
    fontFamily: "'Inter', sans-serif",
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontFamily: "'Inter', sans-serif",
  },
  button: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    padding: '5px 10px',
  },
  userIcon: {
    fontSize: '18px',
    marginRight: '8px',
  },
};

export default Header;
