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
  previewPropertyBySlug,
  assignTelecallers,
  toggleDistributeLeads,
} from '../controllers/property.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes - specific routes first (before parameterized routes)
router.get('/', getPublicProperties);
router.get('/featured', getFeaturedProperties);

// Admin routes (protected) - must come before /:slug
router.get('/admin/all', protect, getAdminProperties);
router.get('/admin/:id', protect, getAdminProperty);
router.post('/admin', protect, createProperty);
router.put('/admin/:id', protect, updateProperty);
router.delete('/admin/:id', protect, deleteProperty);
router.put('/admin/:id/status', protect, updatePropertyStatus);
router.put('/admin/:id/featured', protect, toggleFeatured);
router.put('/admin/:id/telecallers', protect, assignTelecallers);
router.put('/admin/:id/distribute-leads', protect, toggleDistributeLeads);

// Preview route for admins (can view draft properties)
router.get('/preview/:slug', protect, previewPropertyBySlug);

// Public route - parameterized route must be last
router.get('/:slug', getPropertyBySlug);

export default router;