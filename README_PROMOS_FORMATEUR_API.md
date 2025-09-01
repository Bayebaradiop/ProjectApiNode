# Test API Promos Formateur - Postman

## 📋 Endpoints Promos Formateur

### 1. GET /promos-formateur - Récupérer toutes les promos formateur

**Requête :**
```http
GET {{BASE_URL}}/promos-formateur
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des promos formateur récupérée avec succès",
  "data": [
    {
      "id": 1,
      "promoId": 1,
      "formateurId": 1,
      "promo": {
        "id": 1,
        "nom": "Promo 2024"
      },
      "formateur": {
        "id": 1,
        "nom": "Dupont",
        "prenom": "Jean"
      }
    }
  ]
}
```

### 2. GET /promos-formateur/:id - Récupérer une promo formateur par ID

**Requête :**
```http
GET {{BASE_URL}}/promos-formateur/1
```

**Paramètres :**
- `id` (number) : ID de la promo formateur

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo formateur récupérée avec succès",
  "data": {
    "id": 1,
    "promoId": 1,
    "formateurId": 1,
    "promo": {
      "id": 1,
      "nom": "Promo 2024"
    },
    "formateur": {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean"
    }
  }
}
```

### 3. POST /promos-formateur - Créer une nouvelle promo formateur

**Requête :**
```http
POST {{BASE_URL}}/promos-formateur
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "promoId": 1,
  "formateurId": 2
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo formateur créée avec succès",
  "data": {
    "id": 2,
    "promoId": 1,
    "formateurId": 2,
    "promo": {
      "id": 1,
      "nom": "Promo 2024"
    },
    "formateur": {
      "id": 2,
      "nom": "Martin",
      "prenom": "Marie"
    }
  }
}
```

### 4. PUT /promos-formateur/:id - Modifier une promo formateur

**Requête :**
```http
PUT {{BASE_URL}}/promos-formateur/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de la promo formateur

**Corps de la requête :**
```json
{
  "promoId": 2,
  "formateurId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo formateur mise à jour avec succès",
  "data": {
    "id": 1,
    "promoId": 2,
    "formateurId": 1,
    "promo": {
      "id": 2,
      "nom": "Promo 2025"
    },
    "formateur": {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean"
    }
  }
}
```

### 5. DELETE /promos-formateur/:id - Supprimer une promo formateur

**Requête :**
```http
DELETE {{BASE_URL}}/promos-formateur/2
```

**Paramètres :**
- `id` (number) : ID de la promo formateur

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo formateur supprimée avec succès",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Promo ID manquant :**
   ```json
   {
     "formateurId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

2. **Formateur ID manquant :**
   ```json
   {
     "promoId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

3. **Promo inexistante :**
   ```json
   {
     "promoId": 999,
     "formateurId": 1
   }
   ```
   **Réponse attendue :** Erreur 404

4. **Formateur inexistant :**
   ```json
   {
     "promoId": 1,
     "formateurId": 999
   }
   ```
   **Réponse attendue :** Erreur 404

5. **Association dupliquée :**
   ```json
   {
     "promoId": 1,
     "formateurId": 1
   }
   ```
   **Réponse attendue :** Erreur 409

### Test d'intégrité
1. **Promo formateur inexistante :**
   ```http
   GET {{BASE_URL}}/promos-formateur/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Une promo peut avoir plusieurs formateurs
- Un formateur peut être assigné à plusieurs promos
- L'association (promoId, formateurId) doit être unique
- Les IDs de promo et formateur doivent exister dans leurs tables respectives
