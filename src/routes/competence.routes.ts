import { Router } from 'express';
import {
    getAllCompetences,
    getCompetenceById,
    createCompetence,
    updateCompetence,
    deleteCompetence,
} from '../controllers/competence.controller';

const router = Router();

// GET /competences - Récupérer toutes les compétences
router.get('/', getAllCompetences);

// GET /competences/:id - Récupérer une compétence par ID
router.get('/:id', getCompetenceById);

// POST /competences - Créer une nouvelle compétence
router.post('/', createCompetence);

// PUT /competences/:id - Mettre à jour une compétence
router.put('/:id', updateCompetence);

// DELETE /competences/:id - Supprimer une compétence
router.delete('/:id', deleteCompetence);

export default router;
