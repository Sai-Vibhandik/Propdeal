import mongoose from 'mongoose';

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

  // Property Classification
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'plot', 'row-house', 'commercial', 'penthouse'],
    required: true,
  },
  category: {
    type: String,
    enum: ['under-construction', 'ready-to-move', 'new-launch', 'pre-launch'],
    required: true,
  },
  configurations: [{
    type: String,
  }],
  possessionDate: Date,
  totalUnits: Number,

  // Pricing
  priceRange: {
    min: Number,
    max: Number,
  },
  priceUnit: {
    type: String,
    enum: ['lac', 'cr'],
    default: 'lac',
  },
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
    hero: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 1 } },
    overview: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 2 } },
    highlights: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 3 } },
    amenities: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 4 } },
    pricing: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 5 } },
    floorPlans: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 6 } },
    location: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 7 } },
    gallery: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 8 } },
    videoTour: { enabled: { type: Boolean, default: false }, order: { type: Number, default: 9 } },
    builderInfo: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 10 } },
    investment: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 11 } },
    faq: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 12 } },
    contact: { enabled: { type: Boolean, default: true }, order: { type: Number, default: 13 } },
  },

  // Theme Settings
  theme: {
    primaryColor: { type: String, default: '#1e40af' },
    accentColor: { type: String, default: '#d4af37' },
    heroStyle: { type: String, enum: ['full-screen', 'split', 'video'], default: 'full-screen' },
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
propertySchema.index({ slug: 1 });

// Generate slug from name
propertySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

export default mongoose.model('Property', propertySchema);