import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createProfileSchema, updateProfileSchema, profileIdSchema, CreateProfileInput, UpdateProfileInput, ProfileIdParams } from '../validators/profile.validator';

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

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        users: true,
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Liste des profils récupérée avec succès",
      data: profiles,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des profils",
      data: null,
    });
  }
};

export const getProfileById = async (req: Request, res: Response) => {
  try {
    const validationResult = profileIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID profil invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: profileId } = validationResult.data.params;
    const profile = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        users: true,
      }
    });

    if (!profile) {
      return res.status(404).json({
        statut: "error",
        message: "Profil non trouvé",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Profil récupéré avec succès",
      data: profile,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération du profil",
      data: null,
    });
  }
};

export const createProfile = async (req: Request, res: Response) => {
  try {
    const validationResult = createProfileSchema.safeParse({ body: req.body });
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

    const newProfile = await prisma.profile.create({
      data: {
        nom,
      },
      include: {
        users: true,
      }
    });

    res.status(201).json({
      statut: "success",
      message: "Profil créé avec succès",
      data: newProfile,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création du profil:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un profil avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création du profil",
      data: null,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const validationResult = updateProfileSchema.safeParse({
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

    const { id: profileId } = validationResult.data.params;
    const { nom } = validationResult.data.body;

    const existingProfile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        statut: "error",
        message: "Profil non trouvé",
        data: null,
      });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profileId },
      data: {
        ...(nom && { nom }),
      },
      include: {
        users: true,
      }
    });

    res.status(200).json({
      statut: "success",
      message: "Profil mis à jour avec succès",
      data: updatedProfile,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du profil:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un profil avec ce nom existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour du profil",
      data: null,
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const validationResult = profileIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID profil invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: profileId } = validationResult.data.params;

    const existingProfile = await prisma.profile.findUnique({
      where: { id: profileId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        statut: "error",
        message: "Profil non trouvé",
        data: null,
      });
    }

    await prisma.profile.delete({
      where: { id: profileId },
    });

    res.status(200).json({
      statut: "success",
      message: "Profil supprimé avec succès",
      data: null,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du profil:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du profil",
      data: null,
    });
  }
};