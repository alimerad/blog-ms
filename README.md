# Blog Microservices Platform

## 📄 Objectif du projet

Ce projet a pour objectif de mettre en place une plateforme de blog découpée en microservices. Elle permet aux utilisateurs de :

- Créer un compte et s’authentifier via JWT
- Créer, consulter, modifier et supprimer des articles de blog
- Ajouter et consulter des commentaires sur les articles

Cette application est un cas d’étude d’architecture microservices moderne et scalable.

## 📊 Fonctionnement général

L’application est composée de plusieurs services indépendants qui communiquent entre eux via une API Gateway. Tous les services partagent une base de données PostgreSQL centralisée.

### 👤 Users Service

- Gère l’authentification (inscription, connexion)
- Gère les droits utilisateur (user, admin, author)
- Gère la session JWT et l’accès aux routes privées

### 📑 Posts Service

- Permet aux auteurs de créer, modifier et supprimer leurs articles
- Permet aux utilisateurs de consulter tous les articles publiés

### 💬 Comments Service

- Permet d’ajouter des commentaires sur un article
- Permet de consulter les commentaires liés à un article

### 🚪 API Gateway

- Sert de point d’entrée unique pour toutes les requêtes client
- Redirige les appels vers le bon microservice en fonction du chemin URL
- Ne gère pas l’authentification mais vérifie les JWT présents dans les headers

### 🖥️ Front-end

- Application Next.js responsive
- Interface utilisateur permettant la navigation, l’authentification, la création d’articles et l’ajout de commentaires
- Appelle l’API Gateway pour toutes les opérations

### 📃 Base de données

- Une instance PostgreSQL partagée entre les services
- Chaque service possède ses propres fichiers de migration Knex

## 💡 Déploiement

Le projet est compatible avec deux modes de déploiement :

### 🚀 Docker Compose

- Tous les services sont conteneurisés
- Le démarrage est centralisé via un `docker-compose.yml`
- Migrations Knex exécutées à l’initialisation

### ⚖️ Kubernetes (Minikube)

- Chaque service possède son manifeste de déploiement
- Utilisation de `kubectl apply -f k8s/` pour le déploiement
- Exposition des services via `minikube service`

## 📅 Plan technique

- Node.js + Express pour les services
- Next.js pour le front
- PostgreSQL + Knex.js pour la base de données
- Authentification via JWT
- Reverse proxy via API Gateway

## ✅ Conclusion

Cette architecture permet de séparer les responsabilités et de faciliter le déploiement et la maintenance. Le projet est conçu pour être évolutif et intégrable dans un environnement cloud ou CI/CD.

---

> © Projet réalisé dans le cadre d'un devoir sur les architectures microservices. 


