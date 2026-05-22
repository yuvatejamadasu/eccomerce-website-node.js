import { db, auth } from '../config/firebase.js';
import { COLLECTIONS, USER_ROLES } from '../utils/constants.js';
import ApiError from '../utils/ApiError.js';
import admin from 'firebase-admin';

const usersRef = db.collection(COLLECTIONS.USERS);

/**
 * Create a user profile document in Firestore after Firebase Auth signup.
 */
export const createUserProfile = async (uid, { name, email }) => {
  const existingDoc = await usersRef.doc(uid).get();
  if (existingDoc.exists) {
    throw new ApiError(409, 'User profile already exists.');
  }

  const userData = {
    name,
    email,
    role: USER_ROLES.USER,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await usersRef.doc(uid).set(userData);
  return { uid, ...userData };
};

/**
 * Get user profile by UID.
 */
export const getUserProfile = async (uid) => {
  const doc = await usersRef.doc(uid).get();
  if (!doc.exists) {
    throw new ApiError(404, 'User profile not found.');
  }
  return { uid: doc.id, ...doc.data() };
};

/**
 * Update user profile fields.
 */
export const updateUserProfile = async (uid, updates) => {
  const doc = await usersRef.doc(uid).get();
  if (!doc.exists) {
    throw new ApiError(404, 'User profile not found.');
  }

  const allowedFields = ['name'];
  const sanitized = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitized[field] = updates[field];
    }
  }

  if (Object.keys(sanitized).length === 0) {
    throw new ApiError(400, 'No valid fields to update.');
  }

  sanitized.updatedAt = admin.firestore.FieldValue.serverTimestamp();
  await usersRef.doc(uid).update(sanitized);

  const updated = await usersRef.doc(uid).get();
  return { uid: updated.id, ...updated.data() };
};

/**
 * Log in a user.
 * In development, returns a mock token.
 * In production, uses Firebase Auth REST API to sign in.
 */
export const loginUser = async (email, password) => {
  // 1. Check if user exists in Firebase Auth
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Firebase auth.getUserByEmail failed, falling back to Firestore search or mock user in development:', error.message);
      
      const usersSnapshot = await usersRef.where('email', '==', email).limit(1).get();
      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        userRecord = {
          uid: userDoc.id,
          email: email,
          displayName: userDoc.data().name || 'Dev User',
        };
      } else {
        userRecord = {
          uid: 'mock-uid-' + email.split('@')[0],
          email: email,
          displayName: 'Mock Dev User',
        };
      }
    } else {
      if (error.code === 'auth/user-not-found') {
        throw new ApiError(404, 'User not found. Please register first.');
      }
      throw error;
    }
  }

  // 2. Fetch user profile from Firestore to make sure they have a profile
  let userProfile;
  const userDoc = await usersRef.doc(userRecord.uid).get();
  if (!userDoc.exists) {
    if (process.env.NODE_ENV === 'development') {
      const userData = {
        name: userRecord.displayName || 'Dev User',
        email: userRecord.email,
        role: userRecord.uid === 'admin' ? USER_ROLES.ADMIN : USER_ROLES.USER,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await usersRef.doc(userRecord.uid).set(userData);
      userProfile = userData;
    } else {
      throw new ApiError(404, 'User profile not found. Please register first.');
    }
  } else {
    userProfile = userDoc.data();
  }

  // 3. Authenticate / generate token
  let token;
  if (process.env.NODE_ENV === 'development') {
    token = `dev-token-${userRecord.uid}`;
  } else {
    if (process.env.FIREBASE_API_KEY) {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new ApiError(400, data.error?.message || 'Authentication failed.');
      }
      token = data.idToken;
    } else {
      throw new ApiError(
        501,
        'Credentials-based login on the server is not configured in production. Please set FIREBASE_API_KEY.'
      );
    }
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    name: userProfile.name || userRecord.displayName || '',
    role: userProfile.role || 'user',
    token,
  };
};

/**
 * Sign up a new user.
 * Creates a Firebase Auth user + Firestore profile via Admin SDK,
 * then returns a token so the client is immediately authenticated.
 */
export const signupUser = async (name, email, password) => {
  // 1. Create Firebase Auth user
  let userRecord;
  try {
    userRecord = await auth.createUser({ email, password, displayName: name });
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      throw new ApiError(409, 'Email already registered. Please login instead.');
    }
    throw error;
  }

  // 2. Create Firestore profile
  const userData = {
    name,
    email,
    role: USER_ROLES.USER,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await usersRef.doc(userRecord.uid).set(userData);

  // 3. Generate token
  let token;
  if (process.env.NODE_ENV === 'development') {
    token = `dev-token-${userRecord.uid}`;
  } else if (process.env.FIREBASE_API_KEY) {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new ApiError(400, data.error?.message || 'Sign-in failed after signup.');
    }
    token = data.idToken;
  } else {
    throw new ApiError(501, 'FIREBASE_API_KEY not set. Cannot issue token for production signup.');
  }

  return {
    uid: userRecord.uid,
    email: userRecord.email,
    name,
    role: USER_ROLES.USER,
    token,
  };
};
