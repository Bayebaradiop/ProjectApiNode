# Test API Compétences-Niveau - Postman

## 📋 Endpoints Compétences-Niveau

### 1. GET /competences-niveau - Récupérer toutes les associations compétences-niveau

**Requête :**
```http
GET {{BASE_URL}}/competences-niveau
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des associations compétences-niveau récupérée avec succès",
  "data": [
    {
      "id": 1,
      "competenceId": 1,
      "niveauId": 1,
      "competence": {
        "id": 1,
        "nom": "Développement Web"
      },
      "niveau": {
        "id": 1,
        "nom": "Débutant"
      }
    }
  ]
}
```

### 2. GET /competences-niveau/:id - Récupérer une association par ID

**Requête :**
```http
GET {{BASE_URL}}/competences-niveau/1
```

**Paramètres :**
- `id` (number) : ID de l'association

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association compétence-niveau récupérée avec succès",
  "data": {
    "id": 1,
    "competenceId": 1,
    "niveauId": 1,
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    },
    "niveau": {
      "id": 1,
      "nom": "Débutant"
    }
  }
}
```

### 3. POST /competences-niveau - Créer une nouvelle association

**Requête :**
```http
POST {{BASE_URL}}/competences-niveau
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "competenceId": 1,
  "niveauId": 2
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association compétence-niveau créée avec succès",
  "data": {
    "id": 2,
    "competenceId": 1,
    "niveauId": 2,
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    },
    "niveau": {
      "id": 2,
      "nom": "Intermédiaire"
    }
  }
}
```

### 4. PUT /competences-niveau/:id - Modifier une association

**Requête :**
```http
PUT {{BASE_URL}}/competences-niveau/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de l'association

**Corps de la requête :**
```json
{
  "competenceId": 2,
  "niveauId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association compétence-niveau mise à jour avec succès",
  "data": {
    "id": 1,
    "competenceId": 2,
    "niveauId": 1,
    "competence": {
      "id": 2,
      "nom": "Data Science"
    },
    "niveau": {
      "id": 1,
      "nom": "Débutant"
    }
  }
}
```

### 5. DELETE /competences-niveau/:id - Supprimer une association

**Requête :**
```http
DELETE {{BASE_URL}}/competences-niveau/2
```

**Paramètres :**
- `id` (number) : ID de l'association

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association compétence-niveau supprimée avec succès",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Compétence ID manquant :**
   ```json
   {
     "niveauId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

2. **Niveau ID manquant :**
   ```json
   {
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

3. **Compétence inexistante :**
   ```json
   {
     "competenceId": 999,
     "niveauId": 1
   }
   ```
   **Réponse attendue :** Erreur 404

4. **Niveau inexistant :**
   ```json
   {
     "competenceId": 1,
     "niveauId": 999
   }
   ```
   **Réponse attendue :** Erreur 404

5. **Association dupliquée :**
   ```json
   {
     "competenceId": 1,
     "niveauId": 1
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Association inexistante :**
   ```http
   GET {{BASE_URL}}/competences-niveau/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Une compétence peut être associée à plusieurs niveaux
- Un niveau peut être associé à plusieurs compétences
- L'association (competenceId, niveauId) doit être unique
- Les IDs de compétence et niveau doivent exister dans leurs tables respectives
