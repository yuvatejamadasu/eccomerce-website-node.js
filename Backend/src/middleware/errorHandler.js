import ApiError from '../utils/ApiError.js';

/**
 * Global error-handling middleware.
 * Catches all errors forwarded via next(error) and sends a structured JSON response.
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Firestore-specific errors
  if (err.code === 'not-found') {
    statusCode = 404;
    message = 'Resource not found.';
  }

  // Log errors in development
  if (process.env.NODE_ENV === 'development') {
    if (statusCode >= 500) {
      console.error(`❌ [${statusCode}] Server Error:`, {
        message,
        stack: err.stack,
      });
    } else {
      console.warn(`⚠️ [${statusCode}] Client Error: ${message}`);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes.
 */
export const notFound = (req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
