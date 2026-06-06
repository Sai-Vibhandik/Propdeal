import { Property, PropertyMedia, GeneratedContent } from '../models/index.js';
import { generateUniqueSlug } from '../utils/slugGenerator.js';

// @desc    Get all published properties (public)
// @route   GET /api/properties
// @access  Public
export const getPublicProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city,
      propertyType,
      category,
      minPrice,
      maxPrice,
      configuration,
      builder,
      sort = '-createdAt',
    } = req.query;

    const query = { status: 'published' };

    // Filters
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (propertyType) query.propertyType = propertyType;
    if (category) query.category = category;
    if (builder) query.builder = new RegExp(builder, 'i');
    if (configuration) query.configurations = { $in: [configuration] };
    if (minPrice || maxPrice) {
      query['priceRange.min'] = {};
      if (minPrice) query['priceRange.min'].$gte = Number(minPrice);
      if (maxPrice) query['priceRange.max'].$lte = Number(maxPrice);
    }

    const properties = await Property.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('createdBy', 'name');

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: 'published',
      featured: true,
    })
      .sort('-createdAt')
      .limit(6)
      .populate('createdBy', 'name');

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    console.error('Get featured properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single property by slug
// @route   GET /api/properties/:slug
// @access  Public
export const getPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({
      slug: req.params.slug,
      status: 'published',
    }).populate('createdBy', 'name');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Get media
    const media = await PropertyMedia.find({ propertyId: property._id })
      .sort({ section: 1, order: 1 });

    // Get generated content
    const content = await GeneratedContent.find({ propertyId: property._id });

    res.json({
      success: true,
      data: {
        property,
        media,
        content,
      },
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get all properties (admin)
// @route   GET /api/admin/properties
// @access  Private
export const getAdminProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      search,
      sort = '-createdAt',
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { builder: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') },
      ];
    }

    const properties = await Property.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('createdBy', 'name');

    const total = await Property.countDocuments(query);

    res.json({
      success: true,
      data: properties,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get admin properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single property (admin)
// @route   GET /api/admin/properties/:id
// @access  Private
export const getAdminProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    const media = await PropertyMedia.find({ propertyId: property._id })
      .sort({ section: 1, order: 1 });

    const content = await GeneratedContent.find({ propertyId: property._id });

    res.json({
      success: true,
      data: {
        property,
        media,
        content,
      },
    });
  } catch (error) {
    console.error('Get admin property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Create property
// @route   POST /api/admin/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    const propertyData = req.body;

    // Generate unique slug
    propertyData.slug = await generateUniqueSlug(Property, propertyData.name);
    propertyData.createdBy = req.user._id;

    const property = await Property.create(propertyData);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update property
// @route   PUT /api/admin/properties/:id
// @access  Private
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Update slug if name changed
    if (req.body.name && req.body.name !== property.name) {
      req.body.slug = await generateUniqueSlug(Property, req.body.name, property._id);
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Delete associated media
    await PropertyMedia.deleteMany({ propertyId: property._id });

    // Delete associated content
    await GeneratedContent.deleteMany({ propertyId: property._id });

    // Delete property
    await property.deleteOne();

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update property status
// @route   PUT /api/admin/properties/:id/status
// @access  Private
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.status = status;
    if (status === 'published') {
      property.publishedAt = new Date();
    }

    await property.save();

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Toggle featured status
// @route   PUT /api/admin/properties/:id/featured
// @access  Private
export const toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.featured = !property.featured;
    await property.save();

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};