import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middlewares de base
app.use(express.json());

// Route simple de test
app.get('/', (req, res) => {
  res.json({
    message: 'Serveur ECSA fonctionne !',
    timestamp: new Date().toISOString()
  });
});

app.get('/test-db', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({
      success: true,
      message: 'Base de données connectée',
      users: userCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion DB',
      error: (error as Error).message
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log('Routes disponibles:');
  console.log(`  - GET http://localhost:${PORT}/`);
  console.log(`  - GET http://localhost:${PORT}/test-db`);
});