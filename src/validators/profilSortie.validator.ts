import { z } from 'zod';

// Schema pour créer un nouveau profil de sortie
export const createProfilSortieSchema = z.object({
  body: z.object({
    nom: z.string()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  }),
});

// Schema pour mettre à jour un profil de sortie
export const updateProfilSortieSchema = z.object({
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

// Schema pour valider l'ID du profil de sortie dans les paramètres
export const profilSortieIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val)),
  }),
});

// Types dérivés des schémas
export type CreateProfilSortieInput = z.infer<typeof createProfilSortieSchema>['body'];
export type UpdateProfilSortieInput = z.infer<typeof updateProfilSortieSchema>['body'];
export type ProfilSortieIdParams = z.infer<typeof profilSortieIdSchema>['params'];