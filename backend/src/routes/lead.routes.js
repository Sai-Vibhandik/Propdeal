import express from 'express';
import {
  submitLead,
  getLeads,
  getLead,
  updateLeadStatus,
  addLeadNote,
  assignLead,
  setFollowUp,
  exportLeads,
  deleteLead,
} from '../controllers/lead.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/', submitLead);

// Admin routes (protected)
router.get('/admin', protect, getLeads);
router.get('/admin/export', protect, exportLeads);
router.get('/admin/:id', protect, getLead);
router.put('/admin/:id/status', protect, updateLeadStatus);
router.post('/admin/:id/notes', protect, addLeadNote);
router.put('/admin/:id/assign', protect, assignLead);
router.put('/admin/:id/followup', protect, setFollowUp);
router.delete('/admin/:id', protect, deleteLead);

export default router;