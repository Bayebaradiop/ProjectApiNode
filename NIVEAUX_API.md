# API Documentation - Niveaux

## Vue d'ensemble

L'API des niveaux permet de gérer les niveaux de compétences dans le système ECSA. Les niveaux représentent les différents degrés de maîtrise d'une compétence (Débutant, Intermédiaire, Expert, etc.).

## Endpoints Disponibles

### 1. Gestion des Niveaux

#### GET /api/niveaux
Récupère la liste de tous les niveaux.

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Liste des niveaux récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Débutant",
      "competences": [
        {
          "competenceId": 1,
          "niveauId": 1,
          "competence": {
            "id": 1,
            "nom": "Développement Web"
          }
        }
      ]
    }
  ]
}
```

#### GET /api/niveaux/:id
Récupère un niveau spécifique par son ID.

**Paramètres :**
- `id` (number) : ID du niveau

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Niveau récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "Débutant",
    "competences": [
      {
        "competenceId": 1,
        "niveauId": 1,
        "competence": {
          "id": 1,
          "nom": "Développement Web"
        }
      }
    ]
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide
- `404` : Niveau non trouvé

#### POST /api/niveaux
Crée un nouveau niveau.

**Corps de la requête :**
```json
{
  "nom": "Expert"
}
```

**Validations :**
- `nom` : requis, 1-100 caractères, lettres, espaces et tirets uniquement

**Réponse de succès (201) :**
```json
{
  "statut": "success",
  "message": "Niveau créé avec succès",
  "data": {
    "id": 3,
    "nom": "Expert",
    "competences": []
  }
}
```

**Erreurs possibles :**
- `400` : Données de validation invalides
- `409` : Un niveau avec ce nom existe déjà

#### PUT /api/niveaux/:id
Met à jour un niveau existant.

**Paramètres :**
- `id` (number) : ID du niveau

**Corps de la requête :**
```json
{
  "nom": "Expert Confirmé"
}
```

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Niveau mis à jour avec succès",
  "data": {
    "id": 3,
    "nom": "Expert Confirmé",
    "competences": []
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide ou données invalides
- `404` : Niveau non trouvé
- `409` : Un niveau avec ce nom existe déjà

#### DELETE /api/niveaux/:id
Supprime un niveau.

**Paramètres :**
- `id` (number) : ID du niveau

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Niveau supprimé avec succès",
  "data": null
}
```

**Erreurs possibles :**
- `400` : ID invalide
- `404` : Niveau non trouvé

## Codes d'erreur

### Erreurs de validation (400)
```json
{
  "statut": "error",
  "message": "Données de validation invalides",
  "data": null,
  "errors": [
    {
      "field": "nom",
      "message": "Le nom est requis"
    }
  ]
}
```

### Erreurs de ressource non trouvée (404)
```json
{
  "statut": "error",
  "message": "Niveau non trouvé",
  "data": null
}
```

### Erreurs de conflit (409)
```json
{
  "statut": "error",
  "message": "Un niveau avec ce nom existe déjà",
  "data": null
}
```

### Erreurs serveur (500)
```json
{
  "statut": "error",
  "message": "Erreur lors de la récupération des niveaux",
  "data": null
}
```

## Exemples d'utilisation

### Créer un niveau
```bash
curl -X POST http://localhost:3000/api/niveaux \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Intermédiaire"
  }'
```

### Récupérer tous les niveaux
```bash
curl -X GET http://localhost:3000/api/niveaux
```

### Mettre à jour un niveau
```bash
curl -X PUT http://localhost:3000/api/niveaux/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Débutant+"
  }'
```

### Supprimer un niveau
```bash
curl -X DELETE http://localhost:3000/api/niveaux/1
```

## Notes importantes

1. **Validation stricte** : Tous les champs sont validés selon les règles définies
2. **Relations automatiques** : Les relations avec les compétences sont incluses automatiquement
3. **Messages en français** : Toutes les réponses sont en français
4. **Structure cohérente** : Toutes les réponses suivent le même format
5. **Gestion d'erreurs complète** : Tous les cas d'erreur sont gérés avec des messages appropriés

## Schéma de base de données

### Table Niveau
- `id` : Identifiant unique (auto-incrémenté)
- `nom` : Nom du niveau (unique)

### Relations
- **Many-to-many avec Competence** : Via la table `CompetenceNiveau`
  - Un niveau peut être associé à plusieurs compétences
  - Une compétence peut avoir plusieurs niveaux
