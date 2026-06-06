import { PropertyMedia } from '../models/index.js';
import { uploadImage, uploadVideo, uploadDocument, deleteMedia } from '../config/cloudinary.js';

// @desc    Upload media
// @route   POST /api/admin/media/upload
// @access  Private
export const uploadMedia = async (req, res) => {
  try {
    const { propertyId, section, type, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Get the order for this media
    const existingCount = await PropertyMedia.countDocuments({
      propertyId,
      section,
    });

    const media = await PropertyMedia.create({
      propertyId,
      section,
      type,
      title,
      description,
      cloudinaryUrl: req.file.path || req.file.secure_url,
      cloudinaryPublicId: req.file.public_id,
      thumbnailUrl: req.file.thumbnail_url,
      order: existingCount,
      metadata: {
        size: req.file.size,
        format: req.file.format,
        width: req.file.width,
        height: req.file.height,
        duration: req.file.duration,
      },
    });

    res.status(201).json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all media for a property
// @route   GET /api/admin/media/property/:propertyId
// @access  Private
export const getPropertyMedia = async (req, res) => {
  try {
    const media = await PropertyMedia.find({
      propertyId: req.params.propertyId,
    }).sort({ section: 1, order: 1 });

    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Get property media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update media order
// @route   PUT /api/admin/media/reorder
// @access  Private
export const reorderMedia = async (req, res) => {
  try {
    const { items } = req.body;

    // items is array of { id, order }
    const updatePromises = items.map((item) =>
      PropertyMedia.findByIdAndUpdate(item.id, { order: item.order }, { new: true })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Media reordered successfully',
    });
  } catch (error) {
    console.error('Reorder media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update media details
// @route   PUT /api/admin/media/:id
// @access  Private
export const updateMedia = async (req, res) => {
  try {
    const { title, description } = req.body;

    const media = await PropertyMedia.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found',
      });
    }

    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete media
// @route   DELETE /api/admin/media/:id
// @access  Private
export const deleteMediaById = async (req, res) => {
  try {
    const media = await PropertyMedia.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: 'Media not found',
      });
    }

    // Delete from Cloudinary
    await deleteMedia(media.cloudinaryPublicId);

    // Delete from database
    await media.deleteOne();

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};