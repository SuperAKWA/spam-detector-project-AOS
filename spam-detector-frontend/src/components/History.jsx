import React from 'react';

const History = ({ emails }) => {
  const getLabelStyle = (label) => {
    switch (label) {
      case 'spam':
        return { backgroundColor: '#EF4444', color: '#FFFFFF' }; // Rouge clair
      case 'phishing':
        return { backgroundColor: '#F59E0B', color: '#FFFFFF' }; // Orange clair
      case 'promotion':
        return { backgroundColor: '#3B82F6', color: '#FFFFFF' }; // Bleu clair
      default:
        return { backgroundColor: '#E5E7EB', color: '#374151' }; // Gris clair
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Historique des emails analysés</h1>
      <div style={styles.gridContainer}>
        {emails.map((email, index) => (
          <div
            key={email._id}
            style={{
              ...styles.card,
              backgroundColor: index % 2 === 0 ? '#F9FAFB' : '#FFFFFF',
            }}
          >
            <div style={styles.cardHeader}>
              <p style={styles.object}>
                <strong>Objet :</strong> {email.subject || 'Aucun objet'}
              </p>
              <p style={styles.date}>
                {new Date(email.date).toLocaleString('fr-FR')}
              </p>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.resultSection}>
                <strong>Résultat :</strong>
                <div style={styles.labelsContainer}>
                  {email.result?.labels?.length > 0 ? (
                    email.result.labels.map((label, i) => (
                      <span
                        key={i}
                        style={{
                          ...styles.label,
                          ...getLabelStyle(label),
                        }}
                      >
                        {label.toUpperCase()}
                      </span>
                    ))
                  ) : (
                    <span style={styles.noResult}>Aucun résultat détecté</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: 'auto',
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#1E293B',
    textAlign: 'center',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #E5E7EB',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  object: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1F2937',
  },
  date: {
    fontSize: '14px',
    color: '#6B7280',
  },
  cardBody: {
    fontSize: '14px',
    color: '#4B5563',
  },
  resultSection: {
    marginTop: '10px',
  },
  labelsContainer: {
    marginTop: '5px',
    display: 'flex',
    gap: '8px',
  },
  label: {
    padding: '5px 10px',
    borderRadius: '50px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  noResult: {
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
};

export default History;
