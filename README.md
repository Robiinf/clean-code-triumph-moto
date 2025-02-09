# 🚀 Projet Clean Code / Clean Archi - GROUPE 3 - 5IW3

Ce guide vous expliquera comment configurer et lancer l'application en local.

## 📌 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) (version 16+ recommandée)
- [npm](https://www.npmjs.com/) (fourni avec Node.js)

## 📂 Installation et démarrage

### 1️⃣ Lancer le backend avec Docker
Dans le dossier **backend**, exécutez :
```sh
cd backend
docker compose up -d
```
Cela démarrera tous les services nécessaires (base de données, API, etc.).

### 2️⃣ Installer et démarrer l'application React
Dans le dossier **frontend/react-app**, exécutez :
```sh
cd frontend/react-app
npm install
npm run dev
```
L'application principale React sera accessible sur le port défini dans le projet.

### 3️⃣ Installer et démarrer l'application Vue
Dans le dossier **frontend/vue-app**, exécutez :
```sh
cd frontend/vue-app
npm install
npm run dev
```

## 🧪 Lancer les tests d'intégration
Pour exécuter les tests d'intégration, utilisez la commande suivante :
```sh
docker compose exec dev npm test chemin/vers/le/test
```
Remplacez `chemin/vers/le/test` par le chemin du fichier de test à exécuter.

## 🛠 Problèmes et Dépannage
Si vous rencontrez des problèmes :
- Vérifiez que Docker tourne correctement.
- Assurez-vous que tous les conteneurs sont bien démarrés avec `docker ps`.
- Regardez les logs avec `docker compose logs -f`.


