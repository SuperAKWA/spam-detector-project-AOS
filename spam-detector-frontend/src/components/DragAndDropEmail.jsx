import React, { useState } from 'react';
import axios from 'axios';

const DragAndDropEmail = ({ onAnalysisResult }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];

    if (!file) {
      setError('Aucun fichier détecté.');
      return;
    }

    const formData = new FormData();
    formData.append('emailFile', file);

    try {
      const response = await axios.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onAnalysisResult(response.data);
    } catch (err) {
      console.error(err);
      setError("L'analyse a échoué.");
    }
  };

  return (
    <div
      style={{
        ...styles.container,
        ...(isDragging ? styles.dragging : {}),
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      Glissez-déposez un fichier d'email ici
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    border: '2px dashed #3B82F6',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    color: '#3B82F6',
    fontSize: '18px',
    transition: 'background-color 0.3s, color 0.3s',
    backgroundColor: '#F8FAFC',
  },
  dragging: {
    backgroundColor: '#E0F2FE',
    color: '#1E293B',
  },
};

export default DragAndDropEmail;
