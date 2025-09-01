import { Request, Response } from 'express';
import { NiveauService } from '../services/niveau.service';
import { niveauSchema, niveauUpdateSchema, NiveauInput, NiveauUpdateInput } from '../validators/niveau.validator';
import { handleValidationError } from '../utils/validation.utils';

const niveauService = new NiveauService();

// GET /niveaux - Récupérer tous les niveaux
export const getAllNiveaux = async (req: Request, res: Response) => {
  try {
    const niveaux = await niveauService.getAllNiveaux();

    res.status(200).json({
      statut: "success",
      message: "Liste des niveaux récupérée avec succès",
      data: niveaux,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des niveaux:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des niveaux",
      data: null,
    });
  }
};

// GET /niveaux/:id - Récupérer un niveau par ID
export const getNiveauById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        statut: "error",
        message: "Erreurs de validation détectées",
        data: null,
        errors: [{
          field: "params.id",
          message: "L'ID doit être un nombre valide",
          code: "VALIDATION_ERROR",
        }],
        summary: ["params.id: L'ID doit être un nombre valide"],
        totalErrors: 1,
      });
    }

    const niveau = await niveauService.getNiveauById(id);

    if (!niveau) {
      return res.status(404).json({
        statut: "error",
        message: "Niveau non trouvé",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Niveau récupéré avec succès",
      data: niveau,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du niveau:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération du niveau",
      data: null,
    });
  }
};

// POST /niveaux - Créer un nouveau niveau
export const createNiveau = async (req: Request, res: Response) => {
  try {
    // Validation des données d'entrée
    const validationResult = niveauSchema.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const niveauData: NiveauInput = validationResult.data;

    const niveau = await niveauService.createNiveau(niveauData);

    res.status(201).json({
      statut: "success",
      message: "Niveau créé avec succès",
      data: niveau,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du niveau:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un niveau avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création du niveau",
      data: null,
    });
  }
};

// PUT /niveaux/:id - Mettre à jour un niveau
export const updateNiveau = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de niveau invalide",
        data: null,
      });
    }

    // Validation des données d'entrée
    const validationResult = niveauUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const niveauData: NiveauUpdateInput = validationResult.data;

    const niveau = await niveauService.updateNiveau(id, niveauData);

    res.status(200).json({
      statut: "success",
      message: "Niveau mis à jour avec succès",
      data: niveau,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du niveau:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        statut: "error",
        message: "Niveau non trouvé",
        data: null,
      });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un niveau avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour du niveau",
      data: null,
    });
  }
};

// DELETE /niveaux/:id - Supprimer un niveau
export const deleteNiveau = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de niveau invalide",
        data: null,
      });
    }

    await niveauService.deleteNiveau(id);

    res.status(200).json({
      statut: "success",
      message: "Niveau supprimé avec succès",
      data: null,
    });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du niveau:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        statut: "error",
        message: "Niveau non trouvé",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du niveau",
      data: null,
    });
  }
};
