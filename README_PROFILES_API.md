# Test API Profils - Postman

## 📋 Endpoints Profils

### 1. GET /profiles - Récupérer tous les profils

**Requête :**
```http
GET {{BASE_URL}}/profiles
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des profils récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Admin",
      "description": "Administrateur système"
    },
    {
      "id": 2,
      "nom": "Formateur",
      "description": "Formateur pédagogique"
    }
  ]
}
```

### 2. GET /profiles/:id - Récupérer un profil par ID

**Requête :**
```http
GET {{BASE_URL}}/profiles/1
```

**Paramètres :**
- `id` (number) : ID du profil

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "Admin",
    "description": "Administrateur système"
  }
}
```

### 3. POST /profiles - Créer un nouveau profil

**Requête :**
```http
POST {{BASE_URL}}/profiles
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "Apprenant",
  "description": "Étudiant en formation"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil créé avec succès",
  "data": {
    "id": 3,
    "nom": "Apprenant",
    "description": "Étudiant en formation"
  }
}
```

### 4. PUT /profiles/:id - Modifier un profil

**Requête :**
```http
PUT {{BASE_URL}}/profiles/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID du profil

**Corps de la requête :**
```json
{
  "nom": "Super Admin",
  "description": "Administrateur principal du système"
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil mis à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Super Admin",
    "description": "Administrateur principal du système"
  }
}
```

### 5. DELETE /profiles/:id - Supprimer un profil

**Requête :**
```http
DELETE {{BASE_URL}}/profiles/3
```

**Paramètres :**
- `id` (number) : ID du profil

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Profil supprimé avec succès",
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
     "nom": "Admin",
     "description": "Test"
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Profil inexistant :**
   ```http
   GET {{BASE_URL}}/profiles/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Les profils sont associés aux utilisateurs
- Un profil peut être utilisé par plusieurs utilisateurs
