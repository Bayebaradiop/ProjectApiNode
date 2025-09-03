API Tri Dynamique - Tests Postman
Vue d'ensemble

Cette collection Postman contient tous les endpoints pour tester les fonctionnalités de tri des compétences.

Endpoints Disponibles
1. GET /api/competences/sorted

Description : Récupère la liste des compétences triées selon un ou plusieurs critères.

Méthode : GET
URL :

{{base_url}}/api/competences/sorted

Scénario 1 : Tri simple

Query Params :

champ (string) : Champ sur lequel trier (ex : nom, createdAt)

ordre (string) : Ordre du tri (asc ou desc)

Exemple :

{{base_url}}/api/competences/sorted?champ=nom&ordre=asc


Exemple de réponse (200) :

{
  "statut": "success",
  "message": "Compétences triées par nom en ordre ascendant",
  "data": [
    {
      "id": 1,
      "nom": "Algorithmique",
      "description": "Compétence en algorithmique"
    },
    {
      "id": 2,
      "nom": "Base de données",
      "description": "Compétence en SQL"
    }
  ]
}

Scénario 2 : Tri multiple

Query Params :

triMulti (string) : Liste des critères sous forme champ:ordre séparés par des virgules

Exemple :

{{base_url}}/api/competences/sorted?triMulti=nom:asc,createdAt:desc


Exemple de réponse (200) :

{
  "statut": "success",
  "message": "Compétences triées par plusieurs critères",
  "data": [
    {
      "id": 3,
      "nom": "Java",
      "description": "Langage orienté objet",
      "createdAt": "2025-09-02T08:00:00.000Z"
    },
    {
      "id": 4,
      "nom": "Python",
      "description": "Langage polyvalent",
      "createdAt": "2025-09-01T09:00:00.000Z"
    }
  ]
}

Scénario 3 : Cas d'erreur (paramètres invalides)

Exemple :

{{base_url}}/api/competences/sorted?triMulti=invalid:asc,createdAt:desc


Exemple d'erreur (400) :

{
  "statut": "error",
  "message": "Paramètres de tri invalides",
  "data": null
}

Tests Postman :
// Vérifier le statut HTTP
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier que la réponse contient un tableau
pm.test("Response contains data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an("array");
});

// Vérifier le message
pm.test("Response has success status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.statut).to.eql("success");
});

Variables d'environnement Postman
base_url = http://localhost:3000

Codes d'erreur courants

400 : Paramètres de tri invalides

500 : Erreur serveur interne

Structure des données
{
  "id": "number",
  "nom": "string",
  "description": "string (optionnel)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
