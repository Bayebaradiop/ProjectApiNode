# API Documentation - Test avec Postman

Cette documentation fournit des exemples de requêtes Postman pour tester tous les endpoints de l'API.

## 📋 Table des matières

- [Configuration Postman](#configuration-postman)
- [Endpoints disponibles](#endpoints-disponibles)
- [Fichiers de test détaillés](#fichiers-de-test-détaillés)

## 🔧 Configuration Postman

### Variables d'environnement
Créez une nouvelle collection dans Postman et définissez ces variables :

```
BASE_URL = http://localhost:3000/api
CONTENT_TYPE = application/json
```

### Headers par défaut
Pour toutes les requêtes :
```
Content-Type: application/json
```

## 📚 Endpoints disponibles

### 🏥 Santé de l'API
- **GET** `/health` - Vérifier que l'API fonctionne

### 👥 Utilisateurs
- **GET** `/users` - Liste des utilisateurs
- **GET** `/users/:id` - Détails d'un utilisateur
- **POST** `/users` - Créer un utilisateur
- **PUT** `/users/:id` - Modifier un utilisateur
- **DELETE** `/users/:id` - Supprimer un utilisateur

### 📚 Compétences
- **GET** `/competences` - Liste des compétences
- **GET** `/competences/:id` - Détails d'une compétence
- **POST** `/competences` - Créer une compétence
- **PUT** `/competences/:id` - Modifier une compétence
- **DELETE** `/competences/:id` - Supprimer une compétence
- **GET** `/competences/:id/niveaux` - Niveaux d'une compétence
- **POST** `/competences/:id/niveaux` - Ajouter un niveau à une compétence
- **PUT** `/competences/:competenceId/niveaux/:niveauId` - Modifier relation compétence-niveau
- **DELETE** `/competences/:competenceId/niveaux/:niveauId` - Supprimer un niveau d'une compétence

### 📊 Niveaux
- **GET** `/niveaux` - Liste des niveaux
- **GET** `/niveaux/:id` - Détails d'un niveau
- **POST** `/niveaux` - Créer un niveau
- **PUT** `/niveaux/:id` - Modifier un niveau
- **DELETE** `/niveaux/:id` - Supprimer un niveau

### 🎯 Profils de sortie
- **GET** `/profils-sortie` - Liste des profils de sortie
- **GET** `/profils-sortie/:id` - Détails d'un profil de sortie
- **POST** `/profils-sortie` - Créer un profil de sortie
- **PUT** `/profils-sortie/:id` - Modifier un profil de sortie
- **DELETE** `/profils-sortie/:id` - Supprimer un profil de sortie

### 📅 Promotions
- **GET** `/promos` - Liste des promotions
- **GET** `/promos/:id` - Détails d'une promotion
- **POST** `/promos` - Créer une promotion
- **PUT** `/promos/:id` - Modifier une promotion
- **DELETE** `/promos/:id` - Supprimer une promotion
- **GET** `/promos/:id/formateurs` - Formateurs d'une promotion
- **POST** `/promos/:id/formateurs` - Ajouter un formateur à une promotion
- **DELETE** `/promos/:id/formateurs/:userId` - Supprimer un formateur d'une promotion

### 📖 Référentiels
- **GET** `/referentiels` - Liste des référentiels
- **GET** `/referentiels/:id` - Détails d'un référentiel
- **POST** `/referentiels` - Créer un référentiel
- **PUT** `/referentiels/:id` - Modifier un référentiel
- **DELETE** `/referentiels/:id` - Supprimer un référentiel
- **POST** `/referentiels/:id/competences` - Ajouter une compétence à un référentiel

### 🏷️ Tags
- **GET** `/tags` - Liste des tags
- **GET** `/tags/:id` - Détails d'un tag
- **POST** `/tags` - Créer un tag
- **PUT** `/tags/:id` - Modifier un tag
- **DELETE** `/tags/:id` - Supprimer un tag

### 👤 Profils
- **GET** `/profiles` - Liste des profils
- **GET** `/profiles/:id` - Détails d'un profil
- **POST** `/profiles` - Créer un profil
- **PUT** `/profiles/:id` - Modifier un profil
- **DELETE** `/profiles/:id` - Supprimer un profil

## 📁 Fichiers de test détaillés

Consultez les fichiers README spécifiques pour chaque groupe d'endpoints :

- [Test des Utilisateurs](./README_USERS_API.md)
- [Test des Compétences](./README_COMPETENCES_API.md)
- [Test des Niveaux](./README_NIVEAUX_API.md)
- [Test des Profils de Sortie](./README_PROFILS_SORTIE_API.md)
- [Test des Promotions](./README_PROMOS_API.md)
- [Test des Référentiels](./README_REFERENTIELS_API.md)
- [Test des Tags](./README_TAGS_API.md)
- [Test des Profils](./README_PROFILES_API.md)

## 🚀 Démarrage rapide

1. **Démarrer le serveur :**
   ```bash
   npm run dev
   ```

2. **Importer la collection Postman :**
   - Utilisez les exemples fournis dans chaque fichier README
   - Remplacez `{{BASE_URL}}` par `http://localhost:3000/api`

3. **Tester la santé de l'API :**
   ```bash
   GET http://localhost:3000/health
   ```

## 📝 Notes importantes

- Tous les IDs sont des nombres entiers
- Les dates doivent être au format ISO 8601
- Les noms sont uniques pour éviter les conflits
- Les relations many-to-many sont gérées via des endpoints spécifiques
- Les erreurs de validation retournent un objet détaillé avec les champs problématiques
