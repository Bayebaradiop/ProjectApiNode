import { Router } from 'express';
import {
  getAllReferentielCompetences,
  getReferentielCompetenceById,
  createReferentielCompetence,
  deleteReferentielCompetence,
  getCompetencesByReferentiel,
  getReferentielsByCompetence,
} from '../controllers/referentielcompetence.controller';

const router = Router();

// GET /referentiels-competences - Récupérer toutes les associations
router.get('/', getAllReferentielCompetences);

// GET /referentiels-competences/:referentielId/:competenceId - Récupérer une association par ID
router.get('/:referentielId/:competenceId', getReferentielCompetenceById);

// POST /referentiels-competences - Créer une nouvelle association
router.post('/', createReferentielCompetence);

// DELETE /referentiels-competences/:referentielId/:competenceId - Supprimer une association
router.delete('/:referentielId/:competenceId', deleteReferentielCompetence);

// GET /referentiels/:id/competences - Récupérer toutes les compétences d'un référentiel
router.get('/referentiels/:id/competences', getCompetencesByReferentiel);

// GET /competences/:id/referentiels - Récupérer tous les référentiels d'une compétence
router.get('/competences/:id/referentiels', getReferentielsByCompetence);

export default router;
