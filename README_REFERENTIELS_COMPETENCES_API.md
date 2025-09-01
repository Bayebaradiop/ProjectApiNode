# Test API Référentiels-Compétences - Postman

## 📋 Endpoints Référentiels-Compétences

### 1. GET /referentiels-competences - Récupérer toutes les associations

**Requête :**
```http
GET {{BASE_URL}}/referentiels-competences
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des associations référentiel-compétence récupérée avec succès",
  "data": [
    {
      "referentielId": 1,
      "competenceId": 1,
      "referentiel": {
        "id": 1,
        "nom": "Référentiel Développement Web",
        "description": "Référentiel pour les formations en développement web"
      },
      "competence": {
        "id": 1,
        "nom": "Développement Web",
        "description": "Compétence en développement web"
      }
    }
  ]
}
```

### 2. GET /referentiels-competences/:referentielId/:competenceId - Récupérer une association par ID

**Requête :**
```http
GET {{BASE_URL}}/referentiels-competences/1/1
```

**Paramètres :**
- `referentielId` (number) : ID du référentiel
- `competenceId` (number) : ID de la compétence

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association récupérée avec succès",
  "data": {
    "referentielId": 1,
    "competenceId": 1,
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web",
      "description": "Référentiel pour les formations en développement web"
    },
    "competence": {
      "id": 1,
      "nom": "Développement Web",
      "description": "Compétence en développement web"
    }
  }
}
```

### 3. POST /referentiels-competences - Créer une nouvelle association

**Requête :**
```http
POST {{BASE_URL}}/referentiels-competences
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "referentielId": 1,
  "competenceId": 2
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association créée avec succès",
  "data": {
    "referentielId": 1,
    "competenceId": 2,
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web",
      "description": "Référentiel pour les formations en développement web"
    },
    "competence": {
      "id": 2,
      "nom": "Data Science",
      "description": "Compétence en data science"
    }
  }
}
```

### 4. DELETE /referentiels-competences/:referentielId/:competenceId - Supprimer une association

**Requête :**
```http
DELETE {{BASE_URL}}/referentiels-competences/1/2
```

**Paramètres :**
- `referentielId` (number) : ID du référentiel
- `competenceId` (number) : ID de la compétence

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association supprimée avec succès",
  "data": {
    "referentielId": 1,
    "competenceId": 2,
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web",
      "description": "Référentiel pour les formations en développement web"
    },
    "competence": {
      "id": 2,
      "nom": "Data Science",
      "description": "Compétence en data science"
    }
  }
}
```

### 5. GET /referentiels-competences/referentiels/:id/competences - Récupérer les compétences d'un référentiel

**Requête :**
```http
GET {{BASE_URL}}/referentiels-competences/referentiels/1/competences
```

**Paramètres :**
- `id` (number) : ID du référentiel

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Compétences du référentiel récupérées avec succès",
  "data": [
    {
      "referentielId": 1,
      "competenceId": 1,
      "competence": {
        "id": 1,
        "nom": "Développement Web",
        "description": "Compétence en développement web"
      }
    },
    {
      "referentielId": 1,
      "competenceId": 2,
      "competence": {
        "id": 2,
        "nom": "Data Science",
        "description": "Compétence en data science"
      }
    }
  ]
}
```

### 6. GET /referentiels-competences/competences/:id/referentiels - Récupérer les référentiels d'une compétence

**Requête :**
```http
GET {{BASE_URL}}/referentiels-competences/competences/1/referentiels
```

**Paramètres :**
- `id` (number) : ID de la compétence

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Référentiels de la compétence récupérés avec succès",
  "data": [
    {
      "referentielId": 1,
      "competenceId": 1,
      "referentiel": {
        "id": 1,
        "nom": "Référentiel Développement Web",
        "description": "Référentiel pour les formations en développement web"
      }
    }
  ]
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **IDs manquants :**
   ```json
   {
     "referentielId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

2. **IDs invalides :**
   ```json
   {
     "referentielId": "abc",
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

3. **Référentiel inexistant :**
   ```json
   {
     "referentielId": 999,
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 404

4. **Compétence inexistante :**
   ```json
   {
     "referentielId": 1,
     "competenceId": 999
   }
   ```
   **Réponse attendue :** Erreur 404

5. **Association dupliquée :**
   ```json
   {
     "referentielId": 1,
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Association inexistante :**
   ```http
   GET {{BASE_URL}}/referentiels-competences/999/999
   ```
   **Réponse attendue :** Erreur 404

2. **Référentiel sans compétences :**
   ```http
   GET {{BASE_URL}}/referentiels-competences/referentiels/999/competences
   ```
   **Réponse attendue :** Erreur 404

3. **Compétence sans référentiels :**
   ```http
   GET {{BASE_URL}}/referentiels-competences/competences/999/referentiels
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Une compétence peut appartenir à plusieurs référentiels
- Un référentiel peut contenir plusieurs compétences
- L'association (referentielId, competenceId) doit être unique
- Les IDs de référentiel et compétence doivent exister dans leurs tables respectives
- Les relations incluent toujours les objets complets (referentiel et competence)
    "id": 1,
    "referentielId": 1,
    "competenceId": 1,
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web"
    },
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    }
  }
}
```

### 3. POST /referentiels-competences - Créer une nouvelle association

**Requête :**
```http
POST {{BASE_URL}}/referentiels-competences
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "referentielId": 1,
  "competenceId": 2
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association référentiel-compétence créée avec succès",
  "data": {
    "id": 2,
    "referentielId": 1,
    "competenceId": 2,
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web"
    },
    "competence": {
      "id": 2,
      "nom": "Data Science"
    }
  }
}
```

### 4. PUT /referentiels-competences/:id - Modifier une association

**Requête :**
```http
PUT {{BASE_URL}}/referentiels-competences/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de l'association

**Corps de la requête :**
```json
{
  "referentielId": 2,
  "competenceId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association référentiel-compétence mise à jour avec succès",
  "data": {
    "id": 1,
    "referentielId": 2,
    "competenceId": 1,
    "referentiel": {
      "id": 2,
      "nom": "Référentiel Data Science"
    },
    "competence": {
      "id": 1,
      "nom": "Développement Web"
    }
  }
}
```

### 5. DELETE /referentiels-competences/:id - Supprimer une association

**Requête :**
```http
DELETE {{BASE_URL}}/referentiels-competences/2
```

**Paramètres :**
- `id` (number) : ID de l'association

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Association référentiel-compétence supprimée avec succès",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Référentiel ID manquant :**
   ```json
   {
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

2. **Compétence ID manquant :**
   ```json
   {
     "referentielId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

3. **Référentiel inexistant :**
   ```json
   {
     "referentielId": 999,
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 404

4. **Compétence inexistante :**
   ```json
   {
     "referentielId": 1,
     "competenceId": 999
   }
   ```
   **Réponse attendue :** Erreur 404

5. **Association dupliquée :**
   ```json
   {
     "referentielId": 1,
     "competenceId": 1
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Association inexistante :**
   ```http
   GET {{BASE_URL}}/referentiels-competences/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Un référentiel peut contenir plusieurs compétences
- Une compétence peut appartenir à plusieurs référentiels
- L'association (referentielId, competenceId) doit être unique
- Les IDs de référentiel et compétence doivent exister dans leurs tables respectives
