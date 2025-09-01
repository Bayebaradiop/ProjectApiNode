# Test API Utilisateurs - Postman

## 📋 Endpoints Utilisateurs

### 1. GET /users - Récupérer tous les utilisateurs

**Requête :**
```http
GET {{BASE_URL}}/users
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des utilisateurs récupérée avec succès",
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "profile": {
        "id": 1,
        "nom": "Admin"
      },
      "profilSortie": {
        "id": 1,
        "nom": "Développeur Full Stack"
      },
      "referentiel": {
        "id": 1,
        "nom": "Référentiel Développement"
      }
    }
  ]
}
```

### 2. GET /users/:id - Récupérer un utilisateur par ID

**Requête :**
```http
GET {{BASE_URL}}/users/1
```

**Paramètres :**
- `id` (number) : ID de l'utilisateur

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Utilisateur récupéré avec succès",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "profile": {
      "id": 1,
      "nom": "Admin"
    }
  }
}
```

### 3. POST /users - Créer un nouvel utilisateur

**Requête :**
```http
POST {{BASE_URL}}/users
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "username": "jane_smith",
  "email": "jane@example.com",
  "password": "password123",
  "nom": "Smith",
  "prenom": "Jane",
  "telephone": "+33123456789",
  "profileId": 1,
  "profilSortieId": 1,
  "referentielId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": 2,
    "username": "jane_smith",
    "email": "jane@example.com"
  }
}
```

### 4. PUT /users/:id - Modifier un utilisateur

**Requête :**
```http
PUT {{BASE_URL}}/users/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de l'utilisateur

**Corps de la requête :**
```json
{
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+33123456789",
  "profileId": 1,
  "profilSortieId": 1,
  "referentielId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Utilisateur mis à jour avec succès",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 5. DELETE /users/:id - Supprimer un utilisateur

**Requête :**
```http
DELETE {{BASE_URL}}/users/1
```

**Paramètres :**
- `id` (number) : ID de l'utilisateur

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Utilisateur supprimé avec succès",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Email invalide :**
   ```json
   {
     "username": "test",
     "email": "invalid-email",
     "password": "password123"
   }
   ```
   **Réponse attendue :** Erreur 400 avec détails des champs invalides

2. **Username trop court :**
   ```json
   {
     "username": "a",
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   **Réponse attendue :** Erreur 400 avec détails des champs invalides

### Test d'intégrité
1. **Utilisateur inexistant :**
   ```http
   GET {{BASE_URL}}/users/999
   ```
   **Réponse attendue :** Erreur 404

2. **Email dupliqué :**
   ```json
   {
     "username": "test2",
     "email": "john@example.com",
     "password": "password123"
   }
   ```
   **Réponse attendue :** Erreur 409 (Conflict)

## 📝 Notes

- Le champ `username` doit être unique
- Le champ `email` doit être unique et au format email valide
- Le champ `password` est requis lors de la création
- Les champs `profileId`, `profilSortieId`, et `referentielId` sont optionnels mais doivent référencer des entités existantes
