# Utiliser une image Node.js officielle
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du code
COPY . .

# Exposer le port sur lequel le service écoute
EXPOSE 5001

# Commande pour lancer l’application
CMD ["sh", "-c", "node src/fileAnalyzer.js & node src/app.js"]
