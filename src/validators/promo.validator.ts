import { z } from 'zod';

// Validateur pour Promo
export const promoSchema = z.object({
  nom: z.string()
    .min(1, 'Le nom de la promo est requis')
    .max(100, 'Le nom de la promo ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-Z0-9À-ÿ\s\-]+$/, 'Le nom de la promo ne peut contenir que des lettres, chiffres, espaces et tirets'),

  dateDebut: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Format de date de début invalide')
    .refine((date) => new Date(date) >= new Date(), 'La date de début doit être dans le futur'),

  dateFin: z.string()
    .refine((date) => !isNaN(Date.parse(date)), 'Format de date de fin invalide'),

  referentielId: z.number()
    .int('L\'ID du référentiel doit être un entier')
    .positive('L\'ID du référentiel doit être positif')
    .optional()
}).refine((data) => {
  if (data.dateDebut && data.dateFin) {
    return new Date(data.dateFin) > new Date(data.dateDebut);
  }
  return true;
}, {
  message: 'La date de fin doit être postérieure à la date de début',
  path: ['dateFin']
});

export const promoUpdateSchema = promoSchema.partial();

// Type pour TypeScript
export type PromoInput = z.infer<typeof promoSchema>;
export type PromoUpdateInput = z.infer<typeof promoUpdateSchema>;
