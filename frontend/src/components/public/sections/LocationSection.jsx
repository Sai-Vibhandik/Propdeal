import { motion } from 'framer-motion';
import { MapPin, Building2, ShoppingBag, Heart, Book, Train, Utensils, Dumbbell, TreePine, Banknote, Fuel, ExternalLink, Navigation } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';

const iconMap = {
  school: Book, hospital: Heart, shopping: ShoppingBag, work: Building2,
  transport: Train, restaurant: Utensils, gym: Dumbbell, park: TreePine, bank: Banknote, fuel: Fuel, other: MapPin,
};

const defaultNearbyPlaces = [
  { name: 'Metro Station', type: 'transport', distance: '2 km' },
  { name: 'Shopping Mall', type: 'shopping', distance: '3 km' },
  { name: 'Hospital', type: 'hospital', distance: '4 km' },
  { name: 'School', type: 'school', distance: '5 km' },
];

const LocationSection = ({ property, layout = 'map-list', theme = {}, bgVariant = 'white' }) => {
  const content = property.generatedContent?.location || {};
  const nearbyPlaces = property.nearbyPlaces?.length > 0 ? property.nearbyPlaces : defaultNearbyPlaces;
  const { colors, isDark } = getThemeStyles(theme);

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  const googleMapUrl = property.googleMapUrl;
  const hasCoordinates = property.coordinates?.lat && property.coordinates?.lng;
  const fullAddress = property.address?.fullAddress || `${property.address?.locality}, ${property.address?.city}, ${property.address?.state}`;

  // Extract embed URL from iframe HTML or use as-is if it's already a URL
  const extractEmbedUrl = (input) => {
    if (!input) return null;
    // If input contains iframe tag, extract src attribute
    const srcMatch = input.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      return srcMatch[1];
    }
    // If it's already a URL, return as-is
    if (input.startsWith('http')) {
      return input;
    }
    return null;
  };

  // Generate Google Maps search URL from embed URL
  // Tries multiple methods to get accurate location
  const getMapSearchUrl = (embedUrl) => {
    if (!embedUrl) return null;

    // Method 1: Try to extract place name from URL (format: !2sPlaceName or !sPlaceName)
    const placeMatch = embedUrl.match(/!2s([^!]+(?:%2C[^!]+)?)/) || embedUrl.match(/!s([^!]+(?:%2C[^!]+)?)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://www.google.com/maps/search/${encodeURIComponent(placeName)}`;
    }

    // Method 2: Try to extract coordinates (!2d{lng}!3d{lat})
    const coordMatch = embedUrl.match(/!2d([\d.-]+)!3d([\d.-]+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[2]);
      const lng = parseFloat(coordMatch[1]);
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    // Method 3: Fallback to directions URL with address
    return null;
  };

  let embedUrl = null;
  let mapSearchUrl = null;
  let directionsUrl = null;

  if (googleMapUrl) {
    embedUrl = extractEmbedUrl(googleMapUrl);
    // Try to get map search URL from embed URL
    const extractedMapUrl = getMapSearchUrl(embedUrl);
    if (extractedMapUrl) {
      mapSearchUrl = extractedMapUrl;
      directionsUrl = extractedMapUrl;
    } else {
      // Fallback to address search
      mapSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
      directionsUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
    }
  } else if (hasCoordinates) {
    embedUrl = `https://maps.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}&z=15&output=embed`;
    mapSearchUrl = `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`;
    directionsUrl = `https://www.google.com/maps/search/?api=1&query=${property.coordinates.lat},${property.coordinates.lng}`;
  } else {
    // Fallback to address search
    directionsUrl = `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`;
  }

  return (
    <section id="location" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>Location</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Prime Location with Excellent Connectivity</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            {[property.address?.locality, property.address?.city, property.address?.state].filter(Boolean).join(', ')}
            {property.address?.pincode && ` - ${property.address.pincode}`}
          </p>
        </motion.div>

        {/* Map - Full Width */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl overflow-hidden shadow-lg mb-10 h-[350px] md:h-[400px]">
          <div className="relative w-full h-full">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property Location Map"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <div className="text-center px-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${cardBgClass} ${cardBorderClass}`}>
                    <Navigation className="w-10 h-10" style={{ color: colors.primary }} />
                  </div>
                  <p className="font-medium text-lg text-gray-900 dark:text-white">{property.address?.locality}</p>
                  <p className="text-gray-600 dark:text-gray-300">{property.address?.city}, {property.address?.state}{property.address?.pincode && ` - ${property.address.pincode}`}</p>
                  {property.address?.landmark && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Near: {property.address.landmark}</p>
                  )}
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <MapPin className="w-4 h-4" /> View on Google Maps
                  </motion.a>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Nearby Places - Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What's Nearby</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-justify">{content.connectivity || 'Excellent connectivity to major hubs with easy access to public transport and highways.'}</p>

          <div className="flex flex-wrap justify-center gap-4">
            {nearbyPlaces.map((place, index) => {
              const Icon = iconMap[place.type] || MapPin;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className={`${cardBgClass} ${cardBorderClass} p-4 rounded-xl shadow-sm hover:shadow-lg transition-all flex items-center gap-3 w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] lg:w-[calc(25%-12px)] cursor-pointer`}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: colors.primary }} />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{place.name}</h4>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium w-fit" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                      {place.distance}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Complete Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-2xl"
          style={{ backgroundColor: `${colors.primary}08` }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                Complete Address
              </h4>
              <div className="space-y-2">
                {property.address?.fullAddress && (
                  <p className="text-gray-700 dark:text-gray-200">{property.address.fullAddress}</p>
                )}
                <p className="text-gray-600 dark:text-gray-300">
                  {[property.address?.locality, property.address?.city, property.address?.state].filter(Boolean).join(', ')}
                  {property.address?.pincode && ` - ${property.address.pincode}`}
                </p>
                {property.address?.landmark && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                    <span className="font-medium">Near:</span> {property.address.landmark}
                  </p>
                )}
              </div>
            </div>
            <motion.a
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-white hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: colors.primary }}
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LocationSection;