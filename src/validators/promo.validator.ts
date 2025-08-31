import {z} from "zod";

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

export const promoIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, "L'ID doit être un nombre")
      .transform((val) => parseInt(val)),
  }),
});

// Types
export type CreatePromoInput = z.infer<typeof createPromoSchema>["body"];
export type UpdatePromoInput = z.infer<typeof updatePromoSchema>["body"];
export type PromoIdParams = z.infer<typeof promoIdSchema>["params"];