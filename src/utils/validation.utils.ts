import { Response } from 'express';

export const handleValidationError = (error: any, res: Response) => {
  if (error.name === 'ZodError') {
    return res.status(400).json({
      statut: "error",
      message: "Données de validation invalides",
      data: null,
      errors: error.errors ? error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })) : [],
    });
  }
  return false;
};
