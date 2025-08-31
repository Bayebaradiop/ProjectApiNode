import { z } from 'zod';

export const addCompetenceSchema = z.object({
  competenceId: z.number().int().positive({
    message: "L'ID de la compétence doit être un entier positif"
  })
});

export const createReferentielSchema = z.object({
  body: z.object({
    nom: z.string().min(3),
    description: z.string().optional(),
  }),
});

export const updateReferentielSchema = z.object({
  params: z.object({ id: z.number() }),
  body: z.object({
    nom: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const referentielIdSchema = z.object({
   params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val))
  }),
});
