# Test API Compétences - Postman

## 📋 Endpoints Compétences

### 1. GET /competences - Récupérer toutes les compétences

**Requête :**
```http
GET {{BASE_URL}}/competences
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des compétences récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "JavaScript",
      "description": "Langage de programmation web"
    }
  ]
}
```

### 2. GET /competences/:id - Récupérer une compétence par ID

**Requête :**
```http
GET {{BASE_URL}}/competences/1
```

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Compétence récupérée avec succès",
  "data": {
    "id": 1,
    "nom": "JavaScript",
    "description": "Langage de programmation web"
  }
}
```

### 3. POST /competences - Créer une nouvelle compétence

**Requête :**
```http
POST {{BASE_URL}}/competences
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "React",
  "description": "Bibliothèque JavaScript pour interfaces utilisateur"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Compétence créée avec succès",
  "data": {
    "id": 2,
    "nom": "React",
    "description": "Bibliothèque JavaScript pour interfaces utilisateur"
  }
}
```

### 4. PUT /competences/:id - Modifier une compétence

**Requête :**
```http
PUT {{BASE_URL}}/competences/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de la compétence

**Corps de la requête :**
```json
{
  "nom": "JavaScript Avancé",
  "description": "Concepts avancés de JavaScript"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Compétence mise à jour avec succès",
  "data": {
    "id": 1,
    "nom": "JavaScript Avancé",
    "description": "Concepts avancés de JavaScript"
  }
}
```

### 5. DELETE /competences/:id - Supprimer une compétence

**Requête :**
```http
DELETE {{BASE_URL}}/competences/1
```

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Compétence supprimée avec succès",
  "data": null
}
```

## 🔗 Endpoints Relations Compétence-Niveau

### 6. GET /competences/:id/niveaux - Récupérer les niveaux d'une compétence

**Requête :**
```http
GET {{BASE_URL}}/competences/1/niveaux
```

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveaux de la compétence récupérés avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "JavaScript"
    },
    "niveaux": [
      {
        "id": 1,
        "nom": "Débutant",
        "competenceNiveauId": 1
      }
    ],
    "count": 1
  }
}
```

### 7. POST /competences/:id/niveaux - Ajouter un niveau à une compétence

**Requête :**
```http
POST {{BASE_URL}}/competences/1/niveaux
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de la compétence

**Corps de la requête :**
```json
{
  "niveauId": 2
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveau ajouté à la compétence avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "JavaScript"
    },
    "niveau": {
      "id": 2,
      "nom": "Intermédiaire"
    },
    "competenceNiveauId": 1
  }
}
```

### 8. PUT /competences/:competenceId/niveaux/:niveauId - Modifier la relation compétence-niveau

**Requête :**
```http
PUT {{BASE_URL}}/competences/1/niveaux/1
Content-Type: application/json
```

**Paramètres :**
- `competenceId` (number) : ID de la compétence
- `niveauId` (number) : ID du niveau actuel

**Corps de la requête :**
```json
{
  "niveauId": 3
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Relation compétence-niveau mise à jour avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "JavaScript"
    },
    "niveau": {
      "id": 3,
      "nom": "Avancé"
    },
    "competenceNiveauId": 1
  }
}
```

### 9. DELETE /competences/:competenceId/niveaux/:niveauId - Supprimer un niveau d'une compétence

**Requête :**
```http
DELETE {{BASE_URL}}/competences/1/niveaux/2
```

**Paramètres :**
- `competenceId` (number) : ID de la compétence
- `niveauId` (number) : ID du niveau à supprimer

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveau supprimé de la compétence avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "JavaScript"
    },
    "niveau": {
      "id": 2,
      "nom": "Intermédiaire"
    },
    "competenceNiveauId": 1
  }
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Nom vide :**
   ```json
   {
     "nom": "",
     "description": "Test"
   }
   ```
   **Réponse attendue :** Erreur 400

2. **Nom dupliqué :**
   ```json
   {
     "nom": "JavaScript",
     "description": "Dupliqué"
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Compétence inexistante :**
   ```http
   GET {{BASE_URL}}/competences/999
   ```
   **Réponse attendue :** Erreur 404

2. **Relation compétence-niveau inexistante :**
   ```http
   DELETE {{BASE_URL}}/competences/1/niveaux/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Le champ `description` est optionnel
- Une compétence peut être associée à plusieurs niveaux
- Un niveau peut être associé à plusieurs compétences

## Exemples d'utilisation

### Créer une compétence
```bash
curl -X POST http://localhost:3000/api/competences \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Intelligence Artificielle",
    "description": "Compétences en IA et machine learning"{
    "nom": "Intelligence Artificielle",
    "description": "Compétences en IA et machine learning"
  }
  }{
    "nom": "Intelligence Artific{
    "nom": "Intelligence Artificielle",
    "description": "Compétences en IA et machine learning"
  }ielle",
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

## APIs séparées

🔗 **[API Compétences de Base](README_COMPETENCES_BASE.md)** - Gestion CRUD des compétences
🔗 **[API Relations Compétence-Niveau](README_COMPETENCES_NIVEAUX.md)** - Gestion des relations compétence-niveau

## Support

Pour toute question ou problème, consultez :
- La documentation complète dans `COMPETENCES_API.md`
- Les exemples de code dans les tests Postman
- Les commentaires dans le code source

---

*API développée pour le système ECSA - École Supérieure Africaine de Codage*
