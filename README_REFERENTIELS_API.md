# Test API Référentiels - Postman

## 📋 Endpoints Référentiels

### 1. GET /referentiels - Récupérer tous les référentiels

**Requête :**
```http
GET {{BASE_URL}}/referentiels
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des référentiels récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Référentiel Développement Web",
      "description": "Référentiel pour les formations en développement web",
      "competences": []
    }
  ]
}
```

### 2. GET /referentiels/:id - Récupérer un référentiel par ID

**Requête :**
```http
GET {{BASE_URL}}/referentiels/1
```

**Paramètres :**
- `id` (number) : ID du référentiel

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Référentiel récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "Référentiel Développement Web",
    "description": "Référentiel pour les formations en développement web",
    "competences": []
  }
}
```

### 3. POST /referentiels - Créer un nouveau référentiel

**Requête :**
```http
POST {{BASE_URL}}/referentiels
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "Référentiel Data Science",
  "description": "Référentiel pour les formations en data science"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Référentiel créé avec succès",
  "data": {
    "id": 2,
    "nom": "Référentiel Data Science",
    "description": "Référentiel pour les formations en data science",
    "competences": []
  }
}
```

### 4. PUT /referentiels/:id - Modifier un référentiel

**Requête :**
```http
PUT {{BASE_URL}}/referentiels/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID du référentiel

**Corps de la requête :**
```json
{
  "nom": "Référentiel Développement Web Avancé",
  "description": "Référentiel mis à jour pour les formations en développement web"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Référentiel mis à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Référentiel Développement Web Avancé",
    "description": "Référentiel mis à jour pour les formations en développement web",
    "competences": []
  }
}
```

### 5. DELETE /referentiels/:id - Supprimer un référentiel

**Requête :**
```http
DELETE {{BASE_URL}}/referentiels/2
```

**Paramètres :**
- `id` (number) : ID du référentiel

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Référentiel supprimé avec succès",
  "data": null
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
     "nom": "Référentiel Développement Web",
     "description": "Test"
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Référentiel inexistant :**
   ```http
   GET {{BASE_URL}}/referentiels/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Les référentiels peuvent être associés à des compétences
- Un référentiel peut être utilisé par plusieurs promos
