Parfait, faisons un résumé clair et simple de la création d’un référentiel avec au moins une compétence en Node.js / Prisma, étape par étape, avec des exemples concrets.

1️⃣ Concept

Un référentiel peut contenir plusieurs compétences.

On peut décider :

Optionnel : créer un référentiel vide, ajouter des compétences plus tard.

Obligatoire : il faut au moins une compétence à la création.

2️⃣ Structure attendue du body

Quand tu crées un référentiel, le front-end doit envoyer quelque chose comme :

{
  "nom": "Développement web",
  "description": "Formation complète",
  "competences": [
    { "nom": "HTML" },
    { "nom": "CSS", "description": "Stylisation des pages" }
  ]
}


nom → nom du référentiel

description → description du référentiel

competences → tableau d’objets { nom, description? }

3️⃣ Vérification (validation)

Avant de créer dans la base, on vérifie :

Que le body est valide (Zod ou autre validation).

Que le tableau de compétences n’est pas vide.

Exemple simple en JS :

if (!competences || competences.length === 0) {
  return res.status(400).json({
    statut: "error",
    message: "Le référentiel doit contenir au moins une compétence",
  });
}

4️⃣ Création avec Prisma

Pour créer référentiel + compétences en même temps :

const newReferentiel = await prisma.referentiel.create({
  data: {
    nom,
    description,
    competences: {
      create: competences.map(c => ({
        nom: c.nom,
        description: c.description || ""
      }))
    }
  },
  include: { competences: true } // pour renvoyer aussi les compétences
});

Explication :

competences.create → crée les compétences liées automatiquement.

map → transforme le tableau pour que Prisma comprenne le format attendu.

description || "" → si pas de description, on met vide.

5️⃣ Exemple concret
Body envoyé :
{
  "nom": "Développement web",
  "description": "Formation complète",
  "competences": [
    { "nom": "HTML" },
    { "nom": "CSS", "description": "Stylisation" }
  ]
}

Résultat dans la base :

Référentiel :

id	nom	description
1	Développement web	Formation complète

Compétences liées :

id	nom	description	referentielId
1	HTML		1
2	CSS	Stylisation	1