import { Request, Response } from 'express';
import { addNiveauToCompetenceSchema } from '../validators/competence.validator';
import { CompetenceNiveauService } from '../services/competence-niveau.service';
import { handleValidationError } from '../utils/validation.utils';

// GET /competences/:id/niveaux - Récupérer les niveaux d'une compétence
export const getNiveauxByCompetence = async (req: Request, res: Response) => {
  try {
    const competenceId = parseInt(req.params.id);

    if (isNaN(competenceId)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
    }

    try {
      const formattedData = await CompetenceNiveauService.getNiveauxByCompetence(competenceId);

      res.status(200).json({
        statut: "success",
        message: "Niveaux de la compétence récupérés avec succès",
        data: formattedData,
      });
    } catch (error: any) {
      if (error.message === 'Compétence non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des niveaux de compétence:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des niveaux de compétence",
      data: null,
    });
  }
};

// POST /competences/:id/niveaux - Ajouter un niveau à une compétence
export const addNiveauToCompetence = async (req: Request, res: Response) => {
  try {
    const competenceId = parseInt(req.params.id);

    if (isNaN(competenceId)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
    }

    // Validation des données d'entrée
    const validationResult = addNiveauToCompetenceSchema.safeParse(req.body);
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

    const { niveauId } = validationResult.data;

    try {
      const result = await CompetenceNiveauService.addNiveauToCompetence(competenceId, niveauId);

      res.status(201).json({
        statut: "success",
        message: "Niveau ajouté à la compétence avec succès",
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Compétence non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Niveau non trouvé') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Cette compétence est déjà associée à ce niveau') {
        return res.status(409).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Erreur lors de l\'ajout du niveau à la compétence:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée à ce niveau",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de l'ajout du niveau à la compétence",
      data: null,
    });
  }
};


// PUT /competences/:competenceId/niveaux/:niveauId - Modifier la relation compétence-niveau
export const updateCompetenceNiveau = async (req: Request, res: Response) => {
  try {
    const competenceId = parseInt(req.params.competenceId);
    const niveauId = parseInt(req.params.niveauId);

    if (isNaN(competenceId) || isNaN(niveauId)) {
      return res.status(400).json({
        statut: "error",
        message: "IDs invalides",
        data: null,
      });
    }
    // Validation des données d'entrée
    const validationResult = addNiveauToCompetenceSchema.safeParse(req.body);
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

    const { niveauId: newNiveauId } = validationResult.data;

    try {
      const result = await CompetenceNiveauService.updateCompetenceNiveau(competenceId, niveauId, newNiveauId);

      res.status(200).json({
        statut: "success",
        message: "Relation compétence-niveau mise à jour avec succès",
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Relation compétence-niveau non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Nouveau niveau non trouvé') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Cette compétence est déjà associée au nouveau niveau') {
        return res.status(409).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la relation compétence-niveau:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée au nouveau niveau",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour de la relation compétence-niveau",
      data: null,
    });
  }
};

// DELETE /competences/:competenceId/niveaux/:niveauId - Supprimer un niveau d'une compétence
export const removeNiveauFromCompetence = async (req: Request, res: Response) => {
  try {
    const competenceId = parseInt(req.params.competenceId);
    const niveauId = parseInt(req.params.niveauId);

    if (isNaN(competenceId) || isNaN(niveauId)) {
      return res.status(400).json({
        statut: "error",
        message: "IDs invalides",
        data: null,
      });
    }

    try {
      const result = await CompetenceNiveauService.removeNiveauFromCompetence(competenceId, niveauId);

      res.status(200).json({
        statut: "success",
        message: "Niveau supprimé de la compétence avec succès",
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'Relation compétence-niveau non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Erreur lors de la suppression du niveau de la compétence:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du niveau de la compétence",
      data: null,
    });
  }
};
