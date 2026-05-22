import ApiError from '../utils/ApiError.js';
import { USER_ROLES } from '../utils/constants.js';

/**
 * Middleware: Restrict access to admin users only.
 * Must be used AFTER the authenticate middleware.
 */
const adminOnly = (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }

  if (req.user.role !== USER_ROLES.ADMIN) {
    return next(new ApiError(403, 'Access denied. Admin privileges required.'));
  }

  next();
};

export default adminOnly;
