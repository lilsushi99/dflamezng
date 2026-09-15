import rateLimit from 'express-rate-limit';

// Login: the most sensitive endpoint in the app - a brute-force target.
// 10 attempts per 15 minutes per IP is generous for a real admin fumbling
// their password, but slows an automated guesser to a crawl.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// Public booking/inquiry form: prevent spam floods without blocking a
// genuine client who double-submits.
export const inquiryRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many submissions from this connection. Please try again later.' },
});

// General API-wide limiter, applied broadly as a backstop against scripted
// abuse/scraping without affecting normal browsing.
export const generalApiRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});
