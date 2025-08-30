import { z } from 'zod';

// Validateur pour Profile
export const profileSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom du profil est requis')
    .max(100, 'Le nom du profil ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Le nom du profil ne peut contenir que des lettres et espaces')
});

export const profileUpdateSchema = profileSchema.partial();

// Type pour TypeScript
export type ProfileInput = z.infer<typeof profileSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
