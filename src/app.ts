import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';
import competenceRoutes from './routes/competence.routes';
import competenceNiveauRoutes from './routes/competence-niveau.routes';
import niveauRoutes from './routes/niveau.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/competences', competenceRoutes);
app.use('/api/competences', competenceNiveauRoutes);
app.use('/api/niveaux', niveauRoutes);


app.get('/api/health', (req, res) => {
  res.status(200).json({
    statut: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});



export default app;