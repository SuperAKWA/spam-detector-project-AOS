const express = require('express');
const request = require('supertest');
const emailRoutes = require('../spam-detector-backend/src/routes/emailRoutes');

// Mock des dépendances
const Email = require('../spam-detector-backend/src/models/Email');
const authMiddleware = require('../spam-detector-backend/src/middleware/authMiddleware');

// Mock du modèle Email
jest.mock('../spam-detector-backend/src/models/Email');
jest.mock('../spam-detector-backend/src/middleware/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/emails', emailRoutes);

describe('Tests des routes emailRoutes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /emails/analyze', () => {
    it('devrait analyser un email et sauvegarder le résultat', async () => {
      Email.mockImplementation((data) => ({
        ...data, // Utilise les données fournies à l'implémentation
        save: jest.fn(),
      }));

      const response = await request(app)
        .post('/emails/analyze')
        .send({ object: 'Test', body: 'Ce message contient le mot win' });

      // Vérifications
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        object: 'Test',
        body: 'Ce message contient le mot win',
        result: 'spam',
      }));
    });
  });

  describe('GET /emails/emails', () => {
    it('devrait récupérer la liste des emails analysés', async () => {
      const mockEmails = [
        { object: 'Email 1', body: 'Contenu 1', result: 'spam' },
        { object: 'Email 2', body: 'Contenu 2', result: 'non-spam' },
      ];
      Email.find.mockResolvedValue(mockEmails);

      const response = await request(app).get('/emails/emails'); // Correction de l'URL

      // Vérifications
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockEmails);
    });

    it('devrait retourner une erreur 500 en cas de problème avec la base de données', async () => {
      Email.find.mockImplementation(() => {
        throw new Error('Erreur MongoDB');
      });

      const response = await request(app).get('/emails/emails'); // Correction de l'URL

      // Vérifications
      expect(response.status).toBe(500);
      expect(response.text).toBe("Erreur lors de la récupération des emails");
    });
  });
});
