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
import { persistentStorageRoot } from './server/config/storage';
import { generalApiRateLimiter } from './server/middleware/rateLimiters';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Core Middlewares
  //
  // CORS: reflecting `origin: true` (any origin) combined with
  // `credentials: true` means any website can make credentialed requests to
  // this API and have the browser attach cookies. ALLOWED_ORIGINS restricts
  // this to an explicit, configured list - the site's own domain(s) - so a
  // malicious third-party page can't ride the admin's session cookie.
  // Comma-separated, e.g. "https://dflamez.com.ng,https://www.dflamez.com.ng".
  // If unset, defaults to reflecting the request's own origin in development
  // only, and to no cross-origin access at all in production, which is safe
  // since the frontend and API are served from the same origin here.
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        // No Origin header (same-origin requests, curl, server-to-server) - allow.
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        if (!isProduction) return callback(null, true); // permissive locally for dev convenience
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    })
  );

  // Basic security headers on every response. Notably X-Content-Type-Options
  // prevents a browser from sniffing an uploaded file's declared type away
  // from what the server set (relevant defense-in-depth alongside the
  // upload validation in uploadMiddleware.ts), and the storage-scoped CSP
  // below blocks script execution for anything served from /storage even
  // if a malicious file ever slipped through upload validation.
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (req.path.startsWith('/storage')) {
      res.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; sandbox;");
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use('/api', generalApiRateLimiter);

  // 2. Serve Static Local Storage directory
  // Resolves to PERSISTENT_STORAGE_PATH when set (see server/config/storage.ts)
  // so uploaded media survives redeploys even on hosts that recreate the
  // deployed folder from a fresh git checkout on every deploy.
  const storagePath = persistentStorageRoot;
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

