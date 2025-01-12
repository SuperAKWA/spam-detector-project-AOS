import React, { useState } from 'react';
import axios from 'axios';
import AnalysisResult from './AnalysisResult';
import Spinner from './Spinner';

const DragAndDropEmail = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    setError(null);
    setResult(null);
  
    const file = e.dataTransfer.files[0];
  
    if (!file) {
      setError('Aucun fichier détecté.');
      return;
    }
  
    const allowedTypes = ['json', 'txt', 'eml', 'docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
  
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Type de fichier non pris en charge (${fileExtension}).`);
      return;
    }
  
    const formData = new FormData();
    formData.append('emailFile', file);
  
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5001/file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ajout du token
        },
      });
      
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("L'analyse a échoué.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div>
      <div
        style={{
          ...styles.container,
          ...(isDragging ? styles.dragging : {}),
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        Glissez-déposez un fichier (.json, .txt, .eml, .docx) ici
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>
      {isLoading && <Spinner />}
      {result && <AnalysisResult result={result} />}
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
