import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Storage configuration
const createStorage = (resourceType = 'image', folder = 'properties') => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `property-platform/${folder}`,
      resource_type: resourceType,
      transformation: resourceType === 'image'
        ? [{ quality: 'auto:good' }, { fetch_format: 'auto' }]
        : undefined,
    },
  });
};

// Image upload middleware
export const uploadImage = multer({
  storage: createStorage('image', 'images'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

// Video upload middleware
export const uploadVideo = multer({
  storage: createStorage('video', 'videos'),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed'), false);
    }
    cb(null, true);
  },
});

// Document upload middleware
export const uploadDocument = multer({
  storage: createStorage('raw', 'documents'),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF and Word documents are allowed'), false);
    }
    cb(null, true);
  },
});

// Multiple images upload
export const uploadMultipleImages = uploadImage.array('images', 20);

// Single image upload
export const uploadSingleImage = uploadImage.single('image');

// Single video upload
export const uploadSingleVideo = uploadVideo.single('video');

// Single document upload
export const uploadSingleDocument = uploadDocument.single('document');