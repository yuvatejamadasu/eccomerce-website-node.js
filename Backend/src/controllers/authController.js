import catchAsync from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';

/**
 * POST /api/auth/register
 * Create a Firestore profile after client-side Firebase Auth signup.
 */
export const register = catchAsync(async (req, res) => {
  const { uid, name, email } = req.body;

  const user = await authService.createUserProfile(uid, { name, email });

  res.status(201).json({
    success: true,
    message: 'User profile created successfully.',
    data: user,
  });
});

/**
 * GET /api/auth/profile
 * Get the authenticated user's profile.
 */
export const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getUserProfile(req.user.uid);

  res.json({
    success: true,
    data: user,
  });
});

/**
 * PUT /api/auth/profile
 * Update the authenticated user's profile.
 */
export const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateUserProfile(req.user.uid, req.body);

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    data: user,
  });
});

/**
 * POST /api/auth/login
 * Log in a user with email and password.
 */
export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.json({
    success: true,
    message: 'Logged in successfully.',
    data: result,
  });
});

/**
 * POST /api/auth/signup
 * Create a Firebase Auth user + Firestore profile in one step,
 * then return the user data and an auth token.
 */
export const signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.signupUser(name, email, password);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: result,
  });
});
