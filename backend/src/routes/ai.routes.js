import express from 'express';
import {
  getAIStatus,
  getProviders,
  generateSectionContent,
  saveContent,
  getPropertyContent,
} from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All AI routes are protected
router.use(protect);

router.get('/status', getAIStatus);
router.get('/providers', getProviders);
router.post('/generate/:section', generateSectionContent);
router.put('/content/:propertyId/:section', saveContent);
router.get('/content/:propertyId', getPropertyContent);

export default router;