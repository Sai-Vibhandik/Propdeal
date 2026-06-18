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
    enum: ['homepage', 'property-page', 'cta-price', 'cta-visit', 'cta-brochure', 'cta-callback', 'cta-amenities', 'cta-plans', 'cta-gallery', 'cta-video', 'contact-page', 'contact-section'],
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