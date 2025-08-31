import { Router } from 'express';
import {
  getAllCompetences,
  getCompetenceById,
  createCompetence,
  updateCompetence,
  deleteCompetence,
  getNiveauxByCompetence,
  addNiveauToCompetence,
  updateCompetenceNiveau,
  removeNiveauFromCompetence,
} from '../controllers/competence.controller';

const router = Router();

// GET /competences - Récupérer toutes les compétences
router.get('/', getAllCompetences);

// GET /competences/:id - Récupérer une compétence par ID
router.get('/:id', getCompetenceById);

// GET /competences/:id/niveaux - Récupérer les niveaux d'une compétence
router.get('/:id/niveaux', getNiveauxByCompetence);

// POST /competences/:id/niveaux - Ajouter un niveau à une compétence
router.post('/:id/niveaux', addNiveauToCompetence);

// PUT /competences/:competenceId/niveaux/:niveauId - Modifier la relation compétence-niveau
router.put('/:competenceId/niveaux/:niveauId', updateCompetenceNiveau);

// DELETE /competences/:competenceId/niveaux/:niveauId - Supprimer un niveau d'une compétence
router.delete('/:competenceId/niveaux/:niveauId', removeNiveauFromCompetence);

// POST /competences - Créer une nouvelle compétence
router.post('/', createCompetence);

// PUT /competences/:id - Mettre à jour une compétence
router.put('/:id', updateCompetence);

// DELETE /competences/:id - Supprimer une compétence
router.delete('/:id', deleteCompetence);

export default router;
