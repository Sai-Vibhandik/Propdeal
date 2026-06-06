import express from 'express';
import {
  getPublicProperties,
  getFeaturedProperties,
  getPropertyBySlug,
  getAdminProperties,
  getAdminProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  toggleFeatured,
} from '../controllers/property.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublicProperties);
router.get('/featured', getFeaturedProperties);
router.get('/:slug', getPropertyBySlug);

// Admin routes (protected)
router.get('/admin/all', protect, getAdminProperties);
router.post('/admin', protect, createProperty);
router.get('/admin/:id', protect, getAdminProperty);
router.put('/admin/:id', protect, updateProperty);
router.delete('/admin/:id', protect, deleteProperty);
router.put('/admin/:id/status', protect, updatePropertyStatus);
router.put('/admin/:id/featured', protect, toggleFeatured);

export default router;