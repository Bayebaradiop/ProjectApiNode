import { z } from 'zod';

// Validateur pour Niveau
export const niveauSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom du niveau est requis')
    .max(50, 'Le nom du niveau ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-Z0-9À-ÿ\s\-]+$/, 'Le nom du niveau ne peut contenir que des lettres, chiffres, espaces et tirets')
});

export const niveauUpdateSchema = niveauSchema.partial();

// Type pour TypeScript
export type NiveauInput = z.infer<typeof niveauSchema>;
export type NiveauUpdateInput = z.infer<typeof niveauUpdateSchema>;
