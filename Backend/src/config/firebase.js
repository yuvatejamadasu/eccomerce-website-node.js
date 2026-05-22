import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Ensure .env is loaded even when this module is the first to initialise
dotenv.config();

/**
 * Initialize Firebase Admin SDK.
 * Supports two config methods:
 *   1. Service account JSON file (local development)
 *   2. Individual env vars (cloud deployment)
 */
function initializeFirebase() {
  // Already initialized — return existing app
  if (admin.apps.length > 0) {
    return admin;
  }

  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    // Method 1: JSON key file
    const filePath = resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const serviceAccount = JSON.parse(readFileSync(filePath, 'utf-8'));
    credential = admin.credential.cert(serviceAccount);
  } else if (process.env.FIREBASE_PROJECT_ID) {
    // Method 2: Individual env vars
    credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
  } else {
    throw new Error(
      'Firebase credentials not found. Set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_PROJECT_ID in your .env file.'
    );
  }

  admin.initializeApp({ credential });
  console.log('✅ Firebase Admin SDK initialized');

  return admin;
}

// Initialize on import
initializeFirebase();

// Export pre-configured instances
export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
