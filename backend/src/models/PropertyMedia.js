import mongoose from 'mongoose';

const propertyMediaSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true,
  },
  section: {
    type: String,
    enum: ['hero', 'overview', 'amenities', 'floorPlans', 'location', 'gallery', 'videoTour', 'builderInfo', 'brochure'],
    required: true,
  },
  type: {
    type: String,
    enum: ['image', 'video', 'document'],
    required: true,
  },
  title: String,
  description: String,
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  thumbnailUrl: String,
  order: {
    type: Number,
    default: 0,
  },
  metadata: {
    size: Number,
    format: String,
    width: Number,
    height: Number,
    duration: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
propertyMediaSchema.index({ propertyId: 1, section: 1, order: 1 });

export default mongoose.model('PropertyMedia', propertyMediaSchema);