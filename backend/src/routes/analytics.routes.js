import express from 'express';
import {
  trackPageView,
  trackCTAClick,
  getDashboardAnalytics,
  getPropertyAnalytics,
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes (for tracking)
router.post('/pageview', trackPageView);
router.post('/cta', trackCTAClick);

// Admin routes (protected)
router.get('/admin', protect, getDashboardAnalytics);
router.get('/admin/:propertyId', protect, getPropertyAnalytics);

export default router;