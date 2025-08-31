# API Compétences - Relations Niveau

## Vue d'ensemble

Cette API fournit les endpoints pour gérer les relations entre compétences et niveaux dans le système ECSA. Elle permet d'associer, modifier et supprimer les niveaux d'une compétence spécifique.

## Endpoints disponibles

### Gestion des relations compétence-niveau
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

### Récupérer les niveaux d'une compétence
```bash
curl -X GET http://localhost:3000/api/competences/1/niveaux
```

### Ajouter un niveau à une compétence
```bash
curl -X POST http://localhost:3000/api/competences/1/niveaux \
  -H "Content-Type: application/json" \
  -d '{
    "niveauId": 3
  }'
```

### Modifier la relation compétence-niveau
```bash
curl -X PUT http://localhost:3000/api/competences/1/niveaux/2 \
  -H "Content-Type: application/json" \
  -d '{
    "niveauId": 3
  }'
```

### Supprimer un niveau d'une compétence
```bash
curl -X DELETE http://localhost:3000/api/competences/1/niveaux/3
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

- **competenceId** : ID de la compétence (entier positif)
- **niveauId** : ID du niveau (entier positif)
- **Unicité** : Une compétence ne peut pas avoir le même niveau deux fois

## Gestion d'erreurs

- `400` : IDs invalides ou données incorrectes
- `404` : Compétence, niveau ou relation non trouvée
- `409` : Conflit (relation déjà existante)
- `500` : Erreur serveur

## Architecture

```
src/
├── controllers/
│   └── competence-niveau.controller.ts # Logique relations
├── routes/
│   └── competence-niveau.routes.ts     # Routes relations
├── validators/
│   └── competence.validator.ts         # Validation relations
└── app.ts                              # Configuration Express
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
- `postman_competence_niveau_tests.json` - Tests complets des relations

## Données de test

Le seed crée automatiquement ces relations :

### Compétence 1 (HTML/CSS) :
- Niveau 1 (Débutant)
- Niveau 2 (Intermédiaire)

### Compétence 2 (JavaScript) :
- Niveau 1 (Débutant)
- Niveau 2 (Intermédiaire)

### Compétence 3 (React) :
- Niveau 2 (Intermédiaire)

### Compétence 4 (Node.js) :
- Niveau 2 (Intermédiaire)

### Compétence 5 (SQL) :
- Niveau 1 (Débutant)

## Schéma de base de données

### Table CompetenceNiveau (relation many-to-many)
- `competenceId` : Référence vers Competence
- `niveauId` : Référence vers Niveau
- Clé primaire composite : (competenceId, niveauId)

## Notes importantes

1. **Relations bidirectionnelles** : Modifications affectent les deux entités
2. **Unicité stricte** : Une compétence ne peut pas avoir le même niveau deux fois
3. **Validation croisée** : Vérification de l'existence des deux entités
4. **Messages en français** : Toutes les réponses en français

## Cas d'usage courants

### Associer plusieurs niveaux à une compétence
```bash
# Ajouter niveau débutant
curl -X POST http://localhost:3000/api/competences/1/niveaux \
  -H "Content-Type: application/json" \
  -d '{"niveauId": 1}'

# Ajouter niveau intermédiaire
curl -X POST http://localhost:3000/api/competences/1/niveaux \
  -H "Content-Type: application/json" \
  -d '{"niveauId": 2}'

# Ajouter niveau expert
curl -X POST http://localhost:3000/api/competences/1/niveaux \
  -H "Content-Type: application/json" \
  -d '{"niveauId": 3}'
```

### Remplacer un niveau par un autre
```bash
# Remplacer niveau 2 par niveau 3
curl -X PUT http://localhost:3000/api/competences/1/niveaux/2 \
  -H "Content-Type: application/json" \
  -d '{"niveauId": 3}'
```

## Documentation complète

📖 **[Documentation détaillée](COMPETENCES_API.md)** - Spécifications complètes des endpoints

## API associée

🔗 **[API Compétences de Base](README_COMPETENCES_BASE.md)** - Gestion CRUD des compétences

---

*API développée pour le système ECSA - École Supérieure Africaine de Codage*
