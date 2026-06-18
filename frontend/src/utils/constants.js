// Property Types (matching Property model schema)
export const PROPERTY_TYPES = [
  // Residential
  { value: 'apartment', label: 'Apartment', category: 'residential' },
  { value: 'studio', label: 'Studio', category: 'residential' },
  { value: 'duplex', label: 'Duplex', category: 'residential' },
  { value: 'penthouse', label: 'Penthouse', category: 'residential' },
  { value: 'villa', label: 'Villa', category: 'residential' },
  { value: 'row-house', label: 'Row House', category: 'residential' },
  { value: 'builder-floor', label: 'Builder Floor', category: 'residential' },
  { value: 'bungalow', label: 'Bungalow', category: 'residential' },
  { value: 'farm-house', label: 'Farm House', category: 'residential' },
  // Land/Plots
  { value: 'residential-plot', label: 'Residential Plot', category: 'land' },
  { value: 'commercial-plot', label: 'Commercial Plot', category: 'land' },
  { value: 'agricultural-land', label: 'Agricultural Land', category: 'land' },
  { value: 'plot', label: 'Plot', category: 'land' }, // Legacy
  // Commercial
  { value: 'shop', label: 'Shop', category: 'commercial' },
  { value: 'office', label: 'Office', category: 'commercial' },
  { value: 'showroom', label: 'Showroom', category: 'commercial' },
  { value: 'warehouse', label: 'Warehouse', category: 'commercial' },
  { value: 'commercial', label: 'Commercial', category: 'commercial' }, // Legacy
  // Industrial
  { value: 'industrial-shed', label: 'Industrial Shed', category: 'industrial' },
  { value: 'factory', label: 'Factory', category: 'industrial' },
];

// Property Categories (for grouping in filters)
export const PROPERTY_TYPE_GROUPS = [
  { label: 'Residential', types: ['apartment', 'studio', 'duplex', 'penthouse', 'villa', 'row-house', 'builder-floor', 'bungalow', 'farm-house'] },
  { label: 'Land/Plots', types: ['residential-plot', 'commercial-plot', 'agricultural-land', 'plot'] },
  { label: 'Commercial', types: ['shop', 'office', 'showroom', 'warehouse', 'commercial'] },
  { label: 'Industrial', types: ['industrial-shed', 'factory'] },
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
  { value: 'contact-section', label: 'Contact Section' },
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
  PROPERTY_TYPE_GROUPS,
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