const { extractLinks, analyzeEmail } = require('../spam-detector-backend/src/routes/emailAnalysisRoutes');

// Mock des fonctions
jest.mock('../spam-detector-backend/src/routes/emailAnalysisRoutes', () => ({
  extractLinks: jest.fn(),
  analyzeEmail: jest.fn(),
}));

describe('Tests des fonctions basiques', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks avant chaque test
  });

  it('devrait extraire les liens correctement', () => {
    // Mock du comportement de extractLinks
    const text = 'Voici un lien : https://example.com.';
    const mockLinks = ['https://example.com'];
    extractLinks.mockReturnValue(mockLinks);

    const result = extractLinks(text);

    expect(result).toEqual(mockLinks);
    expect(extractLinks).toHaveBeenCalledTimes(1);
    expect(extractLinks).toHaveBeenCalledWith(text);
  });

  it('devrait analyser un email et retourner les résultats', async () => {
    // Mock du comportement de analyzeEmail
    const subject = "Test email";
    const body = "Voici un contenu avec un lien : https://example.com.";
    const mockResult = {
      labels: ['spam'],
      probabilities: {
        spam: 80,
        phishing: 10,
        promotion: 10,
      },
      alerts: [],
    };
    analyzeEmail.mockResolvedValue(mockResult);

    const result = await analyzeEmail(subject, body);

    expect(result).toEqual(mockResult);
    expect(analyzeEmail).toHaveBeenCalledTimes(1);
    expect(analyzeEmail).toHaveBeenCalledWith(subject, body);
  });
});

