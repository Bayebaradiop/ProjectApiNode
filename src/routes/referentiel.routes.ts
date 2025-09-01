import { Router } from 'express';
import {    
  getAllReferentiels,
  getReferentielById,
  createReferentiel,
  updateReferentiel,
  deleteReferentiel,
  addCompetenceToReferentiel
} from '../controllers/referentiel.controller';

const router = Router();

// GET /referentiels - Récupérer tous les utilisateurs
router.get('/', getAllReferentiels);

// GET /users/:id - Récupérer un utilisateur par ID
router.get('/:id', getReferentielById);

// POST /users - Créer un nouvel utilisateur
router.post('/', createReferentiel);

// PUT /users/:id - Mettre à jour un utilisateur
router.put('/:id', updateReferentiel);

// DELETE /users/:id - Supprimer un utilisateur
router.delete('/:id', deleteReferentiel);
router.post('/:id/competences', addCompetenceToReferentiel);

export default router;