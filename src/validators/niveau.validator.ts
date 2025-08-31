import { z } from 'zod';
import { errorMessages, createStringSchema } from './error-messages';

// Validateur pour l'ID de niveau
export const niveauIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, errorMessages.invalidFormat('ID'))
    .transform(val => parseInt(val))
    .refine(val => val > 0, errorMessages.positiveNumber('ID'))
});

export type NiveauIdParams = z.infer<typeof niveauIdSchema>;

// Validateur pour Niveau
export const niveauSchema = z.object({
  nom: createStringSchema('nom', {
    min: 1,
    max: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s\-]+$/,
    patternMessage: errorMessages.nom.invalidFormat
  })
});

export const niveauUpdateSchema = niveauSchema.partial();

// Type pour TypeScript
export type NiveauInput = z.infer<typeof niveauSchema>;
export type NiveauUpdateInput = z.infer<typeof niveauUpdateSchema>;
