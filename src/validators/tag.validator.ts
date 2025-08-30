import { z } from 'zod';

// Validateur pour Tag
export const tagSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom du tag est requis')
    .max(50, 'Le nom du tag ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Le nom du tag ne peut contenir que des lettres, espaces et tirets')
});

export const tagUpdateSchema = tagSchema.partial();

// Type pour TypeScript
export type TagInput = z.infer<typeof tagSchema>;
export type TagUpdateInput = z.infer<typeof tagUpdateSchema>;
