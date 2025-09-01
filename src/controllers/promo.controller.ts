import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createPromoSchema, updatePromoSchema, promoIdSchema } from "../validators/promo.validator";

const prisma = new PrismaClient();

// GET all promos
export const getAllPromos = async (req: Request, res: Response) => {
  try {
    const promos = await prisma.promo.findMany({
      include: { formateurs: true }
    });
    // Pour chaque promo, récupérer les référentiels associés via la table de jointure
    const promosWithReferentiels = await Promise.all(promos.map(async promo => {
      const referentiels = await prisma.promoReferentiel.findMany({
        where: { promoId: promo.id },
        include: { referentiel: true }
      });
      return { ...promo, referentiels: referentiels.map(r => r.referentiel) };
    }));
    res.status(200).json({
      statut: "success",
      message: "Liste des promos récupérée avec succès",
      data: promosWithReferentiels,
    });
  } catch (error) {
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des promos",
      data: null,
    });
  }
};

// GET promo by ID
export const getPromoById = async (req: Request, res: Response) => {
  const validationResult = promoIdSchema.safeParse({ params: req.params });
  if (!validationResult.success) {
    return res.status(400).json({ statut: "error", message: "ID invalide", errors: validationResult.error.issues });
  }

  const { id } = validationResult.data.params;
  try {
    const promo = await prisma.promo.findUnique({
      where: { id },
      include: { formateurs: true }
    });
    if (!promo) {
      return res.status(404).json({ statut: "error", message: "Promo non trouvée", data: null });
    }
    const referentiels = await prisma.promoReferentiel.findMany({
      where: { promoId: promo.id },
      include: { referentiel: true }
    });
    res.status(200).json({
      statut: "success",
      message: "Promo récupérée avec succès",
      data: { ...promo, referentiels: referentiels.map(r => r.referentiel) }
    });
  } catch (error) {
    res.status(500).json({ statut: "error", message: "Erreur lors de la récupération de la promo", data: null });
  }
};

// POST create promo
export const createPromo = async (req: Request, res: Response) => {
  const validationResult = createPromoSchema.safeParse({ body: req.body });
  if (!validationResult.success) {
    return res.status(400).json({ statut: "error", message: "Données invalides", errors: validationResult.error.issues });
  }

  const { nom, dateDebut, dateFin } = validationResult.data.body;
  try {
    const newPromo = await prisma.promo.create({
      data: {
        nom,
        dateDebut: new Date(dateDebut),
        dateFin: new Date(dateFin),
      },
    });

    res.status(201).json({ statut: "success", message: "Promo créée avec succès", data: newPromo });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ statut: "error", message: "Une promo avec ce nom existe déjà" });
    }
    res.status(500).json({ statut: "error", message: "Erreur lors de la création de la promo" });
  }
};

// PUT update promo
export const updatePromo = async (req: Request, res: Response) => {
  const validationResult = updatePromoSchema.safeParse({ params: req.params, body: req.body });
  if (!validationResult.success) {
    return res.status(400).json({ statut: "error", message: "Données invalides", errors: validationResult.error.issues });
  }

  const { id } = validationResult.data.params;
  const { nom, dateDebut, dateFin } = validationResult.data.body;

  try {
    const existingPromo = await prisma.promo.findUnique({ where: { id } });
    if (!existingPromo) {
      return res.status(404).json({ statut: "error", message: "Promo non trouvée" });
    }

    const updatedPromo = await prisma.promo.update({
      where: { id },
      data: {
        ...(nom && { nom }),
        ...(dateDebut && { dateDebut: new Date(dateDebut) }),
        ...(dateFin && { dateFin: new Date(dateFin) }),
      },
    });

    res.status(200).json({ statut: "success", message: "Promo mise à jour avec succès", data: updatedPromo });
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ statut: "error", message: "Une promo avec ce nom existe déjà" });
    }
    res.status(500).json({ statut: "error", message: "Erreur lors de la mise à jour de la promo" });
  }
};

// DELETE promo
export const deletePromo = async (req: Request, res: Response) => {
  const validationResult = promoIdSchema.safeParse({ params: req.params });
  if (!validationResult.success) {
    return res.status(400).json({ statut: "error", message: "ID invalide", errors: validationResult.error.issues });
  }

  const { id } = validationResult.data.params;
  try {
    const existingPromo = await prisma.promo.findUnique({ where: { id } });
    if (!existingPromo) {
      return res.status(404).json({ statut: "error", message: "Promo non trouvée" });
    }

    // Supprimer d'abord les liens dans les tables de jointure
    await prisma.promoReferentiel.deleteMany({ where: { promoId: id } });
    await prisma.promoFormateurs.deleteMany({ where: { promoId: id } });

    // Puis supprimer la promo
    await prisma.promo.delete({ where: { id } });

    res.status(200).json({ statut: "success", message: "Promo supprimée avec succès", data: null });
  } catch (error) {
    res.status(500).json({ statut: "error", message: "Erreur lors de la suppression de la promo" });
  }
};


