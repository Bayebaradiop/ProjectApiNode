# Test API Tags - Postman

## 📋 Endpoints Tags

### 1. GET /tags - Récupérer tous les tags

**Requête :**
```http
GET {{BASE_URL}}/tags
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des tags récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "JavaScript"
    },
    {
      "id": 2,
      "nom": "React"
    }
  ]
}
```

### 2. GET /tags/:id - Récupérer un tag par ID

**Requête :**
```http
GET {{BASE_URL}}/tags/1
```

**Paramètres :**
- `id` (number) : ID du tag

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Tag récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "JavaScript"
  }
}
```

### 3. POST /tags - Créer un nouveau tag

**Requête :**
```http
POST {{BASE_URL}}/tags
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "Node.js"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Tag créé avec succès",
  "data": {
    "id": 3,
    "nom": "Node.js"
  }
}
```

### 4. PUT /tags/:id - Modifier un tag

**Requête :**
```http
PUT {{BASE_URL}}/tags/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID du tag

**Corps de la requête :**
```json
{
  "nom": "JavaScript ES6+"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Tag mis à jour avec succès",
  "data": {
    "id": 1,
    "nom": "JavaScript ES6+"
  }
}
```

### 5. DELETE /tags/:id - Supprimer un tag

**Requête :**
```http
DELETE {{BASE_URL}}/tags/3
```

**Paramètres :**
- `id` (number) : ID du tag

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Tag supprimé avec succès",
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
     "nom": "JavaScript"
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Tag inexistant :**
   ```http
   GET {{BASE_URL}}/tags/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Les tags peuvent être associés aux compétences
- Un tag peut être utilisé par plusieurs compétences
