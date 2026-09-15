import { Request, Response, NextFunction } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

// Recognizable DB driver/internal error signatures that must never reach a
// client response body, even if err.message was set from a caught DB error
// upstream (e.g. "ER_NO_SUCH_TABLE", "Unknown column", the DB name itself).
const INTERNAL_ERROR_PATTERNS = [/ER_[A-Z_]+/, /SQL/i, /ECONNREFUSED/, /mysql/i, /Unknown column/i, /doesn't exist/i, /at Object\./];

function looksLikeInternalError(message: string): boolean {
  return INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * Thrown by application code (e.g. multer file filters, request validation)
 * to signal "this exact message is safe to show the requester, in any
 * environment" - as opposed to letting an arbitrary caught exception's
 * message through, which might contain internal implementation detail even
 * when it doesn't match INTERNAL_ERROR_PATTERNS above.
 */
export class AppError extends Error {
  status: number;
  expose = true;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  // Full detail always goes to server logs only - never to the client.
  console.error('[Unhandled Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  const rawMessage = typeof err.message === 'string' ? err.message : 'Internal Server Error';

  // Multer's own errors (file-too-large, wrong field name, etc.) are safe,
  // known-shape validation messages - surface them as-is. Everything else
  // follows the strict production-safe logic below.
  const isKnownSafeError = err.expose === true || err.name === 'MulterError';

  const safeMessage = isKnownSafeError
    ? rawMessage
    : !isProduction && !looksLikeInternalError(rawMessage)
      ? rawMessage
      : 'Something went wrong. Please try again shortly.';

  res.status(statusCode >= 500 ? 500 : statusCode).json({
    success: false,
    message: safeMessage,
  });
}
