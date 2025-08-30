import { Router } from 'express';
import {
  getFormateursByPromo,
  addFormateurToPromo,
  removeFormateurFromPromo,
} from '../controllers/ promo.controller';

const router = Router();

// GET /promos/:id/formateurs - Récupérer tous les formateurs d'une promo
router.get('/:id/formateurs', getFormateursByPromo);

// POST /promos/:id/formateurs - Ajouter un formateur à une promo
router.post('/:id/formateurs', addFormateurToPromo);

// DELETE /promos/:id/formateurs/:userId - Supprimer un formateur d'une promo
router.delete('/:id/formateurs/:userId', removeFormateurFromPromo);

export default router;