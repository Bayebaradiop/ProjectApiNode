import { Router } from 'express';
import {
  getAllProfilSorties,
  getProfilSortieById,
  createProfilSortie,
  updateProfilSortie,
  deleteProfilSortie,
} from '../controllers/profilSortie.controller';

const router = Router();

// GET /profils-sortie - Récupérer tous les profils de sortie
router.get('/', getAllProfilSorties);

// GET /profils-sortie/:id - Récupérer un profil de sortie par ID
router.get('/:id', getProfilSortieById);

// POST /profils-sortie - Créer un nouveau profil de sortie
router.post('/', createProfilSortie);

// PUT /profils-sortie/:id - Mettre à jour un profil de sortie
router.put('/:id', updateProfilSortie);

// DELETE /profils-sortie/:id - Supprimer un profil de sortie
router.delete('/:id', deleteProfilSortie);

export default router;