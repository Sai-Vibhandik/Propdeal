import express from 'express';
import {
  uploadMedia,
  getPropertyMedia,
  reorderMedia,
  updateMedia,
  deleteMediaById,
} from '../controllers/media.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import {
  uploadSingleImage,
  uploadSingleVideo,
  uploadSingleDocument,
  uploadMultipleImages,
} from '../middleware/upload.local.js';

const router = express.Router();

// All media routes are protected
router.use(protect);

// Upload single image
router.post('/upload/image', (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload image',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Return the file info with URL path
    res.json({
      success: true,
      data: {
        url: `/uploads/images/${req.file.filename}`,
        publicId: req.file.filename,
        width: null, // Would need image processing library to get dimensions
        height: null,
      },
    });
  });
});

// Upload single video
router.post('/upload/video', (req, res, next) => {
  uploadSingleVideo(req, res, (err) => {
    if (err) {
      console.error('Video upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload video',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.json({
      success: true,
      data: {
        url: `/uploads/videos/${req.file.filename}`,
        publicId: req.file.filename,
        duration: null, // Would need ffprobe to get duration
      },
    });
  });
});

// Upload single document
router.post('/upload/document', (req, res, next) => {
  uploadSingleDocument(req, res, (err) => {
    if (err) {
      console.error('Document upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload document',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    res.json({
      success: true,
      data: {
        url: `/uploads/documents/${req.file.filename}`,
        publicId: req.file.filename,
      },
    });
  });
});

// Upload multiple images
router.post('/upload/images', (req, res, next) => {
  uploadMultipleImages(req, res, (err) => {
    if (err) {
      console.error('Images upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Failed to upload images',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const files = req.files.map((file) => ({
      url: `/uploads/images/${file.filename}`,
      publicId: file.filename,
      width: null,
      height: null,
    }));

    res.json({
      success: true,
      data: files,
    });
  });
});

// Property media CRUD
router.post('/', uploadMedia);
router.get('/property/:propertyId', getPropertyMedia);
router.put('/reorder', reorderMedia);
router.put('/:id', updateMedia);
router.delete('/:id', deleteMediaById);

export default router;