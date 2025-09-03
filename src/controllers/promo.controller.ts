import { Request, Response } from "express";
import { PromoService } from "../services/promo.service";
import { createPromoSchema, updatePromoSchema, promoIdSchema } from "../validators/promo.validator";
import { handleValidationError } from "../utils/validation.utils";

const promoService = new PromoService();


/** Liste toutes les promos triées */
export const getAllPromosTrieses = async (req: Request, res: Response) => {
  try {
    const champ = req.query.champ as string;        // tri simple : ?champ=nom
    const ordre = req.query.ordre as string;        // asc ou desc : ?ordre=asc
    const triMulti = req.query.triMulti as string; // tri multi-colonnes : ?triMulti=nom:asc,annee:desc

    const promos = await promoService.getAllPromosTrieses(champ, ordre, triMulti);

    res.status(200).json({
      statut: 'success',
      message: 'Liste des promos triée avec succès',
      data: promos,
    });
  } catch (error: any) {
    console.error('Erreur lors du tri des promos:', error);
    res.status(500).json({
      statut: 'error',
      message: 'Erreur lors du tri des promos',
      data: null,
    });
  }
};

// GET all promos
export const getAllPromos = async (req: Request, res: Response) => {
  try {
    const promos = await promoService.getAllPromos();
    res.status(200).json({
      statut: "success",
      message: "Liste des promos récupérée avec succès",
      data: promos,
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
    return handleValidationError(validationResult.error, res);
  }

  const { id } = validationResult.data.params;
  try {
    const promo = await promoService.getPromoById(id);
    if (!promo) {
      return res.status(404).json({ statut: "error", message: "Promo non trouvée", data: null });
    }
    res.status(200).json({
      statut: "success",
      message: "Promo récupérée avec succès",
      data: promo
    });
  } catch (error) {
    res.status(500).json({ statut: "error", message: "Erreur lors de la récupération de la promo", data: null });
  }
};

// POST create promo
export const createPromo = async (req: Request, res: Response) => {
  const validationResult = createPromoSchema.safeParse({ body: req.body });
  if (!validationResult.success) {
    return handleValidationError(validationResult.error, res);
  }

  const { nom, dateDebut, dateFin } = validationResult.data.body;
  try {
    const newPromo = await promoService.createPromo({ nom, dateDebut, dateFin });

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
    return handleValidationError(validationResult.error, res);
  }

  const { id } = validationResult.data.params;
  const { nom, dateDebut, dateFin } = validationResult.data.body;

  try {
    const existingPromo = await promoService.getPromoById(id);
    if (!existingPromo) {
      return res.status(404).json({ statut: "error", message: "Promo non trouvée" });
    }

    const updatedPromo = await promoService.updatePromo(id, { nom, dateDebut, dateFin });

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
    return handleValidationError(validationResult.error, res);
  }

  const { id } = validationResult.data.params;
  try {
    const existingPromo = await promoService.getPromoById(id);
    if (!existingPromo) {
      return res.status(404).json({ statut: "error", message: "Promo non trouvée" });
    }

    await promoService.deletePromo(id);

    res.status(200).json({ statut: "success", message: "Promo supprimée avec succès", data: null });
  } catch (error) {
    res.status(500).json({ statut: "error", message: "Erreur lors de la suppression de la promo" });
  }
};


