FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de package et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers et construire l'application Next.js
COPY . .
RUN npm run build

# Exposer le port par défaut de Next.js (3000)
EXPOSE 3000

# Lancer l'application Next.js
CMD ["npm", "start"]
