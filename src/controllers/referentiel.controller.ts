import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createReferentielSchema, updateReferentielSchema, referentielIdSchema, addCompetenceSchema } from '../validators/referentiel.validator';

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

// ----------------------
// GET /referentiels
// ----------------------
export const getAllReferentiels = async (req: Request, res: Response) => {
  try {
    const referentiels = await prisma.referentiel.findMany({
      include: { competences: true, users: true, promos: true }
    });

    res.status(200).json({
      statut: "success",
      message: "Liste des référentiels récupérée avec succès",
      data: referentiels,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des référentiels:", error);
    res.status(500).json({ statut: "error", message: "Erreur lors de la récupération des référentiels", data: null });
  }
};

// ----------------------
// GET /referentiels/:id
// ----------------------
export const getReferentielById = async (req: Request, res: Response) => {
  try {
    const validationResult = referentielIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id } = validationResult.data.params;

    const referentiel = await prisma.referentiel.findUnique({
      where: { id },
      include: { competences: true, users: true, promos: true }
    });

    if (!referentiel) return res.status(404).json({ statut: "error", message: "Référentiel non trouvé", data: null });

    res.status(200).json({ statut: "success", message: "Référentiel récupéré avec succès", data: referentiel });
  } catch (error) {
    console.error("Erreur lors de la récupération du référentiel:", error);
    res.status(500).json({ statut: "error", message: "Erreur lors de la récupération du référentiel", data: null });
  }
};

// ----------------------
// POST /referentiels
// ----------------------
export const createReferentiel = async (req: Request, res: Response) => {
  try {
    const validationResult = createReferentielSchema.safeParse({ body: req.body });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { nom, description } = validationResult.data.body;

    const newReferentiel = await prisma.referentiel.create({ data: { nom, description } });

    res.status(201).json({ statut: "success", message: "Référentiel créé avec succès", data: newReferentiel });
  } catch (error: any) {
    console.error("Erreur lors de la création du référentiel:", error);
    if (error.code === 'P2002') return res.status(409).json({ statut: "error", message: "Un référentiel avec ce nom existe déjà", data: null });
    res.status(500).json({ statut: "error", message: "Erreur lors de la création du référentiel", data: null });
  }
};

// ----------------------
// PUT /referentiels/:id
// ----------------------
export const updateReferentiel = async (req: Request, res: Response) => {
  try {
    const validationResult = updateReferentielSchema.safeParse({ params: req.params, body: req.body });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id } = validationResult.data.params;
    const { nom, description } = validationResult.data.body;

    const existingReferentiel = await prisma.referentiel.findUnique({ where: { id } });
    if (!existingReferentiel) return res.status(404).json({ statut: "error", message: "Référentiel non trouvé", data: null });

    const updatedReferentiel = await prisma.referentiel.update({
      where: { id },
      data: { ...(nom && { nom }), ...(description && { description }) },
    });

    res.status(200).json({ statut: "success", message: "Référentiel mis à jour avec succès", data: updatedReferentiel });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du référentiel:", error);
    if (error.code === 'P2002') return res.status(409).json({ statut: "error", message: "Un référentiel avec ce nom existe déjà", data: null });
    res.status(500).json({ statut: "error", message: "Erreur lors de la mise à jour du référentiel", data: null });
  }
};

// ----------------------
// DELETE /referentiels/:id
// ----------------------
export const deleteReferentiel = async (req: Request, res: Response) => {
  try {
    const validationResult = referentielIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) return handleValidationError(validationResult.error, res);

    const { id } = validationResult.data.params;

    const existingReferentiel = await prisma.referentiel.findUnique({ where: { id } });
    if (!existingReferentiel) return res.status(404).json({ statut: "error", message: "Référentiel non trouvé", data: null });

    // Supprimer relations et dépendances
    await prisma.referentielCompetence.deleteMany({ where: { referentielId: id } });
    await prisma.promoReferentiel.deleteMany({ where: { referentielId: id } });
    await prisma.user.updateMany({ where: { referentielId: id }, data: { referentielId: null } });

    await prisma.referentiel.delete({ where: { id } });

    res.status(200).json({ statut: "success", message: "Référentiel supprimé avec succès", data: null });
  } catch (error) {
    console.error("Erreur lors de la suppression du référentiel:", error);
    res.status(500).json({ statut: "error", message: "Impossible de supprimer le référentiel", data: null });
  }
};

// ----------------------
// POST /referentiels/:id/competences
// ----------------------
