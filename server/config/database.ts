import dotenv from 'dotenv';
dotenv.config();

export const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  database: process.env.MYSQL_DATABASE || 'flames_photography',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000,
};

// NOTE: auth/session config lives in server/config/auth.ts - the single
// source of truth for the JWT signing secret (it also enforces a production
// fail-fast if SESSION_SECRET isn't set). A duplicate, unused copy used to
// live here with the same hardcoded fallback secret; removed to eliminate
// the risk of a future import accidentally pulling the wrong one.
