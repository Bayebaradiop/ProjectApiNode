import { Router } from 'express';
import {
  getNiveauxByCompetence,
  addNiveauToCompetence,
  updateCompetenceNiveau,
  removeNiveauFromCompetence,
} from '../controllers/competence-niveau.controller';

const router = Router();

// GET /competences/:id/niveaux - Récupérer les niveaux d'une compétence
router.get('/:id/niveaux', getNiveauxByCompetence);

// POST /competences/:id/niveaux - Ajouter un niveau à une compétence
router.post('/:id/niveaux', addNiveauToCompetence);

// PUT /competences/:competenceId/niveaux/:niveauId - Modifier la relation compétence-niveau
router.put('/:competenceId/niveaux/:niveauId', updateCompetenceNiveau);

// DELETE /competences/:competenceId/niveaux/:niveauId - Supprimer un niveau d'une compétence
router.delete('/:competenceId/niveaux/:niveauId', removeNiveauFromCompetence);

export default router;