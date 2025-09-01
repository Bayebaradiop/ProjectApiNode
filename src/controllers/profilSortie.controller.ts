import { Request, Response } from 'express';
import { ProfilSortieService } from '../services/profilSortie.service';
import { createProfilSortieSchema, updateProfilSortieSchema, profilSortieIdSchema, CreateProfilSortieInput, UpdateProfilSortieInput, ProfilSortieIdParams } from '../validators/profilSortie.validator';
import { handleValidationError } from '../utils/validation.utils';

const profilSortieService = new ProfilSortieService();

export const getAllProfilSorties = async (req: Request, res: Response) => {
  try {
    const profilSorties = await profilSortieService.getAllProfilSorties();

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
    const profilSortie = await profilSortieService.getProfilSortieById(profilSortieId);

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
      return handleValidationError(validationResult.error, res);
    }

    const { nom } = validationResult.data.body;

    const newProfilSortie = await profilSortieService.createProfilSortie({ nom });

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
      return handleValidationError(validationResult.error, res);
    }

    const { id: profilSortieId } = validationResult.data.params;
    const { nom } = validationResult.data.body;

    const existingProfilSortie = await profilSortieService.getProfilSortieById(profilSortieId);

    if (!existingProfilSortie) {
      return res.status(404).json({
        statut: "error",
        message: "Profil de sortie non trouvé",
        data: null,
      });
    }

    const updatedProfilSortie = await profilSortieService.updateProfilSortie(profilSortieId, { nom });

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

    const existingProfilSortie = await profilSortieService.getProfilSortieById(profilSortieId);

    if (!existingProfilSortie) {
      return res.status(404).json({
        statut: "error",
        message: "Profil de sortie non trouvé",
        data: null,
      });
    }

    await profilSortieService.deleteProfilSortie(profilSortieId);

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