import express from 'express';
import {
  uploadMedia,
  getPropertyMedia,
  reorderMedia,
  updateMedia,
  deleteMediaById,
} from '../controllers/media.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadSingleImage, uploadSingleVideo, uploadSingleDocument, uploadMultipleImages } from '../middleware/upload.middleware.js';

const router = express.Router();

// All media routes are protected
router.use(protect);

// Upload routes
router.post('/upload/image', uploadSingleImage, (req, res) => {
  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.public_id,
      width: req.file.width,
      height: req.file.height,
    },
  });
});

router.post('/upload/video', uploadSingleVideo, (req, res) => {
  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.public_id,
      duration: req.file.duration,
    },
  });
});

router.post('/upload/document', uploadSingleDocument, (req, res) => {
  res.json({
    success: true,
    data: {
      url: req.file.path,
      publicId: req.file.public_id,
    },
  });
});

router.post('/upload/images', uploadMultipleImages, (req, res) => {
  const files = req.files.map((file) => ({
    url: file.path,
    publicId: file.public_id,
    width: file.width,
    height: file.height,
  }));
  res.json({
    success: true,
    data: files,
  });
});

// Property media CRUD
router.post('/', uploadMedia);
router.get('/property/:propertyId', getPropertyMedia);
router.put('/reorder', reorderMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMediaById);

export default router;