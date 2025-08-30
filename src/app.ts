import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import competenceRoutes from './routes/competence.routes';

const app = express();
const prisma = new PrismaClient();

// Middlewares de base
app.use(express.json());

// Routes
app.use('/api/competences', competenceRoutes);

// Route de test
app.get('/test', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API ECSA opérationnelle',
    timestamp: new Date().toISOString()
  });
});

export default app;
