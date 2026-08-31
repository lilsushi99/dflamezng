import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/routes/index';
import { publicSeoController } from './server/controllers/publicSeoController';
import { errorHandler } from './server/middleware/errorHandler';
import { testConnection } from './server/database/db';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Core Middlewares
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // 2. Serve Static Local Storage directory
  const storagePath = path.join(process.cwd(), 'storage');
  app.use('/storage', express.static(storagePath));

  // 3. API Routes FIRST
  app.use('/api', apiRouter);

  // Dynamic SEO Files
  app.get('/sitemap.xml', (req, res) => publicSeoController.getSitemap(req, res));
  app.get('/robots.txt', (req, res) => publicSeoController.getRobots(req, res));

  // 4. Vite middleware for development / Static files for production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 5. Global Error Handling Middleware
  app.use(errorHandler);

  // 6. Test Database Connection
  testConnection().catch((err) => {
    console.warn('[Database] Initial connection check warning:', err);
  });

  // 7. Start listening on 0.0.0.0:3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Flames Photography Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Flames Photography Server] Mode: ${isProduction ? 'production' : 'development'}`);
  });
}

startServer().catch((error) => {
  console.error('[Flames Photography Server Error] Failed to start server:', error);
  process.exit(1);
});
