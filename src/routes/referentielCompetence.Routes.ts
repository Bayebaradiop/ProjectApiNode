import express from 'express';
import {
  addCompetenceToReferentiel,
  getCompetencesByReferentiel,
  getOneCompetenceByReferentiel,
  removeCompetenceFromReferentiel,
  updateCompetenceRelation
} from '../controllers/referentielCompetence.Controller';

const router = express.Router({ mergeParams: true });

router.post('/', addCompetenceToReferentiel);
router.get('/', getCompetencesByReferentiel);
router.get('/:competenceId', getOneCompetenceByReferentiel);
router.put('/:competenceId', updateCompetenceRelation);
router.delete('/:competenceId', removeCompetenceFromReferentiel);

export default router;
