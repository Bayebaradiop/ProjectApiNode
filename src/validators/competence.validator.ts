import { z } from 'zod';
import { errorMessages, createStringSchema } from './error-messages';

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
