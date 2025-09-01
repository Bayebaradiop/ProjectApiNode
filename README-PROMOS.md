# Documentation API - Promotions

## Vue d'ensemble

L'API Promotions permet de gérer les promotions de formation dans le système ECSA. Une promotion est caractérisée par un nom, une date de début et une date de fin, et peut être associée à des formateurs et des référentiels.

## Endpoints

### Base URL
```
http://localhost:3000/api/promos
```

---

## 1. Récupérer toutes les promotions

### GET /api/promos

Récupère la liste de toutes les promotions avec leurs formateurs et référentiels associés.

**Réponse de succès (200)**
```json
{
  "statut": "success",
  "message": "Liste des promos récupérée avec succès",
  "data": [
    {
      "id": 1,
      "nom": "Promotion 2024-2025",
      "dateDebut": "2024-09-01T00:00:00.000Z",
      "dateFin": "2025-06-30T00:00:00.000Z",
      "formateurs": [
        {
          "promoId": 1,
          "userId": 2,
          "promo": { ... },
          "user": {
            "id": 2,
            "username": "formateur1",
            "email": "formateur1@ecsa.sn"
          }
        }
      ],
      "referentiels": [
        {
          "id": 1,
          "nom": "Référentiel Développement Web",
          "description": "Parcours complet pour devenir développeur web full-stack"
        }
      ]
    }
  ]
}
```

---

## 2. Récupérer une promotion par ID

### GET /api/promos/:id

Récupère les détails d'une promotion spécifique.

**Paramètres**
- `id` (number): ID de la promotion

**Réponse de succès (200)**
```json
{
  "statut": "success",
  "message": "Promo récupérée avec succès",
  "data": {
    "id": 1,
    "nom": "Promotion 2024-2025",
    "dateDebut": "2024-09-01T00:00:00.000Z",
    "dateFin": "2025-06-30T00:00:00.000Z",
    "formateurs": [ ... ],
    "referentiels": [ ... ]
  }
}
```

**Réponses d'erreur**
- `400`: ID invalide
- `404`: Promotion non trouvée

---

## 3. Créer une nouvelle promotion

### POST /api/promos

Crée une nouvelle promotion.

**Corps de la requête**
```json
{
  "nom": "Promotion 2025-2026",
  "dateDebut": "2025-09-01",
  "dateFin": "2026-06-30"
}
```

**Validation des champs**
- `nom`: string (1-100 caractères) - requis
- `dateDebut`: string (format date valide) - requis
- `dateFin`: string (format date valide) - requis, doit être postérieure à dateDebut

**Réponse de succès (201)**
```json
{
  "statut": "success",
  "message": "Promo créée avec succès",
  "data": {
    "id": 3,
    "nom": "Promotion 2025-2026",
    "dateDebut": "2025-09-01T00:00:00.000Z",
    "dateFin": "2026-06-30T00:00:00.000Z"
  }
}
```

**Réponses d'erreur**
- `400`: Données invalides
- `409`: Une promotion avec ce nom existe déjà

---

## 4. Mettre à jour une promotion

### PUT /api/promos/:id

Met à jour une promotion existante.

**Paramètres**
- `id` (number): ID de la promotion

**Corps de la requête** (tous les champs sont optionnels)
```json
{
  "nom": "Promotion 2024-2025 Modifiée",
  "dateDebut": "2024-09-15",
  "dateFin": "2025-07-15"
}
```

**Réponse de succès (200)**
```json
{
  "statut": "success",
  "message": "Promo mise à jour avec succès",
  "data": {
    "id": 1,
    "nom": "Promotion 2024-2025 Modifiée",
    "dateDebut": "2024-09-15T00:00:00.000Z",
    "dateFin": "2025-07-15T00:00:00.000Z"
  }
}
```

**Réponses d'erreur**
- `400`: Données invalides ou ID invalide
- `404`: Promotion non trouvée
- `409`: Une promotion avec ce nom existe déjà

---

## 5. Supprimer une promotion

### DELETE /api/promos/:id

Supprime une promotion et tous ses liens avec les formateurs et référentiels.

**Paramètres**
- `id` (number): ID de la promotion

**Réponse de succès (200)**
```json
{
  "statut": "success",
  "message": "Promo supprimée avec succès",
  "data": null
}
```

**Réponses d'erreur**
- `400`: ID invalide
- `404`: Promotion non trouvée

---

## Exemples d'utilisation avec Postman

### 1. Créer une promotion
```
Method: POST
URL: http://localhost:3000/api/promos
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "nom": "Promotion 2025-2026",
  "dateDebut": "2025-09-01",
  "dateFin": "2026-06-30"
}
```

### 2. Récupérer toutes les promotions
```
Method: GET
URL: http://localhost:3000/api/promos
```

### 3. Récupérer une promotion spécifique
```
Method: GET
URL: http://localhost:3000/api/promos/1
```

### 4. Mettre à jour une promotion
```
Method: PUT
URL: http://localhost:3000/api/promos/1
Headers:
  Content-Type: application/json

Body (raw JSON):
{
  "nom": "Promotion 2024-2025 Mise à jour"
}
```

### 5. Supprimer une promotion
```
Method: DELETE
URL: http://localhost:3000/api/promos/1
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Création réussie |
| 400 | Données invalides |
| 404 | Ressource non trouvée |
| 409 | Conflit (nom déjà existant) |
| 500 | Erreur serveur |

---

## Associations et Relations

### Relations d'une promotion

Une promotion peut être associée à :

1. **Formateurs** : Utilisateurs ayant le profil FORMATEUR
2. **Référentiels** : Programmes de formation

Ces associations sont automatiquement incluses dans les réponses des endpoints GET.

### Structure des données avec associations

```json
{
  "id": 1,
  "nom": "Promotion 2024-2025",
  "dateDebut": "2024-09-01T00:00:00.000Z",
  "dateFin": "2025-06-30T00:00:00.000Z",
  "formateurs": [
    {
      "promoId": 1,
      "userId": 2,
      "user": {
        "id": 2,
        "username": "formateur1",
        "email": "formateur1@ecsa.sn",
        "profile": {
          "nom": "FORMATEUR"
        }
      }
    }
  ],
  "referentiels": [
    {
      "id": 1,
      "nom": "Référentiel Développement Web",
      "description": "Parcours complet pour devenir développeur web full-stack"
    }
  ]
}
```

### Gestion des associations

**Note importante** : Les associations promo-formateur et promo-référentiel sont gérées automatiquement lors de la création des données de test via le seeding. Dans une version future de l'API, des endpoints dédiés pourraient être ajoutés pour gérer ces associations de manière plus granulaire.
