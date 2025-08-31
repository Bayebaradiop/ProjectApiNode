# API Documentation - ECSA System

## Vue d'ensemble

Bienvenue dans la documentation de l'API du système ECSA (Electronic Competency and Skills Assessment). Cette API permet de gérer l'ensemble des entités du système de gestion des compétences.

## APIs Disponibles

### 🔗 APIs Documentées

1. **[Compétences & Niveaux](./COMPETENCES_API.md)**
   - Gestion complète des compétences
   - Gestion des niveaux
   - Relations compétence-niveau
   - Routes : `/api/competences`, `/api/niveaux`

2. **[Utilisateurs](./USERS_API.md)**
   - Gestion des utilisateurs
   - Routes : `/api/users`

3. **[Profils](./PROFILES_API.md)**
   - Gestion des profils utilisateur
   - Routes : `/api/profiles`

4. **[Profils de Sortie](./PROFILSORTIE_API.md)**
   - Gestion des profils de sortie
   - Routes : `/api/profilSortie`

5. **[Promotions](./PROMOS_API.md)**
   - Gestion des promotions
   - Routes : `/api/promos`

6. **[Référentiels](./REFERENTIELS_API.md)**
   - Gestion des référentiels
   - Routes : `/api/referentiels`

7. **[Tags](./TAGS_API.md)**
   - Gestion des tags
   - Routes : `/api/tags`

## Architecture Générale

### Structure des Réponses

Toutes les APIs suivent la même structure de réponse :

#### Réponse de succès
```json
{
  "statut": "success",
  "message": "Opération réussie",
  "data": { ... } | [ ... ] | null
}
```

#### Réponse d'erreur
```json
{
  "statut": "error",
  "message": "Description de l'erreur",
  "data": null,
  "errors": [
    {
      "field": "nom_du_champ",
      "message": "Message d'erreur"
    }
  ]
}
```

### Codes HTTP

- **200** : Succès (GET, PUT)
- **201** : Création réussie (POST)
- **400** : Données invalides
- **404** : Ressource non trouvée
- **409** : Conflit (ressource existante)
- **500** : Erreur serveur

### Validation

Toutes les APIs utilisent **Zod** pour la validation des données :
- Validation stricte des types
- Messages d'erreur personnalisés en français
- Sanitisation automatique des entrées

## Technologies Utilisées

- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **TypeScript** : Typage statique
- **Prisma** : ORM pour la base de données
- **MySQL** : Base de données
- **Zod** : Validation des données
- **CORS** : Gestion des requêtes cross-origin
- **Helmet** : Sécurité des headers HTTP

## Démarrage Rapide

### Prérequis
```bash
Node.js >= 18.0.0
MySQL >= 8.0
npm ou yarn
```

### Installation
```bash
# Cloner le repository
git clone <repository-url>
cd ecs-api

# Installer les dépendances
npm install

# Configuration de la base de données
cp .env.example .env
# Éditer .env avec vos paramètres MySQL

# Initialiser la base de données
npx prisma generate
npx prisma db push

# Démarrer le serveur
npm run dev
```

### Test de l'API
```bash
# Vérifier que l'API fonctionne
curl http://localhost:3000/api/health

# Réponse attendue
{
  "statut": "success",
  "message": "API is running",
  "timestamp": "2025-08-31T..."
}
```

## Structure du Projet

```
src/
├── controllers/     # Logique métier
├── routes/         # Définition des routes
├── validators/     # Validation avec Zod
├── utils/          # Utilitaires
└── app.ts          # Configuration Express

prisma/
├── schema.prisma   # Schéma de base de données
└── seed.ts         # Données de test
```

## Sécurité

- **Helmet** : Protection des headers HTTP
- **CORS** : Contrôle des origines autorisées
- **Validation stricte** : Prévention des injections
- **Sanitisation** : Nettoyage automatique des entrées

## Gestion d'Erreurs

Le système gère automatiquement :
- Erreurs de validation Zod
- Erreurs de base de données Prisma
- Erreurs de serveur Express
- Erreurs de contraintes d'intégrité

## Support et Maintenance

Pour toute question ou problème :
1. Consulter la documentation spécifique de chaque API
2. Vérifier les logs du serveur
3. Tester avec les exemples fournis
4. Ouvrir une issue sur le repository

---

## 📚 Documentation Détaillée

Chaque API dispose de sa propre documentation complète avec :
- Description détaillée de chaque endpoint
- Exemples de requêtes et réponses
- Codes d'erreur spécifiques
- Exemples d'utilisation avec cURL

Consultez les fichiers de documentation individuels pour plus de détails.
