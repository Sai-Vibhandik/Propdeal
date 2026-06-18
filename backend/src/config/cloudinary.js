import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables first (needed for ES modules)
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Log configuration status
if (cloudName && apiKey && apiSecret) {
  console.log('✓ Cloudinary configured:', { cloud_name: cloudName });
} else {
  console.warn('⚠ Cloudinary not configured - image uploads will fail');
}

export const uploadImage = async (file, folder = 'properties') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `property-platform/${folder}`,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const uploadVideo = async (file, folder = 'properties') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `property-platform/${folder}`,
      resource_type: 'video',
      transformation: [
        { quality: 'auto:good' },
      ],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      thumbnailUrl: result.secure_url.replace('.mp4', '.jpg'),
      duration: result.duration,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    throw new Error(`Video upload failed: ${error.message}`);
  }
};

export const uploadDocument = async (file, folder = 'documents') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `property-platform/${folder}`,
      resource_type: 'raw',
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    throw new Error(`Document upload failed: ${error.message}`);
  }
};

export const deleteMedia = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Media deletion failed: ${error.message}`);
  }
};

export default cloudinary;