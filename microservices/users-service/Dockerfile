# Dockerfile pour un microservice (ex: users-service)
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package.json et package-lock.json, puis installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du code source dans le conteneur
COPY . .

# Exposer le port sur lequel l'application écoute (à adapter si nécessaire)
EXPOSE 3000

# Démarrer l'application
CMD ["node", "src/server.js"]
