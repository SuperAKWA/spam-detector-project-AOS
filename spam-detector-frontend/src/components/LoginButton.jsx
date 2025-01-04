import React from 'react';

const LoginButton = () => {
    const handleLogin = () => {
        //Logique de connexion
        alert('Connexion non implémentée');
    }
    return (
        <button onClick={handleLogin} style={styles.button}>
            Connexion
        </button>
    );
};

const styles = {
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default LoginButton;