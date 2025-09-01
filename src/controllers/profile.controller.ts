import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { createProfileSchema, updateProfileSchema, profileIdSchema, CreateProfileInput, UpdateProfileInput, ProfileIdParams } from '../validators/profile.validator';
import { handleValidationError } from '../utils/validation.utils';

const profileService = new ProfileService();

export const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await profileService.getAllProfiles();

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
      return handleValidationError(validationResult.error, res);
    }

    const { id: profileId } = validationResult.data.params;
    const profile = await profileService.getProfileById(profileId);

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
      return handleValidationError(validationResult.error, res);
    }

    const { nom } = validationResult.data.body;

    const newProfile = await profileService.createProfile({ nom });

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
      return handleValidationError(validationResult.error, res);
    }

    const { id: profileId } = validationResult.data.params;
    const { nom } = validationResult.data.body;

    const existingProfile = await profileService.getProfileById(profileId);

    if (!existingProfile) {
      return res.status(404).json({
        statut: "error",
        message: "Profil non trouvé",
        data: null,
      });
    }

    const updatedProfile = await profileService.updateProfile(profileId, { nom });

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
      return handleValidationError(validationResult.error, res);
    }

    const { id: profileId } = validationResult.data.params;

    const existingProfile = await profileService.getProfileById(profileId);

    if (!existingProfile) {
      return res.status(404).json({
        statut: "error",
        message: "Profil non trouvé",
        data: null,
      });
    }

    await profileService.deleteProfile(profileId);

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