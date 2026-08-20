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

export const authConfig = {
  sessionSecret: process.env.SESSION_SECRET || 'flames_photography_editorial_secret_key_2026',
  tokenExpiresIn: '7d',
  cookieName: 'flames_admin_token',
};
