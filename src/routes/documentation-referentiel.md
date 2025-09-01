1️⃣ Lister tous les référentiels

GET /api/referentiels

Réponse : 200 + liste complète des référentiels avec leurs compétences, utilisateurs et promos

Erreur : 500 si problème serveur

2️⃣ Récupérer un référentiel par ID

GET /api/referentiels/:id

Params : id = ID du référentiel

Réponse : 200 + référentiel avec ses relations

Erreurs : 404 si introuvable, 400 si validation invalide

3️⃣ Créer un nouveau référentiel

POST /api/referentiels

Body : { "nom": string, "description": string (optionnel) }

Réponse : 201 + objet créé

Erreurs : 400 si validation invalide, 409 si nom déjà existant

4️⃣ Mettre à jour un référentiel

PUT /api/referentiels/:id

Params : id = ID du référentiel

Body : { "nom": string (optionnel), "description": string (optionnel) }

Réponse : 200 + objet mis à jour

Erreurs : 400 si validation invalide, 404 si référentiel introuvable, 409 si conflit de nom

5️⃣ Supprimer un référentiel

DELETE /api/referentiels/:id

Params : id = ID du référentiel

Action : supprime le référentiel + toutes les relations avec compétences, promos et déconnecte les utilisateurs

Réponse : 200 OK

Erreurs : 404 si introuvable, 500 si échec serveur