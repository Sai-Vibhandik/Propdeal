import express from 'express';
import {
  submitEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  addEnquiryNote,
  assignEnquiry,
  setEnquiryFollowUp,
  exportEnquiries,
  deleteEnquiry,
} from '../controllers/enquiry.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/', submitEnquiry);

// Admin routes (protected)
router.get('/admin', protect, getEnquiries);
router.get('/admin/export', protect, exportEnquiries);
router.get('/admin/:id', protect, getEnquiry);
router.put('/admin/:id/status', protect, updateEnquiryStatus);
router.post('/admin/:id/notes', protect, addEnquiryNote);
router.put('/admin/:id/assign', protect, assignEnquiry);
router.put('/admin/:id/followup', protect, setEnquiryFollowUp);
router.delete('/admin/:id', protect, deleteEnquiry);

export default router;