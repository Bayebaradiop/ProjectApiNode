import { Router } from 'express';
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/profile.controller';

const router = Router();

// GET /profiles - Récupérer tous les profils
router.get('/', getAllProfiles);

// GET /profiles/:id - Récupérer un profil par ID
router.get('/:id', getProfileById);

// POST /profiles - Créer un nouveau profil
router.post('/', createProfile);

// PUT /profiles/:id - Mettre à jour un profil
router.put('/:id', updateProfile);

// DELETE /profiles/:id - Supprimer un profil
router.delete('/:id', deleteProfile);

export default router;