import { z } from 'zod';

// Pour POST /referentiels/:id/competences
export const addCompetenceSchema = z.object({
  competenceId: z.number().int().positive({
    message: "L'ID de la compétence doit être un entier positif"
  })
});


// Pour valider uniquement l'ID du référentiel
export const referentielIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, "L'ID du référentiel doit être un nombre entier")
      .transform(Number)
  })
});


// Pour valider les deux IDs
export const referentielCompetenceIdsSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, "L'ID du référentiel doit être un nombre entier")
      .transform(Number),
    competenceId: z.string()
      .regex(/^\d+$/, "L'ID de la compétence doit être un nombre entier")
      .transform(Number)
  })
});


// Pour PUT /referentiels/:id/competences/:competenceId
export const updateCompetenceRelationSchema = z.object({
  body: z.object({
    competenceId: z.number().int().positive({
      message: "L'ID de la compétence doit être un entier positif"
    })
  })
});
