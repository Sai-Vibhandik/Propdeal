import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    index: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // Page Metrics
  pageViews: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
  avgTimeOnPage: Number,

  // CTA Tracking - Using Map to allow dynamic CTA types
  ctaClicks: {
    type: Map,
    of: Number,
    default: {},
  },

  // Lead Tracking
  leadsGenerated: {
    type: Number,
    default: 0,
  },

  // Source Breakdown
  trafficSources: {
    direct: { type: Number, default: 0 },
    organic: { type: Number, default: 0 },
    referral: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
  },

  // Device Breakdown
  devices: {
    desktop: { type: Number, default: 0 },
    mobile: { type: Number, default: 0 },
    tablet: { type: Number, default: 0 },
  },
}, {
  timestamps: true,
});

// Index for date-based queries
analyticsSchema.index({ propertyId: 1, date: -1 });
analyticsSchema.index({ date: -1 });

export default mongoose.model('Analytics', analyticsSchema);