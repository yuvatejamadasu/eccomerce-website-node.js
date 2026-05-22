/**
 * Wraps an async route handler so thrown errors are automatically
 * forwarded to Express's error-handling middleware via next().
 *
 * Usage:  router.get('/path', catchAsync(async (req, res) => { ... }));
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default catchAsync;
