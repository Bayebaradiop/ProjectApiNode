# API Niveaux - README

## Vue d'ensemble

L'API des niveaux fournit une interface REST complète pour gérer les niveaux de compétence dans le système ECSA (École Supérieure Africaine de Codage). Les niveaux représentent les différents degrés de maîtrise d'une compétence (Débutant, Intermédiaire, Expert, etc.).

## Fonctionnalités principales

- ✅ **CRUD complet** des niveaux
- ✅ **Gestion des relations** avec les compétences
- ✅ **Validation stricte** des données
- ✅ **Messages d'erreur** en français
- ✅ **Documentation complète** avec exemples

## Endpoints disponibles

### Gestion des niveaux
- `GET /api/niveaux` - Liste de tous les niveaux
- `GET /api/niveaux/:id` - Détails d'un niveau
- `POST /api/niveaux` - Créer un niveau
- `PUT /api/niveaux/:id` - Modifier un niveau
- `DELETE /api/niveaux/:id` - Supprimer un niveau

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

### Créer un niveau
```bash
curl -X POST http://localhost:3000/api/niveaux \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Expert Confirmé"
  }'
```

### Récupérer tous les niveaux
```bash
curl -X GET http://localhost:3000/api/niveaux
```

### Récupérer un niveau spécifique
```bash
curl -X GET http://localhost:3000/api/niveaux/1
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
- **IDs** : Entiers positifs uniquement
- **Unicité** : Les noms de niveaux doivent être uniques

## Gestion d'erreurs

- `400` : Données invalides ou ID incorrect
- `404` : Niveau non trouvé
- `409` : Conflit (nom déjà existant)
- `500` : Erreur serveur

## Relations avec les compétences

Les niveaux sont liés aux compétences via une relation **many-to-many** :

- **Un niveau** peut être associé à **plusieurs compétences**
- **Une compétence** peut avoir **plusieurs niveaux**

Cette relation permet de définir différents niveaux de maîtrise pour chaque compétence.

## Architecture

```
src/
├── controllers/
│   └── niveau.controller.ts          # Logique métier niveaux
├── routes/
│   └── niveau.routes.ts              # Routes niveaux
├── validators/
│   └── niveau.validator.ts           # Validation Zod
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
- `postman_competence_niveau_tests.json` - Tests des relations compétence-niveau

## Données de test

Le seed crée automatiquement 3 niveaux :

1. **Niveau 1 - Débutant**
2. **Niveau 2 - Intermédiaire**
3. **Niveau 3 - Avancé**

## Documentation complète

📖 **[Documentation détaillée](NIVEAUX_API.md)** - Spécifications complètes des endpoints

## Schéma de base de données

### Table Niveau
- `id` : Identifiant unique (auto-incrémenté)
- `nom` : Nom du niveau (unique, index)

### Table CompetenceNiveau (relation many-to-many)
- `competenceId` : Référence vers Competence
- `niveauId` : Référence vers Niveau
- Clé primaire composite : (competenceId, niveauId)

## Support

Pour toute question ou problème, consultez :
- La documentation complète dans `NIVEAUX_API.md`
- Les exemples de code dans les tests Postman
- Les commentaires dans le code source

## Notes importantes

1. **Unicité des noms** : Chaque niveau doit avoir un nom unique
2. **Relations bidirectionnelles** : Les modifications affectent les compétences associées
3. **Cascade** : La suppression d'un niveau peut impacter les relations existantes
4. **Performance** : Les requêtes incluent automatiquement les compétences associées

---

*API développée pour le système ECSA - École Supérieure Africaine de Codage*
