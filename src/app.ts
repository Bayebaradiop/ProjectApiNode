import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import competenceRoutes from './routes/competence.routes';
import competenceNiveauRoutes from './routes/competence-niveau.routes';
import niveauRoutes from './routes/niveau.routes';
import profilSortieRoutes from './routes/profilSortie.routes';
import promoRoutes from './routes/promo.routes';
import promoFormateurRoutes from './routes/promoFormateur.routes';
import dotenv from 'dotenv'
import referentielRoutes from './routes/referentiel.routes';
import tagRoutes from './routes/tag.routes';
import profileRoutes from './routes/profile.routes';
import referentielCompetenceRoutes from './routes/referentielcompetence.routes';
import authRoutes from './routes/auth.routes';
import authMiddleware from './middleweare/auth.midleweare';
import { rbac } from './dictionnaire/role.dictionary';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Public auth routes
app.use('/api/auth', authRoutes);

// Protected routes (require authentication + RBAC)
app.use('/api/users', authMiddleware, rbac('users'), userRoutes);
app.use('/api/competences', authMiddleware, rbac(), competenceRoutes);
app.use('/api/competences', authMiddleware, rbac(), competenceNiveauRoutes);
app.use('/api/niveaux', authMiddleware, rbac(), niveauRoutes);
app.use('/api/profils-sortie', authMiddleware, rbac(), profilSortieRoutes);
app.use('/api/promos', authMiddleware, rbac(), promoRoutes);
app.use('/api/promos', authMiddleware, rbac(), promoFormateurRoutes);
app.use('/api/referentiels', authMiddleware, rbac(), referentielRoutes);
app.use('/api/tags', authMiddleware, rbac(), tagRoutes);
app.use('/api/profiles', authMiddleware, rbac(), profileRoutes);
app.use('/api/referentiels-competences', authMiddleware, rbac(), referentielCompetenceRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({
    statut: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default app;