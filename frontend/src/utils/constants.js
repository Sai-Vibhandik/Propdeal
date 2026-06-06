// Property Types
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot' },
  { value: 'row-house', label: 'Row House' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'penthouse', label: 'Penthouse' },
];

// Property Categories
export const PROPERTY_CATEGORIES = [
  { value: 'under-construction', label: 'Under Construction' },
  { value: 'ready-to-move', label: 'Ready to Move' },
  { value: 'new-launch', label: 'New Launch' },
  { value: 'pre-launch', label: 'Pre-Launch' },
];

// Configurations
export const CONFIGURATIONS = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'];

// Price Units
export const PRICE_UNITS = [
  { value: 'lac', label: 'Lakhs' },
  { value: 'cr', label: 'Crores' },
];

// Lead Statuses
export const LEAD_STATUSES = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'qualified', label: 'Qualified', color: 'bg-green-100 text-green-800' },
  { value: 'site-visit', label: 'Site Visit', color: 'bg-purple-100 text-purple-800' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
];

// Lead Sources
export const LEAD_SOURCES = [
  { value: 'homepage', label: 'Homepage' },
  { value: 'property-page', label: 'Property Page' },
  { value: 'cta-price', label: 'Get Price CTA' },
  { value: 'cta-visit', label: 'Book Visit CTA' },
  { value: 'cta-brochure', label: 'Download Brochure CTA' },
  { value: 'cta-callback', label: 'Request Callback CTA' },
  { value: 'contact-page', label: 'Contact Page' },
];

// Property Statuses
export const PROPERTY_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'published', label: 'Published', color: 'bg-green-100 text-green-800' },
  { value: 'archived', label: 'Archived', color: 'bg-red-100 text-red-800' },
];

// Section Types
export const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'overview', label: 'Overview' },
  { value: 'highlights', label: 'Highlights' },
  { value: 'amenities', label: 'Amenities' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'floorPlans', label: 'Floor Plans' },
  { value: 'location', label: 'Location' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'videoTour', label: 'Video Tour' },
  { value: 'builderInfo', label: 'Builder Info' },
  { value: 'investment', label: 'Investment' },
  { value: 'faq', label: 'FAQ' },
  { value: 'contact', label: 'Contact' },
];

// Hero Styles
export const HERO_STYLES = [
  { value: 'full-screen', label: 'Full Screen' },
  { value: 'split', label: 'Split View' },
  { value: 'video', label: 'Video Background' },
];

// Media Types
export const MEDIA_TYPES = [
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
];

// CTA Types
export const CTA_TYPES = [
  { value: 'getPriceDetails', label: 'Get Price Details' },
  { value: 'bookSiteVisit', label: 'Book Site Visit' },
  { value: 'downloadBrochure', label: 'Download Brochure' },
  { value: 'requestCallback', label: 'Request Callback' },
  { value: 'contactUs', label: 'Contact Us' },
];

// Indian Cities (Top)
export const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Noida',
  'Gurgaon',
  'Kochi',
  'Indore',
  'Surat',
  'Vadodara',
  'Nagpur',
  'Coimbatore',
  'Mysore',
];

// Default Theme
export const DEFAULT_THEME = {
  primaryColor: '#1e40af',
  accentColor: '#d4af37',
  heroStyle: 'full-screen',
};

export default {
  PROPERTY_TYPES,
  PROPERTY_CATEGORIES,
  CONFIGURATIONS,
  PRICE_UNITS,
  LEAD_STATUSES,
  LEAD_SOURCES,
  PROPERTY_STATUSES,
  SECTION_TYPES,
  HERO_STYLES,
  MEDIA_TYPES,
  CTA_TYPES,
  INDIAN_CITIES,
  DEFAULT_THEME,
};