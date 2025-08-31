# API Documentation - Compétences

## Vue d'ensemble

L'API des compétences permet de gérer les compétences, leurs niveaux associés et les relations entre compétences et niveaux dans le système ECSA.

## Endpoints Disponibles

### 1. Gestion des Compétences

#### GET /api/competences
Récupère la liste de toutes les compétences.

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Liste des compétences récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Développement Web",
      "description": "Compétences en développement web",
      "niveaux": [
        {
          "id": 1,
          "nom": "Débutant",
          "competenceNiveauId": 1
        }
      ],
      "referentiels": []
    }
  ]
}
```

#### GET /api/competences/:id
Récupère une compétence spécifique par son ID.

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Compétence récupérée avec succès",
  "data": {
    "id": 1,
    "nom": "Développement Web",
    "description": "Compétences en développement web",
    "niveaux": [...],
    "referentiels": [...]
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide
- `404` : Compétence non trouvée

#### POST /api/competences
Crée une nouvelle compétence.

**Corps de la requête :**
```json
{
  "nom": "Intelligence Artificielle",
  "description": "Compétences en IA et machine learning"
}
```

**Validations :**
- `nom` : requis, 1-100 caractères, lettres, espaces et tirets uniquement
- `description` : optionnel, max 500 caractères

**Réponse de succès (201) :**
```json
{
  "statut": "success",
  "message": "Compétence créée avec succès",
  "data": {
    "id": 2,
    "nom": "Intelligence Artificielle",
    "description": "Compétences en IA et machine learning"
  }
}
```

**Erreurs possibles :**
- `400` : Données de validation invalides
- `409` : Une compétence avec ce nom existe déjà

#### PUT /api/competences/:id
Met à jour une compétence existante.

**Paramètres :**
- `id` (number) : ID de la compétence

**Corps de la requête :**
```json
{
  "nom": "IA Avancée",
  "description": "Compétences avancées en intelligence artificielle"
}
```

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Compétence mise à jour avec succès",
  "data": {
    "id": 2,
    "nom": "IA Avancée",
    "description": "Compétences avancées en intelligence artificielle"
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide ou données invalides
- `404` : Compétence non trouvée
- `409` : Une compétence avec ce nom existe déjà

#### DELETE /api/competences/:id
Supprime une compétence.

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Compétence supprimée avec succès",
  "data": null
}
```

**Erreurs possibles :**
- `400` : ID invalide
- `404` : Compétence non trouvée

### 2. Gestion des Niveaux d'une Compétence

#### GET /api/competences/:id/niveaux
Récupère tous les niveaux associés à une compétence spécifique.

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Niveaux de la compétence récupérés avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    },
    "niveaux": [
      {
        "id": 1,
        "nom": "Débutant",
        "competenceNiveauId": 1
      },
      {
        "id": 2,
        "nom": "Intermédiaire",
        "competenceNiveauId": 1
      }
    ],
    "count": 2
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide
- `404` : Compétence non trouvée

#### POST /api/competences/:id/niveaux
Ajoute un niveau à une compétence spécifique.

**Paramètres :**
- `id` (number) : ID de la compétence

**Corps de la requête :**
```json
{
  "niveauId": 3
}
```

**Validations :**
- `niveauId` : requis, entier positif, niveau doit exister

**Réponse de succès (201) :**
```json
{
  "statut": "success",
  "message": "Niveau ajouté à la compétence avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    },
    "niveau": {
      "id": 3,
      "nom": "Expert"
    },
    "competenceNiveauId": 1
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide ou données invalides
- `404` : Compétence ou niveau non trouvé
- `409` : Cette compétence est déjà associée à ce niveau

#### PUT /api/competences/:competenceId/niveaux/:niveauId
Modifie le niveau associé à une compétence (remplace un niveau par un autre).

**Paramètres :**
- `competenceId` (number) : ID de la compétence
- `niveauId` (number) : ID du niveau actuel à remplacer

**Corps de la requête :**
```json
{
  "niveauId": 4
}
```

**Validations :**
- `niveauId` : requis, entier positif, nouveau niveau doit exister

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Relation compétence-niveau mise à jour avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    },
    "niveau": {
      "id": 4,
      "nom": "Maître"
    },
    "competenceNiveauId": 1
  }
}
```

**Erreurs possibles :**
- `400` : IDs invalides ou données invalides
- `404` : Relation compétence-niveau non trouvée ou nouveau niveau non trouvé
- `409` : Cette compétence est déjà associée au nouveau niveau

#### DELETE /api/competences/:competenceId/niveaux/:niveauId
Supprime un niveau d'une compétence.

**Paramètres :**
- `competenceId` (number) : ID de la compétence
- `niveauId` (number) : ID du niveau à supprimer

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Niveau supprimé de la compétence avec succès",
  "data": {
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    },
    "niveau": {
      "id": 3,
      "nom": "Expert"
    },
    "competenceNiveauId": 1
  }
}
```

**Erreurs possibles :**
- `400` : IDs invalides
- `404` : Relation compétence-niveau non trouvée

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
  "message": "Compétence non trouvée",
  "data": null
}
```

### Erreurs de conflit (409)
```json
{
  "statut": "error",
  "message": "Une compétence avec ce nom existe déjà",
  "data": null
}
```

### Erreurs serveur (500)
```json
{
  "statut": "error",
  "message": "Erreur lors de la récupération des compétences",
  "data": null
}
```

## Exemples d'utilisation

### Créer une compétence
```bash
curl -X POST http://localhost:3000/api/competences \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Développement Mobile",
    "description": "Compétences en développement d\'applications mobiles"
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

### Récupérer les niveaux d'une compétence
```bash
curl -X GET http://localhost:3000/api/competences/1/niveaux
```

### Supprimer un niveau d'une compétence
```bash
curl -X DELETE http://localhost:3000/api/competences/1/niveaux/2
```

## Notes importantes

1. **Validation stricte** : Tous les champs sont validés selon les règles définies
2. **Gestion des relations** : Les relations compétence-niveau sont gérées automatiquement
3. **Messages en français** : Toutes les réponses sont en français
4. **Structure cohérente** : Toutes les réponses suivent le même format
5. **Gestion d'erreurs complète** : Tous les cas d'erreur sont gérés avec des messages appropriés

## Schéma de base de données

### Table Competence
- `id` : Identifiant unique (auto-incrémenté)
- `nom` : Nom de la compétence (unique)
- `description` : Description optionnelle

### Table Niveau
- `id` : Identifiant unique (auto-incrémenté)
- `nom` : Nom du niveau (unique)

### Table CompetenceNiveau (relation many-to-many)
- `competenceId` : Référence vers Competence
- `niveauId` : Référence vers Niveau
- Clé primaire composite : (competenceId, niveauId)</content>
<parameter name="filePath">/home/mouhamadou-lamine/nodeJs/projectnode/COMPETENCES_API.md
