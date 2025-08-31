import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { competenceIdSchema, CompetenceIdParams, addNiveauToCompetenceSchema, competenceNiveauParamsSchema } from '../validators/competence.validator';

const prisma = new PrismaClient();

// GET /api/competences/:id/niveaux - Récupérer les niveaux d'une compétence
export const getNiveauxByCompetence = async (req: Request, res: Response): Promise<void> => {
  try {
    const competenceId = parseInt(req.params.id);

    if (isNaN(competenceId)) {
      res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
      return;
    }

    // Vérifier si la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
      return;
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

// POST /api/competences/:id/niveaux - Ajouter un niveau à une compétence
export const addNiveauToCompetence = async (req: Request, res: Response): Promise<void> => {
  try {
    const competenceId = parseInt(req.params.id);

    if (isNaN(competenceId)) {
      res.status(400).json({
        statut: "error",
        message: "ID de compétence invalide",
        data: null,
      });
      return;
    }

    // Validation des données d'entrée
    const validationResult = addNiveauToCompetenceSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        statut: "error",
        message: "Données de validation invalides",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
    }

    const { niveauId } = validationResult.data;

    // Vérifier si la compétence existe
    const competence = await prisma.competence.findUnique({
      where: { id: competenceId },
      select: { id: true, nom: true }
    });

    if (!competence) {
      res.status(404).json({
        statut: "error",
        message: "Compétence non trouvée",
        data: null,
      });
      return;
    }

    // Vérifier si le niveau existe
    const niveau = await prisma.niveau.findUnique({
      where: { id: niveauId },
      select: { id: true, nom: true }
    });

    if (!niveau) {
      res.status(404).json({
        statut: "error",
        message: "Niveau non trouvé",
        data: null,
      });
      return;
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
      res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée à ce niveau",
        data: null,
      });
      return;
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
      res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée à ce niveau",
        data: null,
      });
      return;
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de l'ajout du niveau à la compétence",
      data: null,
    });
  }
};

// PUT /api/competences/:competenceId/niveaux/:niveauId - Modifier la relation compétence-niveau
export const updateCompetenceNiveau = async (req: Request, res: Response): Promise<void> => {
  try {
    const competenceId = parseInt(req.params.competenceId);
    const niveauId = parseInt(req.params.niveauId);

    if (isNaN(competenceId) || isNaN(niveauId)) {
      res.status(400).json({
        statut: "error",
        message: "IDs invalides",
        data: null,
      });
      return;
    }

    // Validation des données d'entrée
    const validationResult = addNiveauToCompetenceSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        statut: "error",
        message: "Données de validation invalides",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
      return;
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
      res.status(404).json({
        statut: "error",
        message: "Relation compétence-niveau non trouvée",
        data: null,
      });
      return;
    }

    // Vérifier si le nouveau niveau existe
    const newNiveau = await prisma.niveau.findUnique({
      where: { id: newNiveauId },
      select: { id: true, nom: true }
    });

    if (!newNiveau) {
      res.status(404).json({
        statut: "error",
        message: "Nouveau niveau non trouvé",
        data: null,
      });
      return;
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
        res.status(409).json({
          statut: "error",
          message: "Cette compétence est déjà associée au nouveau niveau",
          data: null,
        });
        return;
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
      res.status(409).json({
        statut: "error",
        message: "Cette compétence est déjà associée au nouveau niveau",
        data: null,
      });
      return;
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour de la relation compétence-niveau",
      data: null,
    });
  }
};

// DELETE /api/competences/:competenceId/niveaux/:niveauId - Supprimer un niveau d'une compétence
export const removeNiveauFromCompetence = async (req: Request, res: Response): Promise<void> => {
  try {
    const competenceId = parseInt(req.params.competenceId);
    const niveauId = parseInt(req.params.niveauId);

    if (isNaN(competenceId) || isNaN(niveauId)) {
      res.status(400).json({
        statut: "error",
        message: "IDs invalides",
        data: null,
      });
      return;
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
      res.status(404).json({
        statut: "error",
        message: "Relation compétence-niveau non trouvée",
        data: null,
      });
      return;
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