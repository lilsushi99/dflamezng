import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import apiRouter from './server/routes/index';
import { publicSeoController } from './server/controllers/publicSeoController';
import { errorHandler } from './server/middleware/errorHandler';
import { testConnection } from './server/database/db';
import { handleHtmlRequest } from './server/services/htmlRenderer';

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
  let vite: ViteDevServer | undefined;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
  }

  // 5. Dynamic HTML navigation router (SEO Head Injection & HTTP 404s)
  app.get('*', async (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/storage') || path.extname(req.path)) {
      return next();
    }
    try {
      await handleHtmlRequest(req, res, vite, isProduction);
    } catch (err) {
      next(err);
    }
  });

  // 6. Global Error Handling Middleware
  app.use(errorHandler);

  // 7. Test Database Connection
  testConnection().catch((err) => {
    console.warn('[Database] Initial connection check warning:', err);
  });

  // 8. Start listening on 0.0.0.0:3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Flames Photography Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Flames Photography Server] Mode: ${isProduction ? 'production' : 'development'}`);
  });
}

startServer().catch((error) => {
  console.error('[Flames Photography Server Error] Failed to start server:', error);
  process.exit(1);
});

