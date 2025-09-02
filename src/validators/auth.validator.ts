import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token requis'),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];