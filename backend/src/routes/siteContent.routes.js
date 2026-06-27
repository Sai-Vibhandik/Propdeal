import express from 'express';
import {
  getSiteContent,
  getAdminSiteContent,
  updateHeroSlides,
  updateWhyUs,
  updateCities,
  updateFeaturedBuilders,
  updateTestimonials,
  updateFAQs,
  updateContact,
  updateSocial,
  updateSEO,
  updateBranding,
  updateFooter,
  updateFooterLinks,
  updateFooterSocialLinks,
  updatePrivacyPolicy,
  updateTermsOfService,
  resetSiteContent,
} from '../controllers/siteContent.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.get('/', getSiteContent);

// Admin routes
router.get('/admin', protect, authorize('admin', 'superadmin'), getAdminSiteContent);
router.put('/admin/hero-slides', protect, authorize('admin', 'superadmin'), updateHeroSlides);
router.put('/admin/why-us', protect, authorize('admin', 'superadmin'), updateWhyUs);
router.put('/admin/cities', protect, authorize('admin', 'superadmin'), updateCities);
router.put('/admin/featured-builders', protect, authorize('admin', 'superadmin'), updateFeaturedBuilders);
router.put('/admin/testimonials', protect, authorize('admin', 'superadmin'), updateTestimonials);
router.put('/admin/faqs', protect, authorize('admin', 'superadmin'), updateFAQs);
router.put('/admin/contact', protect, authorize('admin', 'superadmin'), updateContact);
router.put('/admin/social', protect, authorize('admin', 'superadmin'), updateSocial);
router.put('/admin/seo', protect, authorize('admin', 'superadmin'), updateSEO);
router.put('/admin/branding', protect, authorize('admin', 'superadmin'), updateBranding);
router.put('/admin/footer', protect, authorize('admin', 'superadmin'), updateFooter);
router.put('/admin/footer-links', protect, authorize('admin', 'superadmin'), updateFooterLinks);
router.put('/admin/footer-social-links', protect, authorize('admin', 'superadmin'), updateFooterSocialLinks);
router.put('/admin/privacy-policy', protect, authorize('admin', 'superadmin'), updatePrivacyPolicy);
router.put('/admin/terms-of-service', protect, authorize('admin', 'superadmin'), updateTermsOfService);
router.post('/admin/reset', protect, authorize('admin', 'superadmin'), resetSiteContent);

export default router;