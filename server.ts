import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { initDB } from './src/server/database.js';
import taskRoutes from './src/server/routes/taskRoutes.js';
import projectRoutes from './src/server/routes/projectRoutes.js';
import authRoutes from './src/server/routes/authRoutes.js';
import { authenticate } from './src/server/middleware/authMiddleware.js';
import { errorHandler } from './src/server/middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Initialize Database
  initDB();

  const app = express();
  app.set('trust proxy', 1);
  const PORT = Number(process.env.PORT) || 3000;

  // Security Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP temporarily to ensure shared app loads
    crossOriginEmbedderPolicy: false,
  }));

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200, // Increased limit for preview stability
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });
  
  app.use('/api/auth/login', limiter);
  app.use('/api/auth/register', limiter);

  // Basic Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', mode: process.env.NODE_ENV || 'development' });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', authenticate as any, taskRoutes);
  app.use('/api/projects', authenticate as any, projectRoutes);

  // Vite Integration for Frontend
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve from the dist folder built by vite
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Handling Middleware
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
