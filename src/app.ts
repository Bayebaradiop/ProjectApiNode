import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    statut: "success",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler - commented out for testing
// app.use('*', (req, res) => {
//   res.status(404).json({
//     statut: "error",
//     message: "Route not found",
//     data: null,
//   });
// });

// Error handler - commented out for testing
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     statut: "error",
//     message: "Internal server error",
//     data: null,
//   });
// });

export default app;