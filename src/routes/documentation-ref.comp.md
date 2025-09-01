API Référentiels – Résumé

Base URL : /api/referentiels

1️⃣ Ajouter une compétence

POST /api/referentiels/:id/competences

Params : id = référentiel

Body : { "competenceId": number }

Réponse : 201 Created + objet relation créée

Erreurs : 404 (référentiel/compétence introuvable), 409 (déjà liée), 400 (validation)

2️⃣ Lister les compétences d’un référentiel

GET /api/referentiels/:id/competences

Params : id = référentiel

Réponse : 200 OK + liste des compétences

Erreur : 404 si référentiel introuvable

3️⃣ Récupérer une compétence spécifique

GET /api/referentiels/:id/competences/:competenceId

Params : id = référentiel, competenceId = compétence

Réponse : 200 OK + relation

Erreur : 404 si relation introuvable

4️⃣ Supprimer une compétence

DELETE /api/referentiels/:id/competences/:competenceId

Params : id = compétence

Action : supprime la compétence et toutes ses relations

Réponse : 200 OK

Erreur : 500 si échec

5️⃣ Mettre à jour une relation compétence/référentiel

PUT /api/referentiels/:id/competences/:competenceId

Params : id = référentiel, competenceId = compétence actuelle

Body : { "competenceId": nouveauId }

Réponse : 200 OK + nouvelle relation

Erreur : 404 si relation introuvable, 500 si erreur interne