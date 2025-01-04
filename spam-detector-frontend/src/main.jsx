import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';
import { AuthProvider } from './context/authContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
