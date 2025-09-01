# API Tags - README

## Vue d'ensemble

L'API des tags fournit une interface REST complète pour gérer les tags (mots-clés) utilisés dans le système ECSA (École Supérieure Africaine de Codage).

## Fonctionnalités principales

- ✅ **CRUD complet** des tags
- ✅ **Validation stricte** des données
- ✅ **Messages d'erreur** en français
- ✅ **Documentation claire** avec exemples

## Endpoints disponibles

### Tags de base
- `GET /api/tags` - Liste de tous les tags
- `GET /api/tags/:id` - Détails d'un tag
- `POST /api/tags` - Créer un tag
- `PUT /api/tags/:id` - Modifier un tag
- `DELETE /api/tags/:id` - Supprimer un tag

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

### Créer un tag
```bash
curl -X POST http://localhost:3000/api/tags \
  -H "Content-Type: application/json" \
  -d '{ "nom": "Javascript" }'
```

### Lister tous les tags
```bash
curl http://localhost:3000/api/tags
```

### Modifier un tag
```bash
curl -X PUT http://localhost:3000/api/tags/1 \
  -H "Content-Type: application/json" \
  -d '{ "nom": "Typescript" }'
```

### Supprimer un tag
```bash
curl -X DELETE http://localhost:3000/api/tags/1
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

- **Nom** : 1-50 caractères, lettres, espaces, tirets uniquement
- **IDs** : Entiers positifs uniquement
- **Unicité** : Le nom du tag doit être unique

## Gestion d'erreurs

- `400` : Données invalides ou ID incorrect
- `404` : Ressource non trouvée
- `409` : Conflit (unicité violée)
- `500` : Erreur serveur

## Architecture

```
src/
├── controllers/
│   └── tag.controller.ts         # Logique métier tags
├── routes/
│   └── tag.routes.ts             # Routes tags
├── validators/
│   └── tag.validator.ts          # Validation Zod
└── app.ts                        # Configuration Express
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
- `postman_tags_tests.json` - Tests complets des tags

## Documentation complète

📖 **[Documentation détaillée](TAGS_API.md)** - Spécifications complètes des endpoints

## APIs séparées

🔗 **[API Tags de Base](README_TAGS_BASE.md)** - Gestion CRUD des tags

## Support

Pour toute question ou problème, consultez :
- La documentation complète dans `TAGS_API.md`
- Les exemples de code dans les tests Postman
- Les commentaires dans le code source

---

*API développée pour le système ECSA - École Supérieure Africaine de Codage*
