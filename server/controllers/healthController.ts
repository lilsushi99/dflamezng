import { Request, Response } from 'express';
import { isDatabaseConnected, testConnection } from '../database/db';
import { dbConfig } from '../config/database';

export class HealthController {
  async getHealth(req: Request, res: Response): Promise<void> {
    const isDbActive = isDatabaseConnected();

    res.status(200).json({
      status: 'ok',
      service: 'Flames Photography Express Backend',
      version: '1.0.0',
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
        paths: [
          '/storage/splash',
          '/storage/homepage/front',
          '/storage/homepage/back',
          '/storage/projects',
        ],
      },
    });
  }

  async testDb(req: Request, res: Response): Promise<void> {
    const result = await testConnection();
    res.status(result.success ? 200 : 503).json(result);
  }
}

export const healthController = new HealthController();
