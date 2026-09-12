import { Request, Response, NextFunction } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

// Recognizable DB driver/internal error signatures that must never reach a
// client response body, even if err.message was set from a caught DB error
// upstream (e.g. "ER_NO_SUCH_TABLE", "Unknown column", the DB name itself).
const INTERNAL_ERROR_PATTERNS = [/ER_[A-Z_]+/, /SQL/i, /ECONNREFUSED/, /mysql/i, /Unknown column/i, /doesn't exist/i, /at Object\./];

function looksLikeInternalError(message: string): boolean {
  return INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(message));
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction): void {
  // Full detail always goes to server logs only - never to the client.
  console.error('[Unhandled Error]', err);

  const statusCode = err.status || err.statusCode || 500;
  const rawMessage = typeof err.message === 'string' ? err.message : 'Internal Server Error';

  // In production, or whenever the message looks like it leaked from a
  // database/internal error, replace it with a safe generic message.
  const safeMessage =
    !isProduction && !looksLikeInternalError(rawMessage) ? rawMessage : 'Something went wrong. Please try again shortly.';

  res.status(statusCode >= 500 ? 500 : statusCode).json({
    success: false,
    message: safeMessage,
  });
}
