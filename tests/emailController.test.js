const { saveEmail, getEmails } = require('../spam-detector-backend/src/controllers/emailController');

// Mock du modèle Email
const mockSave = jest.fn();
const mockFind = jest.fn();
jest.mock('../spam-detector-backend/src/models/Email', () => {
  return jest.fn().mockImplementation(() => ({
    save: mockSave,
  }));
});
const Email = require('../spam-detector-backend/src/models/Email');
Email.find = mockFind;

describe('Tests unitaires du contrôleur emailController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Réinitialise les mocks avant chaque test
  });

  describe('saveEmail', () => {
    it('devrait enregistrer un email dans la base de données', async () => {
      const emailContent = 'Ceci est un email';
      const result = 'spam';

      // Mock de `save`
      mockSave.mockResolvedValueOnce();

      await saveEmail(emailContent, result);

      expect(Email).toHaveBeenCalledTimes(1); // Vérifie qu'un Email a été instancié
      expect(Email).toHaveBeenCalledWith({ content: emailContent, result }); // Vérifie les données passées au constructeur
      expect(mockSave).toHaveBeenCalledTimes(1); // Vérifie que save() a été appelé
    });

    it('devrait loguer une erreur si l\'enregistrement échoue', async () => {
      const emailContent = 'Ceci est un email';
      const result = 'spam';

      // Simule une erreur lors de l'appel à `save`
      const mockError = new Error('Erreur d\'enregistrement');
      mockSave.mockRejectedValueOnce(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock de console.error

      await saveEmail(emailContent, result);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erreur lors de l\'enregistrement de l\'email:',
        mockError
      );

      consoleErrorSpy.mockRestore(); // Restaure console.error
    });
  });

  describe('getEmails', () => {
    it('devrait retourner une liste d\'emails depuis la base de données', async () => {
      const mockEmails = [
        { object: 'Test 1', body: 'Corps 1', result: 'spam' },
        { object: 'Test 2', body: 'Corps 2', result: 'non-spam' },
      ];

      // Mock de `find`
      mockFind.mockResolvedValueOnce(mockEmails);

      const emails = await getEmails();

      expect(mockFind).toHaveBeenCalledTimes(1); // Vérifie que find() a été appelé
      expect(emails).toEqual(mockEmails); // Vérifie que les emails retournés sont corrects
    });

    it('devrait loguer une erreur si la récupération échoue', async () => {
      // Simule une erreur lors de l'appel à `find`
      const mockError = new Error('Erreur de récupération');
      mockFind.mockRejectedValueOnce(mockError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock de console.error

      const emails = await getEmails();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Erreur lors de la récupération des emails:',
        mockError
      );
      expect(emails).toBeUndefined(); // Vérifie qu'aucune donnée n'est retournée en cas d'erreur

      consoleErrorSpy.mockRestore(); // Restaure console.error
    });
  });
});
