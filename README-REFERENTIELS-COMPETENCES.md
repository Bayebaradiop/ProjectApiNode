# API Référentiels - Compétences - Tests Postman

## Vue d'ensemble
Cette collection Postman contient tous les endpoints pour tester la gestion des compétences dans les référentiels.

## ⚠️ Note Importante
Ces endpoints peuvent nécessiter une correction des routes dans le code source. Si vous rencontrez des erreurs 404, vérifiez que les routes de compétence sont correctement activées dans `app.ts`.

## Endpoints Disponibles

### 1. GET /api/referentiels/:id/competences
**Description :** Récupère toutes les compétences associées à un référentiel spécifique

**Méthode :** GET
**URL :** `{{base_url}}/api/referentiels/1/competences`

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
  "message": "Compétences du référentiel récupérées avec succès",
  "data": {
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web"
    },
    "competences": [
      {
        "id": 1,
        "nom": "JavaScript",
        "description": "Langage de programmation JavaScript",
        "referentielCompetenceId": 1
      },
      {
        "id": 2,
        "nom": "React",
        "description": "Bibliothèque JavaScript pour les interfaces utilisateur",
        "referentielCompetenceId": 1
      }
    ],
    "count": 2
  }
}
```

**Exemple d'erreur (404) - Référentiel non trouvé :**
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

pm.test("Response contains referentiel info", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("referentiel");
    pm.expect(jsonData.data).to.have.property("competences");
    pm.expect(jsonData.data).to.have.property("count");
});

pm.test("Competences is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.competences).to.be.an("array");
});
```

---

### 2. POST /api/referentiels/:id/competences
**Description :** Ajoute une compétence à un référentiel

**Méthode :** POST
**URL :** `{{base_url}}/api/referentiels/1/competences`

**Paramètres URL :**
- `id` (number) : ID du référentiel

**Headers :**
```
Content-Type: application/json
```

**Body (raw JSON) :**
```json
{
  "competenceId": 3
}
```

**Exemple de réponse (201) :**
```json
{
  "statut": "success",
  "message": "Compétence ajoutée au référentiel avec succès",
  "data": {
    "id": 1,
    "referentielId": 1,
    "competenceId": 3,
    "competence": {
      "id": 3,
      "nom": "Node.js",
      "description": "Runtime JavaScript côté serveur"
    },
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web"
    }
  }
}
```

**Exemple d'erreur (404) - Compétence non trouvée :**
```json
{
  "statut": "error",
  "message": "Compétence non trouvée",
  "data": null
}
```

**Exemple d'erreur (409) - Relation déjà existante :**
```json
{
  "statut": "error",
  "message": "Cette compétence est déjà associée à ce référentiel",
  "data": null
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

pm.test("Response contains relation data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("referentielId");
    pm.expect(jsonData.data).to.have.property("competenceId");
    pm.expect(jsonData.data).to.have.property("competence");
});
```

---

### 3. DELETE /api/referentiels/:id/competences/:competenceId
**Description :** Supprime une compétence d'un référentiel

**Méthode :** DELETE
**URL :** `{{base_url}}/api/referentiels/1/competences/3`

**Paramètres URL :**
- `id` (number) : ID du référentiel
- `competenceId` (number) : ID de la compétence à supprimer

**Headers :**
```
Content-Type: application/json
```

**Exemple de réponse (200) :**
```json
{
  "statut": "success",
  "message": "Compétence supprimée du référentiel avec succès",
  "data": {
    "referentiel": {
      "id": 1,
      "nom": "Référentiel Développement Web"
    },
    "competence": {
      "id": 3,
      "nom": "Node.js"
    },
    "referentielCompetenceId": 1
  }
}
```

**Exemple d'erreur (404) - Relation non trouvée :**
```json
{
  "statut": "error",
  "message": "Relation référentiel-compétence non trouvée",
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

pm.test("Response contains deleted relation info", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.property("referentiel");
    pm.expect(jsonData.data).to.have.property("competence");
});
```

---

## Variables d'environnement Postman

Créer les variables suivantes dans votre environnement Postman :

```
base_url = http://localhost:3000
referentiel_id = 1
competence_id = 1
```

## Collection Postman

### Structure recommandée :
```
📁 Référentiels - Compétences
├── 📄 GET - Liste des compétences d'un référentiel
├── 📄 POST - Ajouter compétence au référentiel
└── 📄 DELETE - Supprimer compétence du référentiel
```

## Scénarios de test

### Scénario 1 : Gestion complète des compétences
1. **GET** `/api/referentiels/1/competences` - Voir compétences actuelles
2. **POST** `/api/referentiels/1/competences` - Ajouter une nouvelle compétence
3. **GET** `/api/referentiels/1/competences` - Vérifier ajout
4. **DELETE** `/api/referentiels/1/competences/{competenceId}` - Supprimer la compétence
5. **GET** `/api/referentiels/1/competences` - Vérifier suppression

### Scénario 2 : Gestion d'erreurs
1. Tester avec un ID de référentiel inexistant
2. Tester avec un ID de compétence inexistant
3. Tester l'ajout d'une compétence déjà associée
4. Tester la suppression d'une relation inexistante

## Codes d'erreur courants

- **400** : Données de validation invalides (IDs non numériques)
- **404** : Référentiel ou compétence non trouvé(e)
- **409** : Relation déjà existante
- **500** : Erreur serveur interne

## Structure des données

### Relation Référentiel-Compétence
```json
{
  "id": "number",
  "referentielId": "number",
  "competenceId": "number",
  "competence": {
    "id": "number",
    "nom": "string",
    "description": "string"
  },
  "referentiel": {
    "id": "number",
    "nom": "string"
  }
}
```

### Liste des compétences d'un référentiel
```json
{
  "referentiel": {
    "id": "number",
    "nom": "string"
  },
  "competences": [
    {
      "id": "number",
      "nom": "string",
      "description": "string",
      "referentielCompetenceId": "number"
    }
  ],
  "count": "number"
}
```

## Prérequis

Assurez-vous d'avoir :
1. Un référentiel existant (ID valide)
2. Des compétences existantes (IDs valides)
3. Le serveur API en cours d'exécution sur le port 3000

## Troubleshooting

### Erreur 404 sur tous les endpoints
- Vérifier que les routes de compétence sont activées dans `app.ts`
- Vérifier que le serveur redémarre après les modifications

### Erreur de compilation TypeScript
- Les routes de compétence peuvent avoir des problèmes d'import
- Utiliser `require()` au lieu d'`import` dans `app.ts`

### Données de test
- Utiliser les IDs existants dans votre base de données
- Vérifier les relations existantes avant les tests
