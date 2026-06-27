import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  // Hero Carousel Slides
  heroSlides: [{
    image: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    location: { type: String },
    properties: { type: String },
    primaryCta: {
      text: { type: String, default: 'Browse Properties' },
      link: { type: String, default: '/properties' },
    },
    secondaryCta: {
      text: { type: String, default: 'Call Us' },
      type: { type: String, enum: ['phone', 'link'], default: 'phone' },
      link: { type: String }, // Only used when type is 'link'
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }],

  // Why Choose Us Section
  whyUs: {
    sectionTitle: { type: String, default: 'Your Trusted Property Partner' },
    sectionSubtitle: { type: String, default: 'We combine technology with expertise to deliver exceptional property solutions tailored to your needs.' },
    features: [{
      icon: { type: String, default: 'CheckCircle' }, // Lucide icon name
      title: { type: String, required: true },
      description: { type: String, required: true },
      order: { type: Number, default: 0 },
    }],
    stats: [{
      value: { type: String, required: true },
      label: { type: String, required: true },
      order: { type: Number, default: 0 },
    }],
  },

  // Popular Cities
  cities: [{
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }],

  // Testimonials
  testimonials: [{
    name: { type: String, required: true },
    location: { type: String },
    image: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    property: { type: String },
    text: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }],

  // FAQs
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }],

  // Contact Information
  contact: {
    phone: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'info@propertyhub.com' },
    address: { type: String, default: '123 Real Estate Tower, MG Road' },
    city: { type: String, default: 'Bangalore' },
    state: { type: String, default: 'Karnataka' },
    pincode: { type: String, default: '560001' },
    workingHours: { type: String, default: 'Mon - Sat, 9:00 AM - 7:00 PM' },
  },

  // Social Links
  social: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
  },

  // SEO Settings
  seo: {
    siteName: { type: String, default: 'PropertyHub' },
    siteTagline: { type: String, default: 'Find Your Perfect Home' },
    metaDescription: { type: String },
    metaKeywords: [String],
    ogImage: { type: String },
  },

  // Branding
  branding: {
    logo: { type: String }, // URL to logo image
    logoAlt: { type: String, default: 'Logo' },
    siteName: { type: String }, // Optional: override site name from SEO settings
    showSiteNameWithLogo: { type: Boolean, default: true }, // Show site name next to logo
    navbarLogoHeight: { type: Number, default: 40 }, // Height in pixels for navbar
    footerLogoHeight: { type: Number, default: 32 }, // Height in pixels for footer
    sidebarLogoHeight: { type: Number, default: 40 }, // Height in pixels for admin sidebar
  },

  // Footer Settings
  footer: {
    description: { type: String, default: 'Discover your dream property with our platform. We help you find the perfect home with detailed insights and virtual tours.' },
    copyrightText: { type: String, default: '© 2024 PropertyHub. All rights reserved.' },
    showNewsletter: { type: Boolean, default: true },
  },

  // Footer Quick Links
  footerLinks: [{
    label: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  }],

  // Footer Social Links
  footerSocialLinks: [{
    platform: { type: String, required: true }, // facebook, twitter, instagram, linkedin, youtube
    url: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  }],

  // Featured Builders (shown on homepage, max 5)
  featuredBuilders: [{
    name: { type: String, required: true }, // Builder name
    logo: { type: String }, // URL to builder logo
    order: { type: Number, default: 0 },
  }],

  // Legal Pages
  privacyPolicy: { type: String, default: '' },
  termsOfService: { type: String, default: '' },
}, {
  timestamps: true,
});

// Ensure only one document exists
siteContentSchema.statics.getSingleton = async function() {
  let content = await this.findOne();
  if (!content) {
    content = await this.create({});
  }
  return content;
};

export default mongoose.model('SiteContent', siteContentSchema);