import { z } from 'zod';

// Schema pour créer un nouvel utilisateur
export const createUserSchema = z.object({
  body: z.object({
    nom: z.string()
      .min(1, 'Le nom est requis')
      .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    prenom: z.string()
      .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
      .optional(),
    email: z.string()
      .email('Format d\'email invalide')
      .min(1, 'L\'email est requis'),
    telephone: z.string()
      .regex(/^(\+221|0)[0-9]{9}$/, 'Format de téléphone invalide (ex: +221771234567 ou 0771234567)')
      .optional(),
    password: z.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères'),
    profileId: z.number()
      .int('L\'ID du profil doit être un entier')
      .positive('L\'ID du profil doit être positif'),
    profilSortieId: z.number()
      .int('L\'ID du profil de sortie doit être un entier')
      .positive('L\'ID du profil de sortie doit être positif')
      .optional(),
    referentielId: z.number()
      .int('L\'ID du référentiel doit être un entier')
      .positive('L\'ID du référentiel doit être positif')
      .optional(),
  }),
});

// Schema pour mettre à jour un utilisateur
export const updateUserSchema = z.object({
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
    prenom: z.string()
      .max(100, 'Le prénom ne peut pas dépasser 100 caractères')
      .optional(),
    email: z.string()
      .email('Format d\'email invalide')
      .optional(),
    telephone: z.string()
      .regex(/^(\+221|0)[0-9]{9}$/, 'Format de téléphone invalide (ex: +221771234567 ou 0771234567)')
      .optional(),
    password: z.string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
      .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
      .optional(),
    profileId: z.number()
      .int('L\'ID du profil doit être un entier')
      .positive('L\'ID du profil doit être positif')
      .optional(),
    profilSortieId: z.number()
      .int('L\'ID du profil de sortie doit être un entier')
      .positive('L\'ID du profil de sortie doit être positif')
      .nullable()
      .optional(),
    referentielId: z.number()
      .int('L\'ID du référentiel doit être un entier')
      .positive('L\'ID du référentiel doit être positif')
      .nullable()
      .optional(),
  }),
});

// Schema pour valider l'ID utilisateur dans les paramètres
export const userIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val)),
  }),
});

// Types dérivés des schémas
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type UserIdParams = z.infer<typeof userIdSchema>['params'];
