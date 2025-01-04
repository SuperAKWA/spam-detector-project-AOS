// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Sinon, afficher la page demandée
  return children;
};

export default ProtectedRoute;
