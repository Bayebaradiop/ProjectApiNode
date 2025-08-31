import { Router } from "express";
import {
  getAllPromos,
  getPromoById,
  createPromo,
  updatePromo,
  deletePromo,
} from '../controllers/promo.controller';

const router = Router();

router.get("/", getAllPromos);
router.get("/:id", getPromoById);
router.post("/", createPromo);
router.put("/:id", updatePromo);
router.delete("/:id", deletePromo);

export default router;
