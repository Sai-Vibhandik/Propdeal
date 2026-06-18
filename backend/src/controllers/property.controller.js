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

    // Price range filter
    // User's budget: minPrice to maxPrice (in rupees)
    // Property's price: priceRange.min/max with minUnit/maxUnit ('lac' or 'cr')
    // Convert property prices to rupees for comparison
    // 1 lac = 100000, 1 cr = 10000000
    if (minPrice || maxPrice) {
      // Convert property price to absolute rupees
      const convertToRupees = (field, unitField) => ({
        $multiply: [
          { $ifNull: [`$${field}`, 0] },
          {
            $cond: {
              if: { $eq: [`$${unitField}`, 'cr'] },
              then: 10000000,
              else: 100000
            }
          }
        ]
      });

      // Get property min and max prices in rupees
      const propertyMinPrice = convertToRupees('priceRange.min', 'priceRange.minUnit');
      const propertyMaxPrice = convertToRupees('priceRange.max', 'priceRange.maxUnit');

      // Build price filter using $expr (required for aggregation operators in query)
      if (minPrice && maxPrice) {
        // User has a budget range: show properties that have overlap
        // Property's min <= user's max AND property's max >= user's min
        query.$expr = query.$expr || { $and: [] };
        query.$expr.$and = query.$expr.$and || [];
        query.$expr.$and.push(
          { $lte: [propertyMinPrice, Number(maxPrice)] },
          { $gte: [propertyMaxPrice, Number(minPrice)] }
        );
      } else if (maxPrice) {
        // User sets only max budget (e.g., "Under ₹50 Lac")
        // Show properties where starting price is within budget
        query.$expr = { $lte: [propertyMinPrice, Number(maxPrice)] };
      } else if (minPrice) {
        // User sets only min budget (e.g., "Above ₹5 Cr")
        // Show properties where max price is at least the user's min
        query.$expr = { $gte: [propertyMaxPrice, Number(minPrice)] };
      }
    }

    // Search filter (searches name, builder, and city)
    if (req.query.search) {
      query.$or = [
        { name: new RegExp(req.query.search, 'i') },
        { builder: new RegExp(req.query.search, 'i') },
        { 'address.city': new RegExp(req.query.search, 'i') },
        { 'address.locality': new RegExp(req.query.search, 'i') },
      ];
    }

    // Check if sorting by price (need aggregation for unit conversion)
    const isPriceSort = sort === 'priceRange.min' || sort === '-priceRange.min' || sort === 'price-low' || sort === 'price-high';

    let properties, total;

    if (isPriceSort) {
      // Use aggregation for price sorting (convert units to rupees)
      const sortDirection = (sort === '-priceRange.min' || sort === 'price-high') ? -1 : 1;

      const pipeline = [
        { $match: query },
        {
          $addFields: {
            // Convert price to rupees for sorting
            priceMinRupees: {
              $multiply: [
                { $ifNull: ['$priceRange.min', 0] },
                {
                  $cond: {
                    if: { $eq: ['$priceRange.minUnit', 'cr'] },
                    then: 10000000,
                    else: 100000
                  }
                }
              ]
            }
          }
        },
        { $sort: { priceMinRupees: sortDirection } },
        { $skip: (page - 1) * limit },
        { $limit: Number(limit) }
      ];

      properties = await Property.aggregate(pipeline);

      // Populate createdBy
      await Property.populate(properties, { path: 'createdBy', select: 'name' });

      // Get total count
      const countResult = await Property.aggregate([
        { $match: query },
        { $count: 'total' }
      ]);
      total = countResult.length > 0 ? countResult[0].total : 0;
    } else {
      // Regular find for non-price sorting
      properties = await Property.find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('createdBy', 'name');

      total = await Property.countDocuments(query);
    }

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

    // Return property with embedded media and content
    // Media is stored directly on property (heroImage, gallery, floorPlans)
    // Content is stored in generatedContent field
    res.json({
      success: true,
      data: {
        property,
        media: [], // Media is embedded in property document
        content: [], // Content is embedded in property.generatedContent
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

// @desc    Preview property by slug (admin only - can view drafts)
// @route   GET /api/properties/preview/:slug
// @access  Private
export const previewPropertyBySlug = async (req, res) => {
  try {
    const property = await Property.findOne({
      slug: req.params.slug,
    }).populate('createdBy', 'name');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Return property with embedded media and content
    res.json({
      success: true,
      data: {
        property,
        media: [], // Media is embedded in property document
        content: [], // Content is embedded in property.generatedContent
      },
    });
  } catch (error) {
    console.error('Preview property error:', error);
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
      .populate('createdBy', 'name')
      .populate('assignedTelecallers', 'name email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Return property with embedded media and content
    res.json({
      success: true,
      data: {
        property,
        media: [], // Media is embedded in property document
        content: [], // Content is embedded in property.generatedContent
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

    // Validate required fields
    const requiredFields = ['name', 'builder', 'propertyType'];
    const addressFields = ['address.city'];

    const missingFields = [];

    requiredFields.forEach(field => {
      if (!propertyData[field]) {
        missingFields.push(field);
      }
    });

    addressFields.forEach(field => {
      const parts = field.split('.');
      let value = propertyData;
      for (const part of parts) {
        value = value?.[part];
      }
      if (!value) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    // Debug: Log nearbyPlaces type and value
    console.log('=== nearbyPlaces Debug ===');
    console.log('Type:', typeof propertyData.nearbyPlaces);
    console.log('Is Array:', Array.isArray(propertyData.nearbyPlaces));
    if (propertyData.nearbyPlaces) {
      console.log('Value (first 500 chars):', JSON.stringify(propertyData.nearbyPlaces).substring(0, 500));
      if (Array.isArray(propertyData.nearbyPlaces) && propertyData.nearbyPlaces.length > 0) {
        console.log('First element:', propertyData.nearbyPlaces[0]);
        console.log('First element type:', typeof propertyData.nearbyPlaces[0]);
      }
    }

    // Fix: If nearbyPlaces is a string, try to parse it
    if (propertyData.nearbyPlaces && typeof propertyData.nearbyPlaces === 'string') {
      console.log('WARNING: nearbyPlaces is a string, attempting to parse...');
      try {
        // Try JSON parse first
        propertyData.nearbyPlaces = JSON.parse(propertyData.nearbyPlaces);
        console.log('Successfully parsed nearbyPlaces as JSON');
      } catch (e) {
        console.log('JSON parse failed, setting nearbyPlaces to empty array');
        propertyData.nearbyPlaces = [];
      }
    }

    // Validate generatedContent arrays (defensive check)
    if (propertyData.nearbyPlaces && !Array.isArray(propertyData.nearbyPlaces)) {
      console.log('WARNING: nearbyPlaces is not an array, converting to empty array');
      propertyData.nearbyPlaces = [];
    }

    // Clean up nearbyPlaces items - remove 'id' field and ensure proper structure
    if (Array.isArray(propertyData.nearbyPlaces)) {
      propertyData.nearbyPlaces = propertyData.nearbyPlaces.map(place => ({
        name: String(place.name || ''),
        distance: String(place.distance || ''),
        type: String(place.type || 'other'),
        icon: String(place.icon || place.type || 'mapPin'),
      }));
    }

    if (propertyData.generatedContent) {
      const gc = propertyData.generatedContent;

      // Ensure arrays are valid
      if (gc.overview?.keyPoints && !Array.isArray(gc.overview.keyPoints)) {
        gc.overview.keyPoints = [];
      }
      if (gc.investment?.benefits && !Array.isArray(gc.investment.benefits)) {
        gc.investment.benefits = [];
      }
      if (gc.seo?.keywords && !Array.isArray(gc.seo.keywords)) {
        gc.seo.keywords = [];
      }
      if (gc.highlights && !Array.isArray(gc.highlights)) {
        gc.highlights = [];
      }
      if (gc.faq && !Array.isArray(gc.faq)) {
        gc.faq = [];
      }
    }

    // Generate unique slug
    propertyData.slug = await generateUniqueSlug(Property, propertyData.name);
    propertyData.createdBy = req.user._id;

    // Extract nearbyPlaces to set separately (workaround for Mongoose casting issue)
    const nearbyPlacesData = propertyData.nearbyPlaces;
    delete propertyData.nearbyPlaces;

    // Create property without nearbyPlaces
    const property = new Property(propertyData);

    // Set nearbyPlaces explicitly as a plain array of plain objects
    if (nearbyPlacesData && Array.isArray(nearbyPlacesData)) {
      property.nearbyPlaces = nearbyPlacesData.map(p => ({
        name: String(p.name || ''),
        distance: String(p.distance || ''),
        type: String(p.type || 'other'),
        icon: String(p.icon || p.type || 'mapPin'),
      }));
    }

    await property.save();

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Create property error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A property with this name already exists',
      });
    }

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

    // Simple cleanup for arrays
    if (req.body.nearbyPlaces && !Array.isArray(req.body.nearbyPlaces)) {
      req.body.nearbyPlaces = [];
    }

    if (req.body.generatedContent) {
      const gc = req.body.generatedContent;
      if (gc.overview && !Array.isArray(gc.overview.keyPoints)) {
        gc.overview.keyPoints = [];
      }
      if (gc.investment && !Array.isArray(gc.investment.benefits)) {
        gc.investment.benefits = [];
      }
      if (gc.seo && !Array.isArray(gc.seo.keywords)) {
        gc.seo.keywords = [];
      }
      if (!Array.isArray(gc.highlights)) {
        gc.highlights = [];
      }
      if (!Array.isArray(gc.faq)) {
        gc.faq = [];
      }
    }

    // Always remove telecaller-related fields from update
    // These are managed via dedicated endpoints (/telecallers, /distribute-leads)
    // and should never be overwritten by the property update
    delete req.body.assignedTelecallers;
    delete req.body.distributeLeads;
    delete req.body.lastAssignedIndex;

    // Use $set to only update provided fields, preserving others
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
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

// @desc    Assign telecallers to property
// @route   PUT /api/admin/properties/:id/telecallers
// @access  Private (Admin only)
export const assignTelecallers = async (req, res) => {
  try {
    const { telecallerIds, distributeLeads } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.assignedTelecallers = telecallerIds || [];
    if (typeof distributeLeads === 'boolean') {
      property.distributeLeads = distributeLeads;
    }

    await property.save();

    // Return with populated telecallers
    const updatedProperty = await Property.findById(req.params.id)
      .populate('assignedTelecallers', 'name email phone');

    res.json({
      success: true,
      data: updatedProperty,
    });
  } catch (error) {
    console.error('Assign telecallers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Toggle lead distribution for property
// @route   PUT /api/admin/properties/:id/distribute-leads
// @access  Private (Admin only)
export const toggleDistributeLeads = async (req, res) => {
  try {
    const { enabled } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.distributeLeads = enabled;
    await property.save();

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Toggle distribute leads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};