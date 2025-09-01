import { z } from 'zod';

// Schema pour créer un nouveau profil
export const createProfileSchema = z.object({
  body: z.object({
    nom: z.string()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  }),
});

// Schema pour mettre à jour un profil
export const updateProfileSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val)),
  }),
  body: z.object({
    nom: z.string()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères')
      .optional(),
  }),
});

// Schema pour valider l'ID profil dans les paramètres
export const profileIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val)),
  }),
});

// Types dérivés des schémas
export type CreateProfileInput = z.infer<typeof createProfileSchema>['body'];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
export type ProfileIdParams = z.infer<typeof profileIdSchema>['params'];