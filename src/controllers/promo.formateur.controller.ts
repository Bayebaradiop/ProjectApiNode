import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { promoIdSchema, addFormateurSchema, removeFormateurSchema, PromoIdParams, AddFormateurInput, RemoveFormateurParams } from '../validators/promo.validator';

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

    // Vérifier si la promo existe
    const promo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      return res.status(404).json({
        statut: "error",
        message: "Promo non trouvée",
        data: null,
      });
    }

    // Récupérer les formateurs de la promo
    const formateurs = await prisma.promoFormateurs.findMany({
      where: { promoId },
      include: {
        user: {
          include: {
            profile: true,
            profilSortie: true,
            referentiel: true,
          }
        }
      }
    });

    const formattedFormateurs = formateurs.map(pf => pf.user);

    res.status(200).json({
      statut: "success",
      message: "Formateurs de la promo récupérés avec succès",
      data: formattedFormateurs,
    });
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

    // Vérifier si la promo existe
    const promo = await prisma.promo.findUnique({
      where: { id: promoId },
    });

    if (!promo) {
      return res.status(404).json({
        statut: "error",
        message: "Promo non trouvée",
        data: null,
      });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    // Vérifier si l'utilisateur est déjà formateur de cette promo
    const existingRelation = await prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: {
          promoId,
          userId,
        }
      }
    });

    if (existingRelation) {
      return res.status(409).json({
        statut: "error",
        message: "Cet utilisateur est déjà formateur de cette promo",
        data: null,
      });
    }

    // Ajouter le formateur à la promo
    const newRelation = await prisma.promoFormateurs.create({
      data: {
        promoId,
        userId,
      },
      include: {
        user: {
          include: {
            profile: true,
            profilSortie: true,
            referentiel: true,
          }
        },
        promo: true,
      }
    });

    res.status(201).json({
      statut: "success",
      message: "Formateur ajouté à la promo avec succès",
      data: {
        promo: newRelation.promo,
        formateur: newRelation.user,
      },
    });
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

    // Vérifier si la relation existe
    const existingRelation = await prisma.promoFormateurs.findUnique({
      where: {
        promoId_userId: {
          promoId,
          userId,
        }
      },
      include: {
        user: {
          include: {
            profile: true,
            profilSortie: true,
            referentiel: true,
          }
        },
        promo: true,
      }
    });

    if (!existingRelation) {
      return res.status(404).json({
        statut: "error",
        message: "Ce formateur n'est pas associé à cette promo",
        data: null,
      });
    }

    // Supprimer la relation
    await prisma.promoFormateurs.delete({
      where: {
        promoId_userId: {
          promoId,
          userId,
        }
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Formateur supprimé de la promo avec succès",
      data: {
        promo: existingRelation.promo,
        formateur: existingRelation.user,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du formateur:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du formateur",
      data: null,
    });
  }
};