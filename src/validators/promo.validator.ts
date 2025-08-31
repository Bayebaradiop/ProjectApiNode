import { z } from 'zod';

// Schema pour valider l'ID de la promo dans les paramètres
export const promoIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID de la promo doit être un nombre')
      .transform(val => parseInt(val)),
  }),
});

// Schema pour ajouter un formateur à une promo
export const addFormateurSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID de la promo doit être un nombre')
      .transform(val => parseInt(val)),
  }),
  body: z.object({
    userId: z.number()
      .int('L\'ID de l\'utilisateur doit être un entier')
      .positive('L\'ID de l\'utilisateur doit être positif'),
  }),
});

// Schema pour supprimer un formateur d'une promo
export const removeFormateurSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID de la promo doit être un nombre')
      .transform(val => parseInt(val)),
    userId: z.string()
      .regex(/^\d+$/, 'L\'ID de l\'utilisateur doit être un nombre')
      .transform(val => parseInt(val)),
  }),
});

// Types dérivés des schémas
export type PromoIdParams = z.infer<typeof promoIdSchema>['params'];
export type AddFormateurInput = z.infer<typeof addFormateurSchema>['body'];
export type RemoveFormateurParams = z.infer<typeof removeFormateurSchema>['params'];