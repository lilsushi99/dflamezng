import dotenv from 'dotenv';
dotenv.config();

export const authConfig = {
  sessionSecret: process.env.SESSION_SECRET || 'flames_photography_editorial_secret_key_2026',
  tokenExpiresIn: '7d',
  cookieName: 'flames_admin_token',
};
