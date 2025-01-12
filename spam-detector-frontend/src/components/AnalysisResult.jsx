import React, { useState } from 'react';
import ResultDetails from './ResultDetails';
import Spinner from './Spinner';

const AnalysisResult = ({ result, isLoading }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  if (!result) {
    return (
      <div style={styles.container}>
        <p>Aucun résultat disponible pour le moment.</p>
      </div>
    );
  }

  const getLabelStyle = (label) => {
    switch (label) {
      case 'spam':
        return styles.spamLabel;
      case 'phishing':
        return styles.phishingLabel;
      case 'promotion':
        return styles.promotionLabel;
      default:
        return styles.defaultLabel;
    }
  };

  const CircleProgressBar = ({ percentage, color, label }) => (
    <div style={styles.progressWrapper}>
      <div style={{ ...styles.progressCircle, background: `conic-gradient(${color} ${percentage}%, #E5E7EB 0)` }}>
        <span style={styles.progressText}>{percentage.toFixed(1)}%</span>
      </div>
      <p style={styles.progressLabel}>{label}</p>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.labelsContainer}>
          {result.labels.length > 0 ? (
            result.labels.map((label, index) => (
              <span key={index} style={{ ...styles.label, ...getLabelStyle(label) }}>
                {label.toUpperCase()}
              </span>
            ))
          ) : (
            <span style={styles.noLabel}>Aucun résultat détecté</span>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Probabilités :</h4>
        <div style={styles.probabilitiesContainer}>
          <CircleProgressBar percentage={result.probabilities.spam} color="#EF4444" label="Spam" />
          <CircleProgressBar percentage={result.probabilities.phishing} color="#F59E0B" label="Phishing" />
          <CircleProgressBar percentage={result.probabilities.promotion} color="#3B82F6" label="Promotion" />
        </div>
      </div>

      {result.details.links.detected.length > 0 && (
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Liens détectés :</h4>
          <ul style={styles.linksList}>
            {result.details.links.detected.map((link, index) => (
              <li
                key={index}
                style={{
                  ...styles.linkItem,
                  color: result.details.links.malicious.includes(link) ? 'red' : 'green',
                }}
              >
                {link}{' '}
                {result.details.links.malicious.includes(link)
                  ? '(Malveillant)'
                  : '(Sûr)'}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => setShowDetails(!showDetails)} style={styles.button}>
        {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
      </button>
      {showDetails && <ResultDetails details={result.details} />}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#F8FAFC',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '20px',
  },
  labelsContainer: {
    display: 'flex',
    gap: '10px',
  },
  label: {
    padding: '5px 10px',
    borderRadius: '50px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#fff',
  },
  spamLabel: {
    backgroundColor: '#EF4444',
  },
  phishingLabel: {
    backgroundColor: '#F59E0B',
  },
  promotionLabel: {
    backgroundColor: '#3B82F6',
  },
  defaultLabel: {
    backgroundColor: '#E5E7EB',
    color: '#374151',
  },
  noLabel: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '10px',
  },
  probabilitiesContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  progressWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progressCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#374151',
  },
  progressLabel: {
    marginTop: '5px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#374151',
  },
  linksList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  linkItem: {
    fontSize: '14px',
    marginBottom: '5px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 15px',
    backgroundColor: '#3B82F6',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default AnalysisResult;
