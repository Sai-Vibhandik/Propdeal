import mongoose from 'mongoose';

// Delete existing model if it exists (prevents caching issues)
if (mongoose.models.Property) {
  delete mongoose.models.Property;
}

// Define subdocument schema for nearby places
const nearbyPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  distance: { type: String, required: true },
  type: { type: String, default: 'other' },
  icon: { type: String, default: 'mapPin' },
}, { _id: false });

const propertySchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  builder: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false,
  },

  // Location Details
  address: {
    fullAddress: String,
    locality: String,
    city: {
      type: String,
      required: true,
    },
    state: String,
    pincode: String,
    landmark: String,
  },
  googleMapUrl: String,
  coordinates: {
    lat: Number,
    lng: Number,
  },
  // Nearby Places (manually entered)
  nearbyPlaces: [nearbyPlaceSchema],

  // Property Classification
  propertyType: {
    type: String,
    enum: [
      // Residential
      'apartment', 'studio', 'duplex', 'penthouse', 'villa', 'row-house', 'builder-floor', 'bungalow', 'farm-house',
      // Land
      'residential-plot', 'commercial-plot', 'agricultural-land',
      // Commercial
      'shop', 'office', 'showroom', 'warehouse',
      // Industrial
      'industrial-shed', 'factory',
      // Legacy types (for backward compatibility)
      'plot', 'commercial',
    ],
    required: true,
  },
  propertyCategory: {
    type: String,
    enum: ['residential', 'land', 'commercial', 'industrial'],
    default: 'residential',
  },
  category: {
    type: String,
    enum: ['under-construction', 'ready-to-move', 'new-launch', 'pre-launch'],
    default: 'under-construction',
  },
  configurations: [{
    type: String,
  }],
  possessionDate: Date,
  totalUnits: Number,

  // Project Area
  totalArea: String, // e.g., "15 Acres", "50,000 sq.ft."
  totalFloors: String, // e.g., "G+14", "Stilt + 18"
  plotFacing: String, // e.g., "north", "east", "north-east"
  builtUpArea: String, // e.g., "20,000 sq.ft." for warehouses/factories

  // Unit Area Range (for apartments/villas)
  unitAreaRange: {
    min: Number, // Minimum area in sq.ft.
    max: Number, // Maximum area in sq.ft.
    unit: { type: String, default: 'sq.ft.' }, // sq.ft., sq.m., etc.
  },

  // Pricing
  priceRange: {
    min: Number,
    max: Number,
    minUnit: {
      type: String,
      enum: ['lac', 'cr'],
      default: 'lac',
    },
    maxUnit: {
      type: String,
      enum: ['lac', 'cr'],
      default: 'cr',
    },
  },
  priceUnit: {
    type: String,
    enum: ['lac', 'cr'],
    default: 'lac',
  },

  // Pricing Plans (Property type aware)
  pricingPlans: [{
    configuration: String,       // "2BHK", "40x60", "Shop", etc.
    size: String,                // "1200 sq.ft.", "2400 sq.yards"
    price: String,               // "₹85 Lac", "₹1.2 Cr"
    priceValue: Number,          // 85 (for calculations)
    priceUnit: String,           // "lac" or "cr"
    unitPlan: {                  // Unit layout (individual unit floor plan)
      url: String,
      publicId: String,
    },
    isCustom: Boolean,           // true if custom configuration
  }],

  // Price Includes (what's included in the price)
  priceIncludes: [{
    type: String,                // "Car Parking", "Clubhouse Membership", etc.
  }],

  // Legacy pricing configurations (deprecated - kept for backwards compatibility)
  pricingConfigurations: [{
    configuration: String,
    price: Number,
    size: String,
    pricePerSqFt: Number,
  }],

  // RERA & Legal
  reraNumber: String,
  reraDetails: {
    projectStatus: String,
    expectedCompletion: Date,
    promoterName: String,
    promoterAddress: String,
  },

  // Section Configuration
  sections: {
    hero: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 1 }, layout: { type: String, default: 'full-screen' } },
    overview: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 2 }, layout: { type: String, default: 'standard' } },
    highlights: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 3 }, layout: { type: String, default: 'cards' } },
    amenities: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 4 }, layout: { type: String, default: 'grid' } },
    pricing: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 5 }, layout: { type: String, default: 'cards' } },
    plans: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 6 }, layout: { type: String, default: 'grid' } },
    location: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 7 }, layout: { type: String, default: 'map-list' } },
    gallery: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 8 }, layout: { type: String, default: 'grid' } },
    videoTour: { enabled: { type: Boolean, default: false }, order: { type: Number, default: 9 }, layout: { type: String, default: 'full-width' } },
    builderInfo: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 10 }, layout: { type: String, default: 'standard' } },
    investment: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 11 }, layout: { type: String, default: 'cards' } },
    faq: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 12 }, layout: { type: String, default: 'accordion' } },
    contact: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 13 }, layout: { type: String, default: 'standard' } },
  },

  // Theme Settings
  theme: {
    primaryColor: { type: String, default: '#1e40af' },
    secondaryColor: { type: String, default: '#d4af37' },
    accentColor: { type: String, default: '#059669' },
    // Extended color controls
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#1e293b' },
    cardBackground: { type: String, default: '#ffffff' },
    // Mode
    darkMode: { type: Boolean, default: false },
    preset: {
      type: String,
      enum: ['classic-blue', 'luxury-gold', 'modern-green', 'bold-red', 'minimal-white', 'elegant-purple', 'warm-earth', 'dark-elegant', 'custom'],
      default: 'classic-blue',
    },
    sectionStyle: {
      type: String,
      enum: ['minimal', 'bordered', 'shadowed'],
      default: 'minimal',
    },
    fontStyle: {
      type: String,
      enum: ['modern', 'classic', 'luxury'],
      default: 'modern',
    },
  },

  // Branding
  branding: {
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    logoPosition: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'left',
    },
    companyName: { type: String, default: '' },
    tagline: { type: String, default: '' },
    showBuilderLogo: { type: Boolean, default: true },
    showReraBadge: { type: Boolean, default: true },
    reraQrCode: { type: String, default: '' },
    reraWebsite: { type: String, default: '' },
    advertiserName: { type: String, default: '' },
    advertiserRegNo: { type: String, default: '' },
    customCtaText: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    email: { type: String, default: '' },
  },

  // Media
  heroImages: [{
    url: String,
    publicId: String,
    title: String,
  }],
  gallery: [{
    url: String,
    publicId: String,
    type: { type: String, default: 'image' },
    title: String,
    width: Number,
    height: Number,
  }],
  floorPlans: [{
    configuration: String,
    size: String,
    price: String,
    image: String,
    publicId: String,
  }],

  // Plans (Master Plan, Floor Plans, Dimension Plans)
  plans: {
    masterPlan: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      title: { type: String, default: 'Master Plan' },
    },
    floorPlans: [{
      url: String,
      publicId: String,
      title: String,
      floorNumber: String, // e.g., "Ground Floor", "1st Floor"
    }],
    dimensionPlans: [{
      url: String,
      publicId: String,
      title: String,
      dimensions: String, // e.g., "30x40", "40x60"
    }],
  },

  videoTour: { type: String, default: '' },

  // Brochure (PDF download)
  brochure: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
    name: { type: String, default: '' },
  },

  // Amenities (manual entry with images)
  amenities: [{
    name: { type: String, required: true },
    image: String,
    publicId: String,
  }],

  // Section Background Images with Layout Options
  sectionBackgrounds: {
    overview: {
      image: { type: String, default: '' },
      layout: {
        type: String,
        enum: ['background', 'split-left', 'split-right', 'none'],
        default: 'background',
      },
    },
    highlights: {
      image: { type: String, default: '' },
      layout: {
        type: String,
        enum: ['background', 'split-left', 'split-right', 'none'],
        default: 'background',
      },
    },
    builderInfo: {
      image: { type: String, default: '' },
      layout: {
        type: String,
        enum: ['background', 'split-left', 'split-right', 'none'],
        default: 'background',
      },
    },
  },

  // AI Generated Content
  generatedContent: {
    hero: {
      headline: String,
      subheadline: String,
      ctaText: String,
      badge: String,
      offers: [{
        icon: String,
        text: String,
        highlight: Boolean,
      }],
      offerValidity: String,
    },
    overview: {
      description: String,
      summary: String,
      keyPoints: [String],
    },
    highlights: [{
      icon: String,
      title: String,
      description: String,
    }],
    location: {
      connectivity: String,
    },
    investment: {
      benefits: [String],
      rentalPotential: String,
      futureGrowth: String,
    },
    builder: {
      aboutBuilder: String,
      stats: [{
        icon: String,
        value: String,
        label: String,
      }],
      keyFacts: [{
        icon: String,
        text: String,
      }],
    },
    faq: [{
      question: String,
      answer: String,
    }],
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },

  // Custom Fields (user-defined additional details)
  customFields: [{
    label: String,  // e.g., "Plot Facing", "Boundary Wall"
    value: String,  // e.g., "East", "Yes"
  }],

  // Telecaller Assignment for Lead Distribution
  assignedTelecallers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  distributeLeads: {
    type: Boolean,
    default: false,
  },
  lastAssignedIndex: {
    type: Number,
    default: 0,
  },

  // Created By
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Timestamps
  publishedAt: Date,
}, {
  timestamps: true,
});

// Indexes for search
propertySchema.index({ name: 'text', builder: 'text', 'address.city': 'text' });
propertySchema.index({ status: 1, featured: 1 });
// Note: slug already has unique: true in schema, no need for separate index

export default mongoose.model('Property', propertySchema);