# Test API Promos - Postman

## 📋 Endpoints Promos

### 1. GET /promos - Récupérer toutes les promos

**Requête :**
```http
GET {{BASE_URL}}/promos
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Liste des promos récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Promo 2024",
      "description": "Promotion 2024",
      "dateDebut": "2024-01-01T00:00:00.000Z",
      "dateFin": "2024-12-31T00:00:00.000Z",
      "referentielId": 1
    }
  ]
}
```

### 2. GET /promos/:id - Récupérer une promo par ID

**Requête :**
```http
GET {{BASE_URL}}/promos/1
```

**Paramètres :**
- `id` (number) : ID de la promo

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo récupérée avec succès",
  "data": {
    "id": 1,
    "nom": "Promo 2024",
    "description": "Promotion 2024",
    "dateDebut": "2024-01-01T00:00:00.000Z",
    "dateFin": "2024-12-31T00:00:00.000Z",
    "referentielId": 1
  }
}
```

### 3. POST /promos - Créer une nouvelle promo

**Requête :**
```http
POST {{BASE_URL}}/promos
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "nom": "Promo 2025",
  "description": "Promotion 2025",
  "dateDebut": "2025-01-01T00:00:00.000Z",
  "dateFin": "2025-12-31T00:00:00.000Z",
  "referentielId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo créée avec succès",
  "data": {
    "id": 2,
    "nom": "Promo 2025",
    "description": "Promotion 2025",
    "dateDebut": "2025-01-01T00:00:00.000Z",
    "dateFin": "2025-12-31T00:00:00.000Z",
    "referentielId": 1
  }
}
```

### 4. PUT /promos/:id - Modifier une promo

**Requête :**
```http
PUT {{BASE_URL}}/promos/1
Content-Type: application/json
```

**Paramètres :**
- `id` (number) : ID de la promo

**Corps de la requête :**
```json
{
  "nom": "Promo 2024 Mise à Jour",
  "description": "Promotion 2024 mise à jour",
  "dateDebut": "2024-01-01T00:00:00.000Z",
  "dateFin": "2024-12-31T00:00:00.000Z",
  "referentielId": 1
}
```

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo mise à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Promo 2024 Mise à Jour",
    "description": "Promotion 2024 mise à jour",
    "dateDebut": "2024-01-01T00:00:00.000Z",
    "dateFin": "2024-12-31T00:00:00.000Z",
    "referentielId": 1
  }
}
```

### 5. DELETE /promos/:id - Supprimer une promo

**Requête :**
```http
DELETE {{BASE_URL}}/promos/2
```

**Paramètres :**
- `id` (number) : ID de la promo

**Réponse attendue :**
```json
{
  "statut": "success",
  "message": "Promo supprimée avec succès",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation
1. **Nom vide :**
   ```json
   {
     "nom": "",
     "description": "Test",
     "dateDebut": "2024-01-01T00:00:00.000Z",
     "dateFin": "2024-12-31T00:00:00.000Z",
     "referentielId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

2. **Date de fin avant date de début :**
   ```json
   {
     "nom": "Test",
     "description": "Test",
     "dateDebut": "2024-12-31T00:00:00.000Z",
     "dateFin": "2024-01-01T00:00:00.000Z",
     "referentielId": 1
   }
   ```
   **Réponse attendue :** Erreur 400

3. **Référentiel inexistant :**
   ```json
   {
     "nom": "Test",
     "description": "Test",
     "dateDebut": "2024-01-01T00:00:00.000Z",
     "dateFin": "2024-12-31T00:00:00.000Z",
     "referentielId": 999
   }
   ```
   **Réponse attendue :** Erreur 404

### Test d'intégrité
1. **Promo inexistante :**
   ```http
   GET {{BASE_URL}}/promos/999
   ```
   **Réponse attendue :** Erreur 404

## 📝 Notes

- Le champ `nom` doit être unique
- Les dates doivent être au format ISO 8601
- `dateFin` doit être postérieure à `dateDebut`
- `referentielId` doit référencer un référentiel existant
