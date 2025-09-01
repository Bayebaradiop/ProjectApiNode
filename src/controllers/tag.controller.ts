
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createTagSchema, updateTagSchema, tagIdSchema, CreateTagInput, UpdateTagInput, TagIdParams } from '../validators/tag.validator';

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


export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany();
    res.status(200).json({
      statut: "success",
      message: "Liste des tags récupérée avec succès",
      data: tags,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des tags",
      data: null,
    });
  }
};


export const getTagById = async (req: Request, res: Response) => {
  try {
    const validationResult = tagIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID tag invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    const { id: tagId } = validationResult.data.params;
    const tag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!tag) {
      return res.status(404).json({
        statut: "error",
        message: "Tag non trouvé",
        data: null,
      });
    }
    res.status(200).json({
      statut: "success",
      message: "Tag récupéré avec succès",
      data: tag,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du tag:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération du tag",
      data: null,
    });
  }
};


export const createTag = async (req: Request, res: Response) => {
  try {
    const validationResult = createTagSchema.safeParse({ body: req.body });
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
    const newTag = await prisma.tag.create({
      data: { nom },
      select: { id: true, nom: true },
    });
    res.status(201).json({
      statut: "success",
      message: "Tag créé avec succès",
      data: newTag,
    });
  } catch (error: any) {
    console.error("Erreur lors de la création du tag:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un tag avec ce nom existe déjà",
        data: null,
      });
    }
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création du tag",
      data: null,
    });
  }
};


export const updateTag = async (req: Request, res: Response) => {
  try {
    const validationResult = updateTagSchema.safeParse({
      params: req.params,
      body: req.body,
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
    const { id: tagId } = validationResult.data.params;
    const { nom } = validationResult.data.body;
    const existingTag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!existingTag) {
      return res.status(404).json({
        statut: "error",
        message: "Tag non trouvé",
        data: null,
      });
    }
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: { ...(nom && { nom }) },
      select: { id: true, nom: true },
    });
    res.status(200).json({
      statut: "success",
      message: "Tag mis à jour avec succès",
      data: updatedTag,
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour du tag:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un tag avec ce nom existe déjà",
        data: null,
      });
    }
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour du tag",
      data: null,
    });
  }
};


export const deleteTag = async (req: Request, res: Response) => {
  try {
    const validationResult = tagIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID tag invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    const { id: tagId } = validationResult.data.params;
    const existingTag = await prisma.tag.findUnique({ where: { id: tagId } });
    if (!existingTag) {
      return res.status(404).json({
        statut: "error",
        message: "Tag non trouvé",
        data: null,
      });
    }
    await prisma.tag.delete({ where: { id: tagId } });
    res.status(200).json({
      statut: "success",
      message: "Tag supprimé avec succès",
      data: null,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du tag:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression du tag",
      data: null,
    });
  }
};
