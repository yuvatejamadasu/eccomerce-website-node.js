import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import authenticate from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// POST /api/auth/register — called by frontend after Firebase client-side signup
router.post('/register', validate(['uid', 'name', 'email']), authController.register);

// POST /api/auth/signup — creates Firebase Auth user + profile in one step
router.post('/signup', validate(['name', 'email', 'password']), authController.signup);

// POST /api/auth/login — authenticate user and return token
router.post('/login', validate(['email']), authController.login);

// GET /api/auth/profile — get current user's profile
router.get('/profile', authenticate, authController.getProfile);

// PUT /api/auth/profile — update current user's profile
router.put('/profile', authenticate, authController.updateProfile);

export default router;
