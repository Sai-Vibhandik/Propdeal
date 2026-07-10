import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
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
  message: {
    type: String,
    trim: true,
  },

  // Status
  status: {
    type: String,
    enum: ['new', 'in-progress', 'converted', 'lost'],
    default: 'new',
  },

  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

  // Source (where the enquiry came from)
  source: {
    type: String,
    enum: ['contact-section', 'home-loan', 'general', 'partner-with-us', 'developer-contact', 'developer-cta', 'advertise-project', 'regional-partnership'],
    default: 'contact-section',
  },

  // Location on page where the button was clicked
  location: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model('Enquiry', enquirySchema);