# API Compétences - README

## Vue d'ensemble

L'API des compétences fournit une interface REST complète pour gérer les compétences et leurs relations avec les niveaux dans le système ECSA (École Supérieure Africaine de Codage).

## Fonctionnalités principales

- ✅ **CRUD complet** des compétences
- ✅ **Gestion des relations** compétence-niveau
- ✅ **Validation stricte** des données
- ✅ **Messages d'erreur** en français
- ✅ **Documentation complète** avec exemples

## Endpoints disponibles

### Compétences de base
- `GET /api/competences` - Liste de toutes les compétences
- `GET /api/competences/:id` - Détails d'une compétence
- `POST /api/competences` - Créer une compétence
- `PUT /api/competences/:id` - Modifier une compétence
- `DELETE /api/competences/:id` - Supprimer une compétence

### Relations compétence-niveau
- `GET /api/competences/:id/niveaux` - Niveaux d'une compétence
- `POST /api/competences/:id/niveaux` - Ajouter un niveau
- `PUT /api/competences/:competenceId/niveaux/:niveauId` - Modifier la relation
- `DELETE /api/competences/:competenceId/niveaux/:niveauId` - Supprimer un niveau

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

### Ajouter un niveau à une compétence
```bash
curl -X POST http://localhost:3000/api/competences/1/niveaux \
  -H "Content-Type: application/json" \
  -d '{
    "niveauId": 2
  }'
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
- **Relations** : Vérification d'unicité automatique

## Gestion d'erreurs

- `400` : Données invalides ou ID incorrect
- `404` : Ressource non trouvée
- `409` : Conflit (unicité violée)
- `500` : Erreur serveur

## Architecture

```
src/
├── controllers/
│   ├── competence.controller.ts      # Logique métier compétences
│   └── competence-niveau.controller.ts # Logique relations
├── routes/
│   ├── competence.routes.ts          # Routes compétences
│   └── competence-niveau.routes.ts   # Routes relations
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

Des collections Postman sont disponibles :
- `postman_competences_tests.json` - Tests complets des compétences
- `postman_competence_niveau_tests.json` - Tests des relations

## Documentation complète

📖 **[Documentation détaillée](COMPETENCES_API.md)** - Spécifications complètes des endpoints

## Support

Pour toute question ou problème, consultez :
- La documentation complète dans `COMPETENCES_API.md`
- Les exemples de code dans les tests Postman
- Les commentaires dans le code source

---

*API développée pour le système ECSA - École Supérieure Africaine de Codage*
