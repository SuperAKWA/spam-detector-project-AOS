import React from 'react';

const ResultDetails = ({ details }) => {
  if (!details) return null;

  const renderKeywords = (category, keywords) => (
    <div style={styles.keywordCategory}>
      <h4 style={styles.categoryTitle}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h4>
      <div style={styles.badgeContainer}>
        {keywords.length > 0 ? (
          keywords.map((keyword, index) => (
            <span key={index} style={styles.badge}>
              {keyword}
            </span>
          ))
        ) : (
          <span style={styles.noData}>Aucun mot-clé détecté</span>
        )}
      </div>
    </div>
  );

  const renderLinks = (links, maliciousLinks) => (
    <div>
      <h4 style={styles.categoryTitle}>Liens détectés</h4>
      <div style={styles.linksContainer}>
        {links.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.link,
              color: maliciousLinks.includes(link) ? 'red' : 'green',
            }}
          >
            {link}{' '}
            {maliciousLinks.includes(link) ? '(Malveillant)' : '(Sûr)'}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Détails de l'analyse</h3>
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Mots-clés détectés</h4>
        <div style={styles.keywordsContainer}>
          {renderKeywords('spam', details.keywordsUsed.spam)}
          {renderKeywords('phishing', details.keywordsUsed.phishing)}
          {renderKeywords('promotion', details.keywordsUsed.promotion)}
        </div>
      </div>
      {details.links.detected.length > 0 && (
        <div style={styles.section}>
          {renderLinks(details.links.detected, details.links.malicious)}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Roboto', sans-serif",
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: '20px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: '10px',
  },
  keywordsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  keywordCategory: {
    flex: '1',
    padding: '10px',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    backgroundColor: '#F9FAFB',
  },
  categoryTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '10px',
  },
  badgeContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  badge: {
    backgroundColor: '#3B82F6',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  noData: {
    fontStyle: 'italic',
    color: '#9CA3AF',
    fontSize: '14px',
  },
  linksContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '14px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default ResultDetails;
