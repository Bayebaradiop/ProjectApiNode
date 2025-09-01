import { z } from 'zod';

// Schema pour créer une promo
export const createPromoSchema = z.object({
  body: z.object({
    nom: z.string().min(1, "Le nom est requis").max(100, "Le nom ne peut pas dépasser 100 caractères"),
    dateDebut: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La date de début doit être une date valide"
    }),
    dateFin: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La date de fin doit être une date valide"
    }),
  }).refine((data) => new Date(data.dateFin) > new Date(data.dateDebut), {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["dateFin"]
  }),
});

// Schema pour mettre à jour une promo
export const updatePromoSchema = z.object({
  params: z.object({
    id: z.string()
    .regex(/^\d+$/, "L'ID doit être un nombre")
    .transform((val) => parseInt(val)),
  }),
  body: z.object({
    nom: z.string()
      .min(1, "Le nom est requis")
      .max(100, "Le nom ne peut pas dépasser 100 caractères")
      .optional(),
    dateDebut: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La date de début doit être une date valide",
    }).optional(),
    dateFin: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "La date de fin doit être une date valide",
    }).optional(),
  }).refine((data) => {
    if (data.dateDebut && data.dateFin) {
      return new Date(data.dateFin) > new Date(data.dateDebut);
    }
    return true; // si un seul champ est mis à jour, on ne contrôle pas
  }, {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["dateFin"],
  }),
});

// Schema pour valider l'ID de la promo dans les paramètres
export const promoIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, "L'ID doit être un nombre")
      .transform((val) => parseInt(val)),
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
export type CreatePromoInput = z.infer<typeof createPromoSchema>["body"];
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>["body"];
export type PromoIdParams = z.infer<typeof promoIdSchema>["params"];
export type AddFormateurInput = z.infer<typeof addFormateurSchema>['body'];
export type RemoveFormateurParams = z.infer<typeof removeFormateurSchema>['params'];
