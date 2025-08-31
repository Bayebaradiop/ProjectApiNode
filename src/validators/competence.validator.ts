import { z } from 'zod';
import { errorMessages, createStringSchema } from './error-messages';

// Validateur pour l'ID de compétence
export const competenceIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, errorMessages.invalidFormat('ID'))
    .transform(val => parseInt(val))
    .refine(val => val > 0, errorMessages.positiveNumber('ID'))
});

export type CompetenceIdParams = z.infer<typeof competenceIdSchema>;

// Validateur pour ajouter un niveau à une compétence
export const addNiveauToCompetenceSchema = z.object({
  niveauId: z.number()
    .int(errorMessages.integerRequired('niveauId'))
    .positive(errorMessages.positiveNumber('niveauId'))
});

export type AddNiveauToCompetenceInput = z.infer<typeof addNiveauToCompetenceSchema>;

// Validateur pour les paramètres compétence + niveau
export const competenceNiveauParamsSchema = z.object({
  competenceId: z.string()
    .regex(/^\d+$/, errorMessages.invalidFormat('competenceId'))
    .transform(val => parseInt(val))
    .refine(val => val > 0, errorMessages.positiveNumber('competenceId')),
  niveauId: z.string()
    .regex(/^\d+$/, errorMessages.invalidFormat('niveauId'))
    .transform(val => parseInt(val))
    .refine(val => val > 0, errorMessages.positiveNumber('niveauId'))
});

export type CompetenceNiveauParams = z.infer<typeof competenceNiveauParamsSchema>;

// Validateur pour Competence
export const competenceSchema = z.object({
  nom: createStringSchema('nom', {
    min: 1,
    max: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s\-]+$/,
    patternMessage: errorMessages.nom.invalidFormat
  }),

  description: z.string()
    .max(500, errorMessages.description.tooLong)
    .optional()
});

export const competenceUpdateSchema = competenceSchema.partial();

// Type pour TypeScript
export type CompetenceInput = z.infer<typeof competenceSchema>;
export type CompetenceUpdateInput = z.infer<typeof competenceUpdateSchema>;
