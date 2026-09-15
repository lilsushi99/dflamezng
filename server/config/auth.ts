import dotenv from 'dotenv';
import crypto from 'crypto';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const envSecret = process.env.SESSION_SECRET;

if (isProduction && (!envSecret || envSecret.trim().length < 32)) {
  // This repository is public. A missing or weak SESSION_SECRET in production
  // means admin auth tokens could be forged by anyone who reads the source.
  // Fail loudly at boot rather than silently falling back to a predictable value.
  throw new Error(
    '[FATAL] SESSION_SECRET environment variable is missing or too short (must be 32+ random characters) in production. ' +
    'Set a strong, unique SESSION_SECRET in your hosting environment before starting the server. Refusing to start with an insecure default.'
  );
}

// Development-only fallback: a random secret generated fresh per process start.
// This intentionally does NOT persist across restarts, so it can never become
// a de-facto hardcoded production secret - unlike a literal string in source.
const devFallbackSecret = crypto.randomBytes(32).toString('hex');

export const authConfig = {
  sessionSecret: envSecret || devFallbackSecret,
  tokenExpiresIn: '7d',
  cookieName: 'flames_admin_token',
};
