import mongoose from 'mongoose';

const generatedContentSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
    index: true,
  },
  section: {
    type: String,
    required: true,
    enum: ['hero', 'overview', 'highlights', 'location', 'investment', 'faq', 'builder', 'seo'],
  },

  // Hero Content
  hero: {
    headline: String,
    subheadline: String,
    ctaText: String,
    tagline: String,
  },

  // Overview Content
  overview: {
    description: String,
    summary: String,
    keyPoints: [String],
  },

  // Highlights
  highlights: [{
    title: String,
    description: String,
    icon: String,
  }],

  // Location
  location: {
    connectivity: String,
    nearbyPlaces: [{
      name: String,
      distance: String,
      type: String,
    }],
    advantages: [String],
  },

  // Investment
  investment: {
    benefits: [String],
    rentalPotential: String,
    futureGrowth: String,
    whyInvest: String,
  },

  // FAQ
  faqs: [{
    question: String,
    answer: String,
  }],

  // Builder
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

  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String,
  },

  // Generation Metadata
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  modelUsed: String,
  promptUsed: String,
  edited: {
    type: Boolean,
    default: false,
  },
  editedAt: Date,
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for unique section per property
generatedContentSchema.index({ propertyId: 1, section: 1 }, { unique: true });

export default mongoose.model('GeneratedContent', generatedContentSchema);