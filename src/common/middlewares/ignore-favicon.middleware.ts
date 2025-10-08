import { NextFunction, Request, Response } from 'express';

/**
 * Ignores favicon.ico requests to prevent unneccessary error logging.
 * @param req - Incoming HTTP request.
 * @param res - HTTP response instance.
 * @param next - Express continuation callback.
 */
export const ignoreFaviconMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
  } else {
    next();
  }
};
