import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: false, // Optional for homepage leads
    index: true,
  },

  // Contact Info
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: String,

  // Configuration Interest
  configuration: String,
  budget: String,
  preferredContactTime: String,

  // Source Tracking
  source: {
    type: String,
    enum: [
      // Legacy sources
      'homepage', 'property-page', 'contact-page',
      // Get Details buttons
      'cta-hero', 'cta-highlights', 'cta-overview', 'cta-investment', 'cta-navbar', 'cta-sticky',
      // Book Site Visit buttons
      'cta-hero-visit', 'cta-gallery-visit', 'cta-footer-visit', 'cta-video-visit', 'cta-visit',
      // Get Price Details buttons
      'cta-pricing-table', 'cta-pricing-sheet', 'cta-pricing-card', 'cta-price',
      // Other buttons
      'cta-callback', 'cta-faq', 'cta-amenities', 'cta-plans', 'cta-brochure', 'cta-homeloan',
    ],
    default: 'property-page',
  },
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,

  // Status
  status: {
    type: String,
    enum: ['new', 'in-progress', 'converted', 'lost'],
    default: 'new',
  },

  // Notes
  notes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],

  // Follow-up
  nextFollowUp: Date,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
leadSchema.index({ propertyId: 1, status: 1 });
leadSchema.index({ createdAt: -1 });

export default mongoose.model('Lead', leadSchema);