import { Response } from 'express';

export const handleValidationError = (error: any, res: Response) => {
  if (error.name === 'ZodError') {
    const errors = error.errors || error.issues || [];

    // Grouper les erreurs par champ pour une meilleure lisibilité
    const fieldErrors: { [key: string]: string[] } = {};

    errors.forEach((err: any) => {
      const field = err.path?.join('.') || 'general';
      if (!fieldErrors[field]) {
        fieldErrors[field] = [];
      }
      fieldErrors[field].push(err.message);
    });

    // Créer un message détaillé
    const errorMessages = Object.entries(fieldErrors).map(([field, messages]) => {
      return `${field}: ${messages.join(', ')}`;
    });

    return res.status(400).json({
      statut: "error",
      message: "Erreurs de validation détectées",
      data: null,
      errors: errors.map((err: any) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message,
        code: err.code || 'VALIDATION_ERROR',
      })),
      summary: errorMessages,
      totalErrors: errors.length,
    });
  }

  // Pour les autres types d'erreurs
  return res.status(400).json({
    statut: "error",
    message: error.message || "Erreur de validation",
    data: null,
    errors: [{
      field: 'general',
      message: error.message || "Erreur inconnue",
      code: 'GENERAL_ERROR',
    }],
    summary: [error.message || "Erreur inconnue"],
    totalErrors: 1,
  });
};

// Fonction utilitaire pour valider et retourner les erreurs formatées
export const validateAndRespond = (schema: any, data: any, res: Response) => {
  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    handleValidationError(validationResult.error, res);
    return null;
  }
  return validationResult.data;
};
