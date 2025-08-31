import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { competenceSchema, competenceUpdateSchema, CompetenceInput, CompetenceUpdateInput } from '../validators/competence.validator';

const prisma = new PrismaClient();

// GET /competences - Récupérer toutes les compétences
export const getAllCompetences = async (req: Request, res: Response) => {
  try {
    const competences = await prisma.competence.findMany({
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });

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

    const competence = await prisma.competence.findUnique({
      where: { id },
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });

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

    const competenceData: CompetenceInput = validationResult.data;

    const competence = await prisma.competence.create({
      data: competenceData,
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });

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

    const competenceData: CompetenceUpdateInput = validationResult.data;

    const competence = await prisma.competence.update({
      where: { id },
      data: competenceData,
      include: {
        niveaux: {
          include: {
            niveau: true
          }
        },
        referentiels: {
          include: {
            referentiel: true
          }
        }
      }
    });

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

    await prisma.competence.delete({
      where: { id }
    });

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
