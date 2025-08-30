import { z } from 'zod';

// Validateur pour Referentiel
export const referentielSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom du référentiel est requis')
    .max(100, 'Le nom du référentiel ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Le nom du référentiel ne peut contenir que des lettres, espaces et tirets'),

  description: z.string()
    .max(500, 'La description ne peut pas dépasser 500 caractères')
    .optional()
});

export const referentielUpdateSchema = referentielSchema.partial();

// Type pour TypeScript
export type ReferentielInput = z.infer<typeof referentielSchema>;
export type ReferentielUpdateInput = z.infer<typeof referentielUpdateSchema>;
