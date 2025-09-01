# Test API Niveaux - Postman

## 📋 Endpoints Niveaux

### 1. GET /niveaux - Récupérer tous les niveaux

**Requête :**
```http
GET {{BASE_URL}}/niveaux
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des niveaux récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Débutant"
    },
    {
      "id": 2,
      "nom": "Intermédiaire"
    },
    {
      "id": 3,
      "nom": "Avancé"
    }
  ]
}
```

### 2. GET /niveaux/:id - Récupérer un niveau par ID

**Requête :**
```http
GET {{BASE_URL}}/niveaux/1
```

**Paramètres :**
- `id` (number) : ID du niveau

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveau récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "Débutant"
  }
}
```

### 3. POST /niveaux - Créer un nouveau niveau

**Requête :**
```http
POST {{BASE_URL}}/niveaux
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "Expert"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveau créé avec succès",
  "data": {
    "id": 4,
    "nom": "Expert"
  }
}
```

### 4. PUT /niveaux/:id - Modifier un niveau

**Requête :**
```http
PUT {{BASE_URL}}/niveaux/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID du niveau

**Corps de la requête :**
```json
{
  "nom": "Novice"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveau mis à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Novice"
  }
}
```

### 5. DELETE /niveaux/:id - Supprimer un niveau

**Requête :**
```http
DELETE {{BASE_URL}}/niveaux/4
```

**Paramètres :**
- `id` (number) : ID du niveau

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Niveau supprimé avec succès",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Nom vide :**
   ```json
   {
     "nom": ""
   }
   ```
   **Réponse attendue :** Erreur 400

2. **Nom dupliqué :**
   ```json
   {
     "nom": "Débutant"
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Niveau inexistant :**
   ```http
   GET {{BASE_URL}}/niveaux/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Les niveaux sont utilisés dans les relations compétence-niveau
- Un niveau peut être associé à plusieurs compétences
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
