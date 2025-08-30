import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createProfilSortieSchema, updateProfilSortieSchema, profilSortieIdSchema, CreateProfilSortieInput, UpdateProfilSortieInput, ProfilSortieIdParams } from '../validators/profilSortie.validator';

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

export const getAllProfilSorties = async (req: Request, res: Response) => {
  try {
    const profilSorties = await prisma.profilSortie.findMany({
      include: {
        users: true,
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Liste des profils de sortie récupérée avec succès",
      data: profilSorties,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des profils de sortie:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des profils de sortie",
      data: null,
    });
  }
};

export const getProfilSortieById = async (req: Request, res: Response) => {
  try {
    const validationResult = profilSortieIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID profil de sortie invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: profilSortieId } = validationResult.data.params;
    const profilSortie = await prisma.profilSortie.findUnique({
      where: { id: profilSortieId },
      include: {
        users: true,
      }
    });

    if (!profilSortie) {
      return res.status(404).json({
        statut: "error",
        message: "Profil de sortie non trouvé",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Profil de sortie récupéré avec succès",
      data: profilSortie,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil de sortie:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération du profil de sortie",
      data: null,
    });
  }
};

export const createProfilSortie = async (req: Request, res: Response) => {
  try {
    const validationResult = createProfilSortieSchema.safeParse({ body: req.body });
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

    const { nom } = validationResult.data.body;

    const newProfilSortie = await prisma.profilSortie.create({
      data: {
        nom,
      },
      include: {
        users: true,
      }
    });

    res.status(201).json({
      statut: "success",
      message: "Profil de sortie créé avec succès",
      data: newProfilSortie,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du profil de sortie:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un profil de sortie avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création du profil de sortie",
      data: null,
    });
  }
};

export const updateProfilSortie = async (req: Request, res: Response) => {
  try {
    const validationResult = updateProfilSortieSchema.safeParse({
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

    const { id: profilSortieId } = validationResult.data.params;
    const { nom } = validationResult.data.body;

    const existingProfilSortie = await prisma.profilSortie.findUnique({
      where: { id: profilSortieId },
    });

    if (!existingProfilSortie) {
      return res.status(404).json({
        statut: "error",
        message: "Profil de sortie non trouvé",
        data: null,
      });
    }

    const updatedProfilSortie = await prisma.profilSortie.update({
      where: { id: profilSortieId },
      data: {
        ...(nom && { nom }),
      },
      include: {
        users: true,
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Profil de sortie mis à jour avec succès",
      data: updatedProfilSortie,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil de sortie:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un profil de sortie avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour du profil de sortie",
      data: null,
    });
  }
};

export const deleteProfilSortie = async (req: Request, res: Response) => {
  try {
    const validationResult = profilSortieIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID profil de sortie invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: profilSortieId } = validationResult.data.params;

    const existingProfilSortie = await prisma.profilSortie.findUnique({
      where: { id: profilSortieId },
    });

    if (!existingProfilSortie) {
      return res.status(404).json({
        statut: "error",
        message: "Profil de sortie non trouvé",
        data: null,
      });
    }

    await prisma.profilSortie.delete({
      where: { id: profilSortieId },
    });

    res.status(200).json({
      statut: "success",
      message: "Profil de sortie supprimé avec succès",
      data: null,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil de sortie:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du profil de sortie",
      data: null,
    });
  }
};