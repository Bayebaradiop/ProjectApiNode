# Test API Profils de Sortie - Postman

## 📋 Endpoints Profils de Sortie

### 1. GET /profils-sortie - Récupérer tous les profils de sortie

**Requête :**
```http
GET {{BASE_URL}}/profils-sortie
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des profils de sortie récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Développeur Full Stack"
    },
    {
      "id": 2,
      "nom": "Développeur Front-end"
    }
  ]
}
```

### 2. GET /profils-sortie/:id - Récupérer un profil de sortie par ID

**Requête :**
```http
GET {{BASE_URL}}/profils-sortie/1
```

**Paramètres :**
- `id` (number) : ID du profil de sortie

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil de sortie récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "Développeur Full Stack"
  }
}
```

### 3. POST /profils-sortie - Créer un nouveau profil de sortie

**Requête :**
```http
POST {{BASE_URL}}/profils-sortie
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "Data Scientist"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil de sortie créé avec succès",
  "data": {
    "id": 3,
    "nom": "Data Scientist"
  }
}
```

### 4. PUT /profils-sortie/:id - Modifier un profil de sortie

**Requête :**
```http
PUT {{BASE_URL}}/profils-sortie/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID du profil de sortie

**Corps de la requête :**
```json
{
  "nom": "Développeur Full Stack Senior"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil de sortie mis à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Développeur Full Stack Senior"
  }
}
```

### 5. DELETE /profils-sortie/:id - Supprimer un profil de sortie

**Requête :**
```http
DELETE {{BASE_URL}}/profils-sortie/3
```

**Paramètres :**
- `id` (number) : ID du profil de sortie

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil de sortie supprimé avec succès",
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
     "nom": "Développeur Full Stack"
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Profil de sortie inexistant :**
   ```http
   GET {{BASE_URL}}/profils-sortie/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Les profils de sortie sont associés aux utilisateurs
- Un profil de sortie peut être utilisé par plusieurs utilisateurs
