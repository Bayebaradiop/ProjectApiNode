import { Request, Response } from 'express';
import { promoIdSchema, addFormateurSchema, removeFormateurSchema, PromoIdParams, AddFormateurInput, RemoveFormateurParams } from '../validators/promo.validator';
import { PromoFormateurService } from '../services/promo.formateur.service';
import { handleValidationError } from '../utils/validation.utils';

// GET /promos/:id/formateurs - Récupérer tous les formateurs d'une promo
export const getFormateursByPromo = async (req: Request, res: Response) => {
  try {
    const validationResult = promoIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID promo invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: promoId } = validationResult.data.params;

    try {
      const formateurs = await PromoFormateurService.getFormateursByPromo(promoId);

      res.status(200).json({
        statut: "success",
        message: "Formateurs de la promo récupérés avec succès",
        data: formateurs,
      });
    } catch (error: any) {
      if (error.message === 'Promo non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des formateurs:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des formateurs",
      data: null,
    });
  }
};

// POST /promos/:id/formateurs - Ajouter un formateur à une promo
export const addFormateurToPromo = async (req: Request, res: Response) => {
  try {
    const validationResult = addFormateurSchema.safeParse({
      params: req.params,
      body: req.body
    });

    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "Données de validation invalides",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: promoId } = validationResult.data.params;
    const { userId } = validationResult.data.body;

    try {
      const result = await PromoFormateurService.addFormateurToPromo(promoId, userId);

      res.status(201).json({
        statut: "success",
        message: "Formateur ajouté à la promo avec succès",
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Promo non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Utilisateur non trouvé') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Cet utilisateur est déjà formateur de cette promo') {
        return res.status(409).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du formateur:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de l'ajout du formateur",
      data: null,
    });
  }
};

// DELETE /promos/:id/formateurs/:userId - Supprimer un formateur d'une promo
export const removeFormateurFromPromo = async (req: Request, res: Response) => {
  try {
    const validationResult = removeFormateurSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "Paramètres invalides",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: promoId, userId } = validationResult.data.params;

    try {
      const result = await PromoFormateurService.removeFormateurFromPromo(promoId, userId);

      res.status(200).json({
        statut: "success",
        message: "Formateur supprimé de la promo avec succès",
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Ce formateur n\'est pas associé à cette promo') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du formateur:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du formateur",
      data: null,
    });
  }
};