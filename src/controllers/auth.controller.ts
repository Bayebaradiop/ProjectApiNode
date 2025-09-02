import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, refreshTokenSchema } from '../validators/auth.validator';
import { handleValidationError } from '../utils/validation.utils';

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const validationResult = loginSchema.safeParse({ body: req.body });
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const { email, password } = validationResult.data.body;

    const tokens = await authService.login(email, password);

    if (!tokens) {
      return res.status(401).json({
        statut: "error",
        message: "Email ou mot de passe incorrect",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Connexion réussie",
      data: tokens,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la connexion",
      data: null,
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const validationResult = refreshTokenSchema.safeParse({ body: req.body });
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const { refreshToken } = validationResult.data.body;

    const tokens = await authService.refreshAccessToken(refreshToken);

    if (!tokens) {
      return res.status(401).json({
        statut: "error",
        message: "Refresh token invalide ou expiré",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Tokens renouvelés avec succès",
      data: tokens,
    });
  } catch (error) {
    console.error('Erreur lors du renouvellement du token:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors du renouvellement du token",
      data: null,
    });
  }
};