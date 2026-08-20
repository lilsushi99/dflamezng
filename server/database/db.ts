import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database';

let pool: mysql.Pool | null = null;
let isConnected = false;
let connectionAttempted = false;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: dbConfig.waitForConnections,
      connectionLimit: dbConfig.connectionLimit,
      queueLimit: dbConfig.queueLimit,
      connectTimeout: dbConfig.connectTimeout,
    });
  }
  return pool;
}

export async function testConnection(): Promise<{ success: boolean; message: string }> {
  connectionAttempted = true;
  try {
    const currentPool = getPool();
    const connection = await currentPool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    console.log(`[Database] Successfully connected to MySQL at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    return { success: true, message: `Connected to MySQL (${dbConfig.database})` };
  } catch (error: any) {
    isConnected = false;
    const msg = error?.message || 'Failed to connect to MySQL';
    console.warn(`[Database Warning] MySQL connection not active (${msg}). Operating in database fallback mode.`);
    return { success: false, message: msg };
  }
}

export function isDatabaseConnected(): boolean {
  return isConnected;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (isConnected) {
    try {
      const currentPool = getPool();
      const [rows] = await currentPool.query(sql, params);
      return rows as T[];
    } catch (err) {
      console.error('[Database Query Error]', err);
      throw err;
    }
  }
  throw new Error('Database pool not connected');
}

export async function execute(sql: string, params: any[] = []): Promise<any> {
  if (isConnected) {
    try {
      const currentPool = getPool();
      const [result] = await currentPool.execute(sql, params);
      return result;
    } catch (err) {
      console.error('[Database Execute Error]', err);
      throw err;
    }
  }
  throw new Error('Database pool not connected');
}
