import { Router } from 'express';
import { login, refreshToken } from '../controllers/auth.controller';

const router = Router();

// POST /auth/login
router.post('/login', login);

// POST /auth/refresh
router.post('/refresh', refreshToken);

export default router;