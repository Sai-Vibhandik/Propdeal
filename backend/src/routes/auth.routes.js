import express from 'express';
import { login, getMe, register, updateProfile, changePassword, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin only (superadmin)
router.post('/register', protect, authorize('superadmin'), register);

export default router;