import { Router } from 'express';
import {
  getAllNiveaux,
  getNiveauById,
  createNiveau,
  updateNiveau,
  deleteNiveau,
} from '../controllers/niveau.controller';

const router = Router();

// GET /niveaux - Récupérer tous les niveaux
router.get('/', getAllNiveaux);

// GET /niveaux/:id - Récupérer un niveau par ID
router.get('/:id', getNiveauById);

// POST /niveaux - Créer un nouveau niveau
router.post('/', createNiveau);

// PUT /niveaux/:id - Mettre à jour un niveau
router.put('/:id', updateNiveau);

// DELETE /niveaux/:id - Supprimer un niveau
router.delete('/:id', deleteNiveau);

export default router;
