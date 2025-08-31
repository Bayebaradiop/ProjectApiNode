# API Compétences - Endpoints de Base

## Vue d'ensemble

Cette API fournit les endpoints de base pour la gestion CRUD des compétences dans le système ECSA. Elle permet de créer, lire, modifier et supprimer des compétences sans gérer les relations avec les niveaux.

## Endpoints disponibles

### Gestion des compétences de base
- `GET /api/competences` - Liste de toutes les compétences
- `GET /api/competences/:id` - Détails d'une compétence
- `POST /api/competences` - Créer une compétence
- `PUT /api/competences/:id` - Modifier une compétence
- `DELETE /api/competences/:id` - Supprimer une compétence

## Installation et configuration

### Prérequis
- Node.js 16+
- MySQL 8.0+
- Prisma ORM

### Installation
```bash
npm install
npx prisma generate
npx prisma db push
npm run seed
```

### Démarrage
```bash
npm run dev
```

L'API sera disponible sur `http://localhost:3000`

## Exemples d'utilisation

### Créer une compétence
```bash
curl -X POST http://localhost:3000/api/competences \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Intelligence Artificielle",
    "description": "Compétences en IA et machine learning"
  }'
```

### Récupérer toutes les compétences
```bash
curl -X GET http://localhost:3000/api/competences
```

### Récupérer une compétence spécifique
```bash
curl -X GET http://localhost:3000/api/competences/1
```

### Modifier une compétence
```bash
curl -X PUT http://localhost:3000/api/competences/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "IA Avancée",
    "description": "Compétences avancées en intelligence artificielle"
  }'
```

### Supprimer une compétence
```bash
curl -X DELETE http://localhost:3000/api/competences/1
```

## Structure des réponses

Toutes les réponses suivent le même format :

### Succès
```json
{
  "statut": "success",
  "message": "Opération réussie",
  "data": { ... }
}
```

### Erreur
```json
{
  "statut": "error",
  "message": "Description de l'erreur",
  "data": null
}
```

## Validation des données

- **Nom** : 1-100 caractères, lettres, espaces, tirets uniquement
- **Description** : Optionnelle, max 500 caractères
- **IDs** : Entiers positifs uniquement

## Gestion d'erreurs

- `400` : Données invalides ou ID incorrect
- `404` : Compétence non trouvée
- `409` : Conflit (nom déjà existant)
- `500` : Erreur serveur

## Architecture

```
src/
├── controllers/
│   └── competence.controller.ts      # Logique métier compétences
├── routes/
│   └── competence.routes.ts          # Routes compétences de base
├── validators/
│   └── competence.validator.ts       # Validation Zod
└── app.ts                            # Configuration Express
```

## Technologies utilisées

- **Runtime** : Node.js
- **Framework** : Express.js
- **ORM** : Prisma
- **Validation** : Zod
- **Base de données** : MySQL
- **Langage** : TypeScript

## Scripts disponibles

```bash
npm run dev      # Démarrage en développement
npm run build    # Compilation TypeScript
npm run start    # Démarrage en production
npm run seed     # Peuplement de la base de données
```

## Tests

Collection Postman disponible :
- `postman_competences_tests.json` - Tests complets des endpoints de base

## Données de test

Le seed crée automatiquement 5 compétences :

1. **Maîtriser HTML/CSS** - Créer des interfaces web responsives
2. **Développer avec JavaScript** - Interactions dynamiques
3. **Utiliser React** - Applications web avec React
4. **Développer avec Node.js** - APIs REST avec Node.js
5. **Maîtriser SQL** - Gestion des bases de données

## Schéma de base de données

### Table Competence
- `id` : Identifiant unique (auto-incrémenté)
- `nom` : Nom de la compétence (unique, index)
- `description` : Description optionnelle

## Notes importantes

1. **CRUD simple** : Ces endpoints ne gèrent que les compétences de base
2. **Pas de relations** : Les niveaux sont gérés séparément
3. **Validation stricte** : Unicité des noms obligatoire
4. **Messages en français** : Toutes les réponses en français

## Documentation complète

📖 **[Documentation détaillée](COMPETENCES_API.md)** - Spécifications complètes des endpoints

## API associée

🔗 **[API Relations Compétence-Niveau](README_COMPETENCES_NIVEAUX.md)** - Gestion des relations compétence-niveau

---

*API développée pour le système ECSA - École Supérieure Africaine de Codage*
