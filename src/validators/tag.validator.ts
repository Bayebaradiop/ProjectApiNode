
import { z } from 'zod';

export const createTagSchema = z.object({
  body: z.object({
    nom: z.string()
      .min(1, 'Le nom du tag est requis')
      .max(50, 'Le nom du tag ne peut pas dépasser 50 caractères')
      .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Le nom du tag ne peut contenir que des lettres, espaces et tirets'),
  }),
});

export const updateTagSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val)),
  }),
  body: z.object({
    nom: z.string()
      .min(1, 'Le nom du tag est requis')
      .max(50, 'Le nom du tag ne peut pas dépasser 50 caractères')
      .regex(/^[a-zA-ZÀ-ÿ\s\-]+$/, 'Le nom du tag ne peut contenir que des lettres, espaces et tirets')
      .optional(),
  }),
});

export const tagIdSchema = z.object({
  params: z.object({
    id: z.string()
      .regex(/^\d+$/, 'L\'ID doit être un nombre')
      .transform(val => parseInt(val)),
  }),
});

export type CreateTagInput = z.infer<typeof createTagSchema>["body"];
export type UpdateTagInput = z.infer<typeof updateTagSchema>["body"];
export type TagIdParams = z.infer<typeof tagIdSchema>["params"];

