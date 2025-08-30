import { z } from 'zod';

// Validateur pour ProfilSortie
export const profilSortieSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom du profil de sortie est requis')
    .max(100, 'Le nom du profil de sortie ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Le nom du profil de sortie ne peut contenir que des lettres et espaces')
});

export const profilSortieUpdateSchema = profilSortieSchema.partial();

// Type pour TypeScript
export type ProfilSortieInput = z.infer<typeof profilSortieSchema>;
export type ProfilSortieUpdateInput = z.infer<typeof profilSortieUpdateSchema>;
