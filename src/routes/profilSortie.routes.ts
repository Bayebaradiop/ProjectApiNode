import { Router } from 'express';
import {
  getAllProfilSorties,
  getProfilSortieById,
  createProfilSortie,
  updateProfilSortie,
  deleteProfilSortie,
} from '../controllers/profilSortie.controller';

const router = Router();

// GET /profilSorties - Récupérer tous les profils de sortie
router.get('/', getAllProfilSorties);

// GET /profilSorties/:id - Récupérer un profil de sortie par ID
router.get('/:id', getProfilSortieById);

// POST /profilSorties - Créer un nouveau profil de sortie
router.post('/', createProfilSortie);

// PUT /profilSorties/:id - Mettre à jour un profil de sortie
router.put('/:id', updateProfilSortie);

// DELETE /profilSorties/:id - Supprimer un profil de sortie
router.delete('/:id', deleteProfilSortie);

export default router;