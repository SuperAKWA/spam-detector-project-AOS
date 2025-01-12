# Spam Detector

## Description du projet

Spam Detector est une application web permettant d’analyser des emails pour détecter s’ils sont du **spam**, du **phishing** ou des **promotions**. L'application offre des fonctionnalités d’analyse via un formulaire ou par glisser-déposer de fichiers, et conserve un historique des analyses effectuées.

---

## Fonctionnalités

- **Analyse d'emails :**
  - Saisie manuelle (objet et contenu) via un formulaire.
  - Import de fichiers (.json, .txt, .eml, .docx) pour analyse.

- **Résultats détaillés :**
  - Probabilités pour chaque catégorie (spam, phishing, promotion).
  - Analyse des mots-clés et des liens détectés (avec identification des liens malveillants).

- **Historique :**
  - Consultation des analyses précédentes.

- **Authentification sécurisée :**
  - Inscription et connexion via des comptes utilisateurs.

- **Collaboration :**
  - Projet open-source, contributions ouvertes à tous. Voir [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Comment lancer le projet (de A à Z)

### 1. **Pré-requis**

- [Node.js](https://nodejs.org/) version 14 ou supérieure
- [Docker](https://www.docker.com/)
- Une instance MongoDB locale ou distante

---

### 2. **Cloner le projet**

Cloner le dépôt GitHub sur votre machine locale :

```
git clone <url-du-repository>
cd spam-detector-project-AOS
```

---

### 3. **Configurer les environnements**

Créez un fichier `.env` dans chaque dossier (`auth-services`, `spam-detector-backend`) et ajoutez-y les variables nécessaires.

**Exemple de fichier `.env` pour `auth-services` :**

```
MONGODB_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=clesecrete
```

**Exemple de fichier `.env` pour `spam-detector-backend` :**

```
MONGODB_URI=mongodb://localhost:27017/spam-detector
VIRUSTOTAL_API_KEY=c59ea4bc9b1db78f7492244ce9425458a287efdf9fe80d46097d0c11aaad2712
JWT_SECRET=clesecrete
FILE_ANALYZER_PORT=5002
PORT=5001
```

---

### 4. **Lancer le projet avec Docker**

**Construire les images :**

```
docker-compose build
```

**Lancer les services :**

```
docker-compose up
```

Les services seront disponibles sur :

- Frontend : http://localhost:5173
- Backend : http://localhost:5001
- Auth-service : http://localhost:4000

---

### 5. **Fonctionnalités de l'application**

#### Accès à l'application

- Rendez-vous sur http://localhost:5173.

#### Analyse d’un email

1. Connectez-vous ou créez un compte.
2. Saisissez un email dans le formulaire ou glissez-déposez un fichier dans la zone dédiée.
3. Consultez les résultats d’analyse.

#### Historique

- Accédez à la section **Historique** pour voir les analyses précédentes.

---

## Contribution

Nous accueillons les contributions ! Consultez [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
