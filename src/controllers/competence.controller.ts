import { Request, Response } from 'express';
import { CompetenceService } from '../services/competence.service';
import { competenceSchema, competenceUpdateSchema, CompetenceInput, CompetenceUpdateInput } from '../validators/competence.validator';
import { handleValidationError } from '../utils/validation.utils';

const competenceService = new CompetenceService();


/** Liste toutes les compétences triées */
export const getAllCompetencesTriees = async (req: Request, res: Response) => {
  try {
    // Récupération des paramètres de tri depuis l'URL
    const champ = req.query.champ as string;           // tri simple : ?champ=nom
    const ordre = req.query.ordre as string;           // asc ou desc : ?ordre=asc
    const triMulti = req.query.triMulti as string;    // tri multi-colonnes : ?triMulti=nom:asc,createdAt:desc

    const competences = await competenceService.getAllCompetencesTriees(champ, ordre, triMulti);

    res.status(200).json({
      statut: 'success',
      message: 'Liste des compétences triée avec succès',
      data: competences
    });
  } catch (error: any) {
    console.error('Erreur lors du tri des compétences:', error);
    res.status(500).json({
      statut: 'error',
      message: 'Erreur lors du tri des compétences',
      data: null
    });
  }
};

// GET /competences - Récupérer toutes les compétences
export const getAllCompetences = async (req: Request, res: Response) => {
  try {
    const competences = await competenceService.getAllCompetences();

    res.status(200).json({
      statut: "success",
      message: "Liste des compétences récupérée avec succès",
      data: competences,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des compétences:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des compétences",
      data: null,
    });
  }
};

// GET /competences/:id - Récupérer une compétence par ID
export const getCompetenceById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
    }

    const competence = await competenceService.getCompetenceById(id);

    if (!competence) {
      return res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Compétence récupérée avec succès",
      data: competence,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération de la compétence",
      data: null,
    });
  }
};

// POST /competences - Créer une nouvelle compétence
export const createCompetence = async (req: Request, res: Response) => {
  try {
    // Validation des données d'entrée
    const validationResult = competenceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const competenceData: CompetenceInput = validationResult.data;

    const competence = await competenceService.createCompetence(competenceData);

    res.status(201).json({
      statut: "success",
      message: "Compétence créée avec succès",
      data: competence,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de la compétence:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Une compétence avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création de la compétence",
      data: null,
    });
  }
};

// PUT /competences/:id - Mettre à jour une compétence
export const updateCompetence = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
    }

    // Validation des données d'entrée
    const validationResult = competenceUpdateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const competenceData: CompetenceUpdateInput = validationResult.data;

    const competence = await competenceService.updateCompetence(id, competenceData);

    res.status(200).json({
      statut: "success",
      message: "Compétence mise à jour avec succès",
      data: competence,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Une compétence avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour de la compétence",
      data: null,
    });
  }
};

// DELETE /competences/:id - Supprimer une compétence
export const deleteCompetence = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
    }

    await competenceService.deleteCompetence(id);

    res.status(200).json({
      statut: "success",
      message: "Compétence supprimée avec succès",
      data: null,
    });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la compétence:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression de la compétence",
      data: null,
    });
  }
};
