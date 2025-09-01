import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  addCompetenceSchema,
  referentielIdSchema,
  referentielCompetenceIdsSchema,
  updateCompetenceRelationSchema
} from '../validators/referentielCompetence.Validator';

const prisma = new PrismaClient();

// ----------------------
// Helper Validation DRY
// ----------------------
const validate = (schema: any, data: any, res: Response) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error?.errors?.map((err: any) => ({
      field: err.path.join('.'),
      message: err.message,
    })) || [];

    res.status(400).json({
      statut: "error",
      message: "Données de validation invalides",
      data: null,
      errors,
    });
    return null;
  }
  return result.data;
};

// ----------------------
// POST /referentiels/:id/competences
//http://localhost:3000/api/referentiels/2/competences/
// ----------------------
export const addCompetenceToReferentiel = async (req: Request, res: Response) => {
  const params = validate(referentielIdSchema, { params: req.params }, res);
  if (!params) return;

  // ⚠️ Passer req.body directement
  const body = validate(addCompetenceSchema, req.body, res);
  if (!body) return;

  const { id: referentielId } = params.params;
  const { competenceId } = body;

  try {
    const referentiel = await prisma.referentiel.findUnique({ where: { id: referentielId } });
    if (!referentiel) return res.status(404).json({ statut: "error", message: "Référentiel non trouvé" });

    const competence = await prisma.competence.findUnique({ where: { id: competenceId } });
    if (!competence) return res.status(404).json({ statut: "error", message: "Compétence non trouvée" });

    const existing = await prisma.referentielCompetence.findUnique({
      where: { referentielId_competenceId: { referentielId, competenceId } }
    });
    if (existing) return res.status(409).json({ statut: "error", message: "Cette compétence est déjà liée" });

    const newRelation = await prisma.referentielCompetence.create({
      data: { referentielId, competenceId },
      include: { referentiel: true, competence: true }
    });

    res.status(201).json({ statut: "success", message: "Compétence ajoutée avec succès", data: newRelation });

  } catch (error: any) {
    console.error("Erreur POST:", error);
    res.status(500).json({ statut: "error", message: "Erreur interne" });
  }
};

// ----------------------
// GET /referentiels/:id/competences
// ----------------------
export const getCompetencesByReferentiel = async (req: Request, res: Response) => {
  const params = validate(referentielIdSchema, { params: req.params }, res);
  if (!params) return;
  const { id: referentielId } = params.params;

  try {
    const referentiel = await prisma.referentiel.findUnique({
      where: { id: referentielId },
      select: { id: true, nom: true }
    });
    if (!referentiel) return res.status(404).json({ statut: "error", message: "Référentiel non trouvé" });

    const relations = await prisma.referentielCompetence.findMany({
      where: { referentielId },
      include: { competence: { select: { id: true, nom: true } } }
    });

    res.json({
      statut: "success",
      message: "Compétences récupérées",
      data: { referentiel, competences: relations.map(r => r.competence), count: relations.length }
    });

  } catch (error: any) {
    console.error("Erreur GET:", error);
    res.status(500).json({ statut: "error", message: "Erreur interne" });
  }
};

// ----------------------
// DELETE /referentiels/:id/competences/:competenceId
// ----------------------
export const removeCompetenceFromReferentiel = async (req: Request, res: Response) => {
  const { id: competenceId } = req.params;

  try {
    await prisma.referentielCompetence.deleteMany({ where: { competenceId: Number(competenceId) } });
    await prisma.competence.delete({ where: { id: Number(competenceId) } });

    res.status(200).json({ statut: "success", message: "Compétence supprimée avec succès", data: null });
  } catch (error: any) {
    console.error("Erreur DELETE:", error);
    res.status(500).json({ statut: "error", message: "Impossible de supprimer la compétence", data: null });
  }
};

// ----------------------
// PUT /referentiels/:id/competences/:competenceId
//http://localhost:3000/api/referentiels/2/competences/2
// ----------------------
export const updateCompetenceRelation = async (req: Request, res: Response) => {
  const params = validate(referentielCompetenceIdsSchema, { params: req.params }, res);
  if (!params) return;
  const body = validate(updateCompetenceRelationSchema, { body: req.body }, res);
  if (!body) return;

  const { id: referentielId, competenceId } = params.params;
  const { competenceId: newCompetenceId } = body.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.referentielCompetence.findUnique({
        where: { referentielId_competenceId: { referentielId, competenceId } }
      });
      if (!existing) return null;

      await tx.referentielCompetence.delete({
        where: { referentielId_competenceId: { referentielId, competenceId } }
      });

      return tx.referentielCompetence.create({
        data: { referentielId, competenceId: newCompetenceId },
        include: { referentiel: true, competence: true }
      });
    });

    if (!result) return res.status(404).json({ statut: "error", message: "Relation non trouvée" });

    res.json({ statut: "success", message: "Relation mise à jour", data: result });

  } catch (error: any) {
    console.error("Erreur PUT:", error);
    res.status(500).json({ statut: "error", message: "Erreur interne" });
  }
};

// ----------------------
// GET ONE /referentiels/:id/competences/:competenceId
// ----------------------
export const getOneCompetenceByReferentiel = async (req: Request, res: Response) => {
  const params = validate(referentielCompetenceIdsSchema, { params: req.params }, res);
  if (!params) return;
  const { id: referentielId, competenceId } = params.params;

  try {
    const relation = await prisma.referentielCompetence.findUnique({
      where: { referentielId_competenceId: { referentielId, competenceId } },
      include: { referentiel: true, competence: true }
    });
    if (!relation) return res.status(404).json({ statut: "error", message: "Relation non trouvée" });

    res.json({ statut: "success", message: "Compétence trouvée", data: relation });
  } catch (error: any) {
    console.error("Erreur GET ONE:", error);
    res.status(500).json({ statut: "error", message: "Erreur interne" });
  }
};
