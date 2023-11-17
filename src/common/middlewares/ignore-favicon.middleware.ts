/**
 * Ignores favicon.ico requests to prevent unneccessary error logging.
 */
export const ignoreFaviconMiddleware = (req, res, next) => {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end();
  } else {
    next();
  }
};
