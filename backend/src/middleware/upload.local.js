import 'dotenv/config';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory path (create if doesn't exist)
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Created uploads directory:', uploadsDir);
}

// Generate unique filename
const generateFileName = (originalName, prefix = '') => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  return `${prefix}${timestamp}-${randomStr}${ext}`;
};

// Storage configuration for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(uploadsDir, 'images');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

// Storage configuration for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(uploadsDir, 'videos');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

// Storage configuration for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(uploadsDir, 'documents');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

// Storage configuration for any file type (mixed)
const mixedStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (file.mimetype.startsWith('image/')) {
      folder = path.join(uploadsDir, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      folder = path.join(uploadsDir, 'videos');
    } else {
      folder = path.join(uploadsDir, 'documents');
    }
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

// File filters
const imageFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowedMimes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed (mp4, webm, ogg, mov)'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

// Multer upload configurations
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: imageFilter,
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: videoFilter,
});

export const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
  fileFilter: documentFilter,
});

export const uploadMultipleImages = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  fileFilter: imageFilter,
}).array('images', 20);

// Single file uploads
export const uploadSingleImage = uploadImage.single('image');
export const uploadSingleVideo = uploadVideo.single('video');
export const uploadSingleDocument = uploadDocument.single('document');

// Helper function to delete a file
export const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file URL from filename
export const getFileUrl = (filename, type = 'images') => {
  return `/uploads/${type}/${filename}`;
};

// Helper function to get full path from URL
export const getFilePathFromUrl = (url) => {
  if (!url) return null;
  // URL format: /uploads/images/filename.jpg
  const match = url.match(/\/uploads\/(.+)/);
  if (match) {
    return path.join(uploadsDir, match[1]);
  }
  return null;
};

export { uploadsDir };