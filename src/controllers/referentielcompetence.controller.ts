import { Request, Response } from 'express';
import { ReferentielCompetenceService } from '../services/referentielcompetence.service';
import { handleValidationError } from '../utils/validation.utils';
import { getPaginationParams } from '../utils/pagination.utils';


const referentielCompetenceService = new ReferentielCompetenceService();

// GET /referentiels-competences - Récupérer toutes les associations
export const getAllReferentielCompetences = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = getPaginationParams(req);
    const associations = await referentielCompetenceService.getAllReferentielCompetences({ page, pageSize });
    res.status(200).json({
      statut: "success",
      message: "Liste des associations référentiel-compétence récupérée avec succès",
      data: associations,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des associations:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des associations",
      data: null,
    });
  }
};

// GET /referentiels-competences/:referentielId/:competenceId - Récupérer une association par ID
export const getReferentielCompetenceById = async (req: Request, res: Response) => {
  try {
    const referentielId = parseInt(req.params.referentielId);
    const competenceId = parseInt(req.params.competenceId);

    if (isNaN(referentielId) || isNaN(competenceId)) {
      const errors = [];
      if (isNaN(referentielId)) errors.push("params.referentielId: L'ID du référentiel doit être un nombre valide");
      if (isNaN(competenceId)) errors.push("params.competenceId: L'ID de la compétence doit être un nombre valide");

      return res.status(400).json({
        statut: "error",
        message: "Erreurs de validation détectées",
        data: null,
        errors: errors.map((msg, index) => ({
          field: msg.split(':')[0],
          message: msg.split(':')[1].trim(),
          code: "VALIDATION_ERROR",
        })),
        summary: errors,
        totalErrors: errors.length,
      });
    }

    try {
      const association = await referentielCompetenceService.getReferentielCompetenceById(referentielId, competenceId);
      res.status(200).json({
        statut: "success",
        message: "Association récupérée avec succès",
        data: association,
      });
    } catch (error: any) {
      if (error.message === 'Association référentiel-compétence non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'association:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération de l'association",
      data: null,
    });
  }
};

// POST /referentiels-competences - Créer une nouvelle association
export const createReferentielCompetence = async (req: Request, res: Response) => {
  try {
    const { referentielId, competenceId } = req.body;

    // Validation basique
    const errors = [];
    if (!referentielId) errors.push("body.referentielId: Le référentielId est requis");
    else if (typeof referentielId !== 'number') errors.push("body.referentielId: Le référentielId doit être un nombre");

    if (!competenceId) errors.push("body.competenceId: Le competenceId est requis");
    else if (typeof competenceId !== 'number') errors.push("body.competenceId: Le competenceId doit être un nombre");

    if (errors.length > 0) {
      return res.status(400).json({
        statut: "error",
        message: "Erreurs de validation détectées",
        data: null,
        errors: errors.map((msg, index) => ({
          field: msg.split(':')[0],
          message: msg.split(':')[1].trim(),
          code: "VALIDATION_ERROR",
        })),
        summary: errors,
        totalErrors: errors.length,
      });
    }

    try {
      const association = await referentielCompetenceService.createReferentielCompetence({
        referentielId,
        competenceId,
      });

      res.status(201).json({
        statut: "success",
        message: "Association créée avec succès",
        data: association,
      });
    } catch (error: any) {
      if (error.message === 'Référentiel non trouvé') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Compétence non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      if (error.message === 'Cette compétence est déjà associée à ce référentiel') {
        return res.status(409).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'association:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création de l'association",
      data: null,
    });
  }
};

// DELETE /referentiels-competences/:referentielId/:competenceId - Supprimer une association
export const deleteReferentielCompetence = async (req: Request, res: Response) => {
  try {
    const referentielId = parseInt(req.params.referentielId);
    const competenceId = parseInt(req.params.competenceId);

    if (isNaN(referentielId) || isNaN(competenceId)) {
      return res.status(400).json({
        statut: "error",
        message: "IDs invalides",
        data: null,
      });
    }

    try {
      const association = await referentielCompetenceService.deleteReferentielCompetence(referentielId, competenceId);
      res.status(200).json({
        statut: "success",
        message: "Association supprimée avec succès",
        data: association,
      });
    } catch (error: any) {
      if (error.message === 'Association référentiel-compétence non trouvée') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'association:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression de l'association",
      data: null,
    });
  }
};

// GET /referentiels/:id/competences - Récupérer toutes les compétences d'un référentiel
export const getCompetencesByReferentiel = async (req: Request, res: Response) => {
  try {
    const referentielId = parseInt(req.params.id);

    if (isNaN(referentielId)) {
      return res.status(400).json({
        statut: "error",
        message: "ID référentiel invalide",
        data: null,
      });
    }

    try {
      const competences = await referentielCompetenceService.getCompetencesByReferentiel(referentielId);
      res.status(200).json({
        statut: "success",
        message: "Compétences du référentiel récupérées avec succès",
        data: competences,
      });
    } catch (error: any) {
      if (error.message === 'Référentiel non trouvé') {
        return res.status(404).json({
          statut: "error",
          message: error.message,
          data: null,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des compétences",
      data: null,
    });
  }
};

// GET /competences/:id/referentiels - Récupérer tous les référentiels d'une compétence
export const getReferentielsByCompetence = async (req: Request, res: Response) => {
  try {
    const competenceId = parseInt(req.params.id);

    if (isNaN(competenceId)) {
      return res.status(400).json({
        statut: "error",
        message: "ID compétence invalide",
        data: null,
      });
    }

    try {
      const referentiels = await referentielCompetenceService.getReferentielsByCompetence(competenceId);
      res.status(200).json({
        statut: "success",
        message: "Référentiels de la compétence récupérés avec succès",
        data: referentiels,
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
    console.error("Erreur lors de la récupération des référentiels:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des référentiels",
      data: null,
    });
  }
};
