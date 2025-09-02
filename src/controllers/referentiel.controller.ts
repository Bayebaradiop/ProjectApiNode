import { Request, Response } from 'express';
import { ReferentielService } from '../services/referentiel.service';
import { createReferentielSchema, updateReferentielSchema, referentielIdSchema, addCompetenceSchema } from '../validators/referentiel.validator';
import { handleValidationError } from '../utils/validation.utils';

const referentielService = new ReferentielService();

// GET /referentiels - Liste de tous les référentiels
export const getAllReferentiels = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const result = await referentielService.getAllReferentiels({ page, pageSize });
    res.status(200).json({
      statut: "success",
      message: "Liste des référentiels récupérée avec succès",
      ...result,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des référentiels:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des référentiels",
      data: null,
    });
  }
};

// GET /referentiels/:id - Récupérer un référentiel par ID
export const getReferentielById = async (req: Request, res: Response) => {
  try {
    const validationResult = referentielIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id } = validationResult.data.params;

    const referentiel = await referentielService.getReferentielById(id);

    if (!referentiel) {
      return res.status(404).json({
        statut: "error",
        message: "Référentiel non trouvé",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Référentiel récupéré avec succès",
      data: referentiel,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du référentiel:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération du référentiel",
      data: null,
    });
  }
};

// POST /referentiels - Créer un nouveau référentiel
export const createReferentiel = async (req: Request, res: Response) => {
  try {
    const validationResult = createReferentielSchema.safeParse({ body: req.body });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { nom, description } = validationResult.data.body;

    const newReferentiel = await referentielService.createReferentiel({ nom, description });

    res.status(201).json({
      statut: "success",
      message: "Référentiel créé avec succès",
      data: newReferentiel,
    });
  } catch (error: any) {
    console.error("Erreur lors de la création du référentiel:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un référentiel avec ce nom existe déjà",
        data: null,
      });
    }
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création du référentiel",
      data: null,
    });
  }
};

// PUT /referentiels/:id - Mettre à jour un référentiel
export const updateReferentiel = async (req: Request, res: Response) => {
  try {
    const validationResult = updateReferentielSchema.safeParse({
      params: req.params,
      body: req.body
    });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id } = validationResult.data.params;
    const { nom, description } = validationResult.data.body;

    // Vérifier si au moins un champ est fourni pour la mise à jour
    if (nom === undefined && description === undefined) {
      return res.status(400).json({
        statut: "error",
        message: "Au moins un champ (nom ou description) doit être fourni pour la mise à jour",
        data: null,
      });
    }

    const existingReferentiel = await referentielService.getReferentielById(id);
    if (!existingReferentiel) {
      return res.status(404).json({
        statut: "error",
        message: "Référentiel non trouvé",
        data: null,
      });
    }

    // Construire l'objet de mise à jour de manière sécurisée
    const updateData: { nom?: string; description?: string } = {};
    if (nom !== undefined) updateData.nom = nom;
    if (description !== undefined) updateData.description = description;

    const updatedReferentiel = await referentielService.updateReferentiel(id, updateData);

    res.status(200).json({
      statut: "success",
      message: "Référentiel mis à jour avec succès",
      data: updatedReferentiel,
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du référentiel:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un référentiel avec ce nom existe déjà",
        data: null,
      });
    }
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour du référentiel",
      data: null,
    });
  }
};

// DELETE /referentiels/:id - Supprimer un référentiel
export const deleteReferentiel = async (req: Request, res: Response) => {
  try {
    const validationResult = referentielIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id } = validationResult.data.params;

    const existingReferentiel = await referentielService.getReferentielById(id);
    if (!existingReferentiel) {
      return res.status(404).json({
        statut: "error",
        message: "Référentiel non trouvé",
        data: null,
      });
    }

    await referentielService.deleteReferentiel(id);

    res.status(200).json({
      statut: "success",
      message: "Référentiel supprimé avec succès",
      data: null,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du référentiel:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du référentiel",
      data: null,
    });
  }
};

// POST /referentiels/:id/competences - Ajouter une compétence à un référentiel
export const addCompetenceToReferentiel = async (req: Request, res: Response) => {
  try {
    // Validation de l'ID du référentiel
    const validationResult = referentielIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id: referentielId } = validationResult.data.params;

    // Vérifier si le référentiel existe
    const referentiel = await referentielService.getReferentielById(referentielId);

    if (!referentiel) {
      return res.status(404).json({
        statut: "error",
        message: "Référentiel non trouvé",
        data: null
      });
    }

    // Validation du corps de la requête
  const bodyValidationResult = addCompetenceSchema.safeParse(req.body);

if (!bodyValidationResult.success) {
  return handleValidationError(bodyValidationResult.error, res);
}

const { competenceId } = bodyValidationResult.data;

    // Vérifier si la compétence existe
    const competence = await referentielService.checkCompetenceExists(competenceId);

    if (!competence) {
      return res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null
      });
    }

    // Vérifier si la relation existe déjà
    const existingRelation = await referentielService.checkReferentielCompetenceExists(referentielId, competenceId);

    if (existingRelation) {
      return res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée à ce référentiel",
        data: null
      });
    }

    // Créer la relation
    const newRelation = await referentielService.addCompetenceToReferentiel(referentielId, competenceId);

    res.status(201).json({
      statut: "success",
      message: "Compétence ajoutée au référentiel avec succès",
      data: newRelation
    });

  } catch (error: any) {
    console.error("Erreur lors de l'ajout de compétence au référentiel:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée à ce référentiel",
        data: null
      });
    }
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de l'ajout de compétence au référentiel",
      data: null
    });
  }
};
