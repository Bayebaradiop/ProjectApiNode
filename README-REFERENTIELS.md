# API Référentiels - Tests Postman

## Vue d'ensemble
Cette collection Postman contient tous les endpoints pour tester l'API des référentiels de base.

## Endpoints Disponibles

### 1. GET /api/referentiels
**Description :** Récupère la liste de tous les référentiels

**Méthode :** GET
**URL :** `{{base_url}}/api/referentiels`

**Headers :**
```
Content-Type: application/json
```

**Exemple de réponse (200) :**
```json
{
  "statut": "success",
  "message": "Liste des référentiels récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Référentiel Développement Web",
      "description": "Parcours complet pour devenir développeur web full-stack",
      "competences": [
        {
          "referentielId": 1,
          "competenceId": 1
        }
      ],
      "users": [
        {
          "id": 2,
          "username": "formateur1",
          "email": "formateur1@ecsa.sn"
        }
      ],
      "promos": [
        {
          "promoId": 1,
          "referentielId": 1
        }
      ]
    }
  ]
}
```

**Tests Postman :**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.eql("success");
});

pm.test("Response contains data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an("array");
});
```

---

### 2. GET /api/referentiels/:id
**Description :** Récupère un référentiel spécifique par son ID

**Méthode :** GET
**URL :** `{{base_url}}/api/referentiels/1`

**Paramètres URL :**
- `id` (number) : ID du référentiel

**Headers :**
```
Content-Type: application/json
```

**Exemple de réponse (200) :**
```json
{
  "statut": "success",
  "message": "Référentiel récupéré avec succès",
  "data": {
    "id": 1,
    "nom": "Référentiel Développement Web",
    "description": "Parcours complet pour devenir développeur web full-stack",
    "competences": [
      {
        "referentielId": 1,
        "competenceId": 1
      }
    ],
    "users": [
      {
        "id": 2,
        "username": "formateur1",
        "email": "formateur1@ecsa.sn"
      }
    ],
    "promos": [
      {
        "promoId": 1,
        "referentielId": 1
      }
    ]
  }
}
```

**Exemple d'erreur (404) :**
```json
{
  "statut": "error",
  "message": "Référentiel non trouvé",
  "data": null
}
```

**Tests Postman :**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.eql("success");
});

pm.test("Response contains referentiel data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("id");
    pm.expect(jsonData.data).to.have.property("nom");
});
```

---

### 3. POST /api/referentiels
**Description :** Crée un nouveau référentiel

**Méthode :** POST
**URL :** `{{base_url}}/api/referentiels`

**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "nom": "Référentiel Intelligence Artificielle",
  "description": "Parcours pour maîtriser l'IA et le machine learning"
}
```

**Exemple de réponse (201) :**
```json
{
  "statut": "success",
  "message": "Référentiel créé avec succès",
  "data": {
    "id": 3,
    "nom": "Référentiel Intelligence Artificielle",
    "description": "Parcours pour maîtriser l'IA et le machine learning"
  }
}
```

**Exemple d'erreur (400) - Validation :**
```json
{
  "statut": "error",
  "message": "Données de validation invalides",
  "data": null,
  "errors": [
    {
      "field": "nom",
      "message": "Le nom doit contenir au moins 3 caractères"
    }
  ]
}
```

**Tests Postman :**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.eql("success");
});

pm.test("Response contains created referentiel", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("id");
    pm.expect(jsonData.data.nom).to.eql("Référentiel Intelligence Artificielle");
});
```

---

### 4. PUT /api/referentiels/:id
**Description :** Met à jour un référentiel existant

**Méthode :** PUT
**URL :** `{{base_url}}/api/referentiels/1`

**Paramètres URL :**
- `id` (number) : ID du référentiel

**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "nom": "Référentiel Développement Web Avancé",
  "description": "Parcours avancé pour les développeurs web expérimentés"
}
```

**Exemple de réponse (200) :**
```json
{
  "statut": "success",
  "message": "Référentiel mis à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Référentiel Développement Web Avancé",
    "description": "Parcours avancé pour les développeurs web expérimentés"
  }
}
```

**Tests Postman :**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.eql("success");
});

pm.test("Referentiel was updated", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.nom).to.eql("Référentiel Développement Web Avancé");
});
```

---

### 5. DELETE /api/referentiels/:id
**Description :** Supprime un référentiel

**Méthode :** DELETE
**URL :** `{{base_url}}/api/referentiels/3`

**Paramètres URL :**
- `id` (number) : ID du référentiel

**Headers :**
```
Content-Type: application/json
```

**Exemple de réponse (200) :**
```json
{
  "statut": "success",
  "message": "Référentiel supprimé avec succès",
  "data": null
}
```

**Tests Postman :**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.eql("success");
});
```

---

## Variables d'environnement Postman

Créer les variables suivantes dans votre environnement Postman :

```
base_url = http://localhost:3000
```

## Collection Postman

Vous pouvez importer cette collection dans Postman en créant une nouvelle collection et ajoutant chaque endpoint avec ses configurations respectives.

## Codes d'erreur courants

- **400** : Données de validation invalides
- **404** : Référentiel non trouvé
- **409** : Conflit (nom dupliqué)
- **500** : Erreur serveur interne

## Structure des données

### Référentiel
```json
{
  "id": "number",
  "nom": "string (min: 3 caractères)",
  "description": "string (optionnel)",
  "competences": "array (relations)",
  "users": "array (relations)",
  "promos": "array (relations)"
}
```
