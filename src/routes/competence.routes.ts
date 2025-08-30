import { Router } from 'express';
import { competenceController } from '../controllers/competence.controller';

const router = Router();


router.get('/', async (req, res) => {
  await competenceController.findAll(req, res);
});

export default router;
