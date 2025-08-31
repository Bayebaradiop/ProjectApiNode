import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { competenceSchema, competenceUpdateSchema, CompetenceInput, CompetenceUpdateInput } from '../validators/competence.validator';
import { addNiveauToCompetenceSchema, competenceNiveauParamsSchema, AddNiveauToCompetenceInput, CompetenceNiveauParams } from '../validators/competence.validator';

const prisma = new PrismaClient();

const handleValidationError = (error: any, res: Response) => {
  if (error.name === 'ZodError') {
    return res.status(400).json({
      statut: "error",
      message: "Données de validation invalides",
      data: null,
      errors: error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  return false;
};

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

    // Vérifier si la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      return res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
    }

    // Récupérer les niveaux associés à la compétence
    const niveauxData = await prisma.competenceNiveau.findMany({
      where: { competenceId },
      include: {
        niveau: {
          select: {
            id: true,
            nom: true
          }
        }
      },
      orderBy: {
        niveau: {
          nom: 'asc'
        }
      }
    });

    // Formater les données
    const formattedData = {
      competence: {
        id: competence.id,
        nom: competence.nom,
      },
      niveaux: niveauxData.map((item: any) => ({
        id: item.niveau.id,
        nom: item.niveau.nom,
        competenceNiveauId: item.competenceId,
      })),
      count: niveauxData.length,
    };

    res.status(200).json({
      statut: "success",
      message: "Niveaux de la compétence récupérés avec succès",
      data: formattedData,
    });
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

    // Vérifier si la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      return res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
    }

    // Vérifier si le niveau existe
    const niveau = await prisma.niveau.findUnique({
      where: { id: niveauId },
      select: { id: true, nom: true }
    });

    if (!niveau) {
      return res.status(404).json({
        statut: "error",
        message: "Niveau non trouvé",
        data: null,
      });
    }

    // Vérifier si la relation existe déjà
    const existingRelation = await prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    if (existingRelation) {
      return res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée à ce niveau",
        data: null,
      });
    }

    // Créer la relation
    const competenceNiveau = await prisma.competenceNiveau.create({
      data: {
        competenceId,
        niveauId
      },
      include: {
        competence: {
          select: { id: true, nom: true }
        },
        niveau: {
          select: { id: true, nom: true }
        }
      }
    });

    res.status(201).json({
      statut: "success",
      message: "Niveau ajouté à la compétence avec succès",
      data: {
        competence: competenceNiveau.competence,
        niveau: competenceNiveau.niveau,
        competenceNiveauId: competenceNiveau.competenceId
      },
    });
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

    // Vérifier si la relation actuelle existe
    const existingRelation = await prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    if (!existingRelation) {
      return res.status(404).json({
        statut: "error",
        message: "Relation compétence-niveau non trouvée",
        data: null,
      });
    }

    // Vérifier si le nouveau niveau existe
    const newNiveau = await prisma.niveau.findUnique({
      where: { id: newNiveauId },
      select: { id: true, nom: true }
    });

    if (!newNiveau) {
      return res.status(404).json({
        statut: "error",
        message: "Nouveau niveau non trouvé",
        data: null,
      });
    }

    // Vérifier si la nouvelle relation existe déjà
    if (newNiveauId !== niveauId) {
      const newRelationExists = await prisma.competenceNiveau.findUnique({
        where: {
          competenceId_niveauId: {
            competenceId,
            niveauId: newNiveauId
          }
        }
      });

      if (newRelationExists) {
        return res.status(409).json({
          statut: "error",
          message: "Cette compétence est déjà associée au nouveau niveau",
          data: null,
        });
      }
    }

    // Supprimer l'ancienne relation et créer la nouvelle
    await prisma.competenceNiveau.delete({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    const newCompetenceNiveau = await prisma.competenceNiveau.create({
      data: {
        competenceId,
        niveauId: newNiveauId
      },
      include: {
        competence: {
          select: { id: true, nom: true }
        },
        niveau: {
          select: { id: true, nom: true }
        }
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Relation compétence-niveau mise à jour avec succès",
      data: {
        competence: newCompetenceNiveau.competence,
        niveau: newCompetenceNiveau.niveau,
        competenceNiveauId: newCompetenceNiveau.competenceId
      },
    });
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

    // Vérifier si la relation existe
    const existingRelation = await prisma.competenceNiveau.findUnique({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      },
      include: {
        competence: {
          select: { id: true, nom: true }
        },
        niveau: {
          select: { id: true, nom: true }
        }
      }
    });

    if (!existingRelation) {
      return res.status(404).json({
        statut: "error",
        message: "Relation compétence-niveau non trouvée",
        data: null,
      });
    }

    // Supprimer la relation
    await prisma.competenceNiveau.delete({
      where: {
        competenceId_niveauId: {
          competenceId,
          niveauId
        }
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Niveau supprimé de la compétence avec succès",
      data: {
        competence: existingRelation.competence,
        niveau: existingRelation.niveau,
        competenceNiveauId: existingRelation.competenceId
      },
    });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du niveau de la compétence:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du niveau de la compétence",
      data: null,
    });
  }
};
