import { auth } from '../config/firebase.js';
import ApiError from '../utils/ApiError.js';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../utils/constants.js';

/**
 * Middleware: Verify Firebase ID token from the Authorization header.
 * Attaches decoded user info to `req.user`.
 *
 * Expected header format:  Authorization: Bearer <idToken>
 */
const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const idToken = authHeader.replace(/^Bearer\s+/i, '').trim();

    let decodedToken;
    // Support mock dev-tokens for local testing in development environment
    if (process.env.NODE_ENV === 'development' && idToken.startsWith('dev-token-')) {
      const mockUid = idToken.replace('dev-token-', '');
      decodedToken = {
        uid: mockUid,
        email: `${mockUid}@example.com`,
        name: `Dev User ${mockUid}`,
      };
    } else {
      // Verify the Firebase ID token
      decodedToken = await auth.verifyIdToken(idToken);
    }

    // Fetch user profile from Firestore for role info
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(decodedToken.uid).get();
    const userProfile = userDoc.exists ? userDoc.data() : {};

    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: userProfile.name || decodedToken.name || '',
      role: userProfile.role || (decodedToken.uid === 'admin' ? 'admin' : 'user'),
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }

    // Firebase token verification errors
    if (error.code === 'auth/id-token-expired') {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
      return next(new ApiError(401, 'Invalid token. Please login again.'));
    }

    return next(new ApiError(401, 'Authentication failed.'));
  }
};

export default authenticate;
