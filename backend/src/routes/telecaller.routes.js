import express from 'express';
import {
  getTelecallers,
  createTelecaller,
  updateTelecaller,
  deleteTelecaller,
  resetTelecallerPassword,
  getTelecallerProperties,
  getTelecallerLeads,
  updateTelecallerLeadStatus,
  getTelecallerEnquiries,
  updateTelecallerEnquiryStatus,
  exportTelecallerLeads,
  exportTelecallerEnquiries,
} from '../controllers/telecaller.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin routes for managing telecallers
router.get('/', protect, authorize('admin', 'superadmin'), getTelecallers);
router.post('/', protect, authorize('admin', 'superadmin'), createTelecaller);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateTelecaller);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteTelecaller);
router.put('/:id/reset-password', protect, authorize('admin', 'superadmin'), resetTelecallerPassword);

// Telecaller routes (for their own dashboard)
router.get('/my-properties', protect, authorize('telecaller'), getTelecallerProperties);
router.get('/my-leads/export', protect, authorize('telecaller'), exportTelecallerLeads);
router.get('/my-leads', protect, authorize('telecaller'), getTelecallerLeads);
router.put('/my-leads/:id/status', protect, authorize('telecaller'), updateTelecallerLeadStatus);
router.get('/my-enquiries/export', protect, authorize('telecaller'), exportTelecallerEnquiries);
router.get('/my-enquiries', protect, authorize('telecaller'), getTelecallerEnquiries);
router.put('/my-enquiries/:id/status', protect, authorize('telecaller'), updateTelecallerEnquiryStatus);

export default router;