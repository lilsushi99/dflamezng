import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { isDatabaseConnected, testConnection } from '../database/db';
import { dbConfig } from '../config/database';
import { persistentStorageRoot, isUsingExternalStoragePath } from '../config/storage';

// Bump this string whenever a fix to storage/deploy behavior ships, so a
// single /api/health request conclusively proves whether that code is
// actually running in production - no need to guess based on "I redeployed".
const BUILD_MARKER = 'storage-fix-v2-2026-09-09';

const EXPECTED_SUBFOLDERS = ['splash', 'homepage/front', 'homepage/back', 'projects', 'logos', 'seo'];

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    const isDbActive = isDatabaseConnected();

    const subfolderStatus = EXPECTED_SUBFOLDERS.reduce((acc, sub) => {
      const fullPath = path.join(persistentStorageRoot, sub);
      let exists = false;
      let fileCount = 0;
      try {
        exists = fs.existsSync(fullPath);
        if (exists) {
          fileCount = fs.readdirSync(fullPath).filter((f) => f !== '.gitkeep').length;
        }
      } catch {
        exists = false;
      }
      acc[sub] = { exists, fileCount };
      return acc;
    }, {} as Record<string, { exists: boolean; fileCount: number }>);

    res.status(200).json({
      status: 'ok',
      service: 'Flames Photography Express Backend',
      version: '1.0.0',
      buildMarker: BUILD_MARKER,
      timestamp: new Date().toISOString(),
      database: {
        driver: 'mysql2',
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.database,
        connected: isDbActive,
        mode: isDbActive ? 'Live MySQL Pool' : 'Active Local Repository Fallback',
      },
      storage: {
        type: 'local_filesystem',
        // The ACTUAL absolute path this running process writes uploads to,
        // resolved live - not a hardcoded string. If this doesn't match
        // your PERSISTENT_STORAGE_PATH env var, the running app either
        // doesn't have that env var set, or is running old code.
        resolvedRoot: persistentStorageRoot,
        usingExternalPersistentPath: isUsingExternalStoragePath,
        persistentStoragePathEnvVar: process.env.PERSISTENT_STORAGE_PATH || null,
        subfolders: subfolderStatus,
      },
    });
  }

  async testDb(req: Request, res: Response): Promise<void> {
    const result = await testConnection();
    res.status(result.success ? 200 : 503).json(result);
  }
}

export const healthController = new HealthController();
