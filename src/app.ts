import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

// Initialisation de Prisma
export const prisma = new PrismaClient();

// Création de l'application Express
const app = express();

// Configuration des middlewares de sécurité
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Configuration CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middlewares de base
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Middleware de gestion des erreurs global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur globale:', err);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Routes de santé (health check)
app.get('/health', async (req: Request, res: Response) => {
  try {
    // Test de connexion à la base de données
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: 'Serveur ECSA opérationnel',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service indisponible',
      database: 'disconnected',
    });
  }
});

// Route de test de la base de données
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const profileCount = await prisma.profile.count();
    const promoCount = await prisma.promo.count();

    res.json({
      success: true,
      message: 'Connexion à la base de données réussie',
      data: {
        users: userCount,
        profiles: profileCount,
        promotions: promoCount,
      },
    });
  } catch (error) {
    console.error('Erreur de connexion DB:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
});

// Route d'informations sur l'API
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    success: true,
    name: 'ECSA - API Suivi des Apprenants',
    version: '1.0.0',
    description: 'API REST pour la gestion du suivi des apprenants ECSA',
    endpoints: {
      health: 'GET /health',
      testDb: 'GET /test-db',
      info: 'GET /api/info',
    },
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
    availableRoutes: [
      'GET /health',
      'GET /test-db',
      'GET /api/info',
    ],
  });
});

export default app;