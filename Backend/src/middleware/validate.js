import ApiError from '../utils/ApiError.js';

/**
 * Creates a middleware that validates required fields in req.body.
 *
 * @param {string[]} requiredFields - Array of field names that must be present.
 * @returns Express middleware function
 *
 * Usage:  router.post('/', validate(['title', 'price']), controller.create);
 */
export const validate = (requiredFields) => (req, _res, next) => {
  const missing = requiredFields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length > 0) {
    return next(
      new ApiError(400, `Missing required fields: ${missing.join(', ')}`)
    );
  }

  next();
};

/**
 * Validates that a value is a positive number.
 */
export const isPositiveNumber = (value) => {
  return typeof value === 'number' && value > 0 && isFinite(value);
};

/**
 * Validates email format.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
