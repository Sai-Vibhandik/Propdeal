import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight, Play, Gift, Check } from 'lucide-react';
import { useLead } from '../../../context/LeadContext.jsx';
import { getThemeStyles } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

const HeroSection = ({ property, layout = 'full-screen', theme = {}, branding = {} }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const { openModal } = useLead();
  const { colors, isDark } = getThemeStyles(theme);

  const placeholderImage = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop';
  const images = property.heroImages?.length > 0 ? property.heroImages.map(img => getFileUrl(img.url)) : [placeholderImage];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => setCurrentImage((prev) => (prev + 1) % images.length), 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const content = property.generatedContent?.hero || {};
  const ctaText = branding.customCtaText || content.ctaText || 'Schedule a Visit';

  // Offers from AI-generated hero content or default
  const offers = content.offers || [
    { text: 'No Pre-EMI till Possession', highlight: true },
    { text: 'Free Car Parking Worth ₹5L', highlight: false },
    { text: 'Early Bird Discount: 2% Off', highlight: false },
  ];

  // RERA details - show if reraNumber exists and showReraBadge is not explicitly false
  const brandingData = branding || {};
  const reraNumber = property.reraNumber;
  const reraQrCode = brandingData.reraQrCode ? getFileUrl(brandingData.reraQrCode) : null;
  const reraWebsite = brandingData.reraWebsite;
  const showReraBadge = reraNumber && brandingData.showReraBadge !== false;

  return (
    <section className="relative">
      <div className="flex flex-col lg:flex-row">

        {/* Left Side - Image Carousel (70%) */}
        <div
          className="relative w-full lg:w-[70%] h-[400px] lg:h-[700px] bg-gray-100 lg:border-r-2"
          style={{ borderColor: `${colors.primary}60` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={images[currentImage]}
                alt={property.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = placeholderImage;
                }}
              />
              {/* Subtle gradient on the right edge for smooth transition */}
              <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-white/20 lg:block hidden" />
            </motion.div>
          </AnimatePresence>

          {/* RERA Badge with QR Code - Top Right */}
          {showReraBadge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-4 right-4 z-20"
            >
              <div className="flex items-center gap-2.5 backdrop-blur-md bg-white/80 rounded-lg px-2.5 py-1.5 shadow-sm border border-white/20">
                {reraQrCode && (
                  <div className="flex-shrink-0">
                    <img
                      src={reraQrCode}
                      alt="RERA QR Code"
                      className="w-10 h-10 object-contain rounded"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
                    Rera No.
                  </span>
                  <span className="text-xs font-semibold text-gray-800 leading-tight">
                    {reraNumber}
                  </span>
                  {reraWebsite && (
                    <a
                      href={reraWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {reraWebsite}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Arrows - Only show on hover */}
          {images.length > 1 && (
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all shadow-lg z-30 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="absolute right-4 lg:right-20 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-all shadow-lg z-30 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Right Side - Information Card (30%) */}
        <div
          className={`relative w-full lg:w-[30%] z-10 lg:h-[700px] ${isDark ? 'bg-gray-900' : 'bg-white'} lg:border-l-2`}
          style={{ borderColor: `${colors.primary}60` }}
        >
          {/* Overlapping Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`h-full lg:shadow-[-10px_0_40px_-10px_rgba(0,0,0,0.1)] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] ${isDark ? 'bg-gray-900' : 'bg-white'}`}
          >
            <div className="h-full flex flex-col p-6 lg:p-8 justify-center overflow-y-auto">

              {/* Badge */}
              {content.badge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <span
                    className="inline-flex items-center gap-1 px-4 py-1.5 text-white text-sm font-medium rounded-full shadow-sm"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    {content.badge}
                  </span>
                </motion.div>
              )}

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-bold leading-tight mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                {content.headline || property.name}
              </motion.h1>

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`flex items-center gap-2 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                <MapPin className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-sm lg:text-base">
                  {property.address?.locality}, {property.address?.city}
                </span>
              </motion.div>

              {/* Exclusive Offers - Simple List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4" style={{ color: colors.secondary }} />
                  <span className="text-sm font-semibold" style={{ color: colors.secondary }}>Exclusive Offers</span>
                </div>
                <div className="space-y-1.5">
                  {offers.map((offer, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: offer.highlight ? colors.secondary : `${colors.secondary}20` }}
                      >
                        <Check className="w-3 h-3" style={{ color: offer.highlight ? 'white' : colors.secondary }} />
                      </div>
                      <span className={`text-sm ${offer.highlight ? 'font-semibold' : ''} ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {offer.text}
                      </span>
                      {offer.highlight && (
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${colors.secondary}20`, color: colors.secondary }}
                        >
                          HOT
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                {content.offerValidity && (
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Valid till {content.offerValidity}
                  </p>
                )}
              </motion.div>

              {/* Divider */}
              <div className="w-16 h-1 rounded-full mb-4" style={{ backgroundColor: colors.primary }} />

              {/* Price Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-6"
              >
                <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {property.priceRange?.max && property.priceRange?.max !== property.priceRange?.min
                    ? 'Price Range'
                    : 'Starting from'}
                </p>
                {property.priceRange?.max && property.priceRange?.max !== property.priceRange?.min ? (
                  <p className={`text-2xl lg:text-xl xl:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ₹{property.priceRange?.min} {property.priceRange?.minUnit === 'cr' ? 'Cr' : 'Lac'}
                    <span className={`font-normal mx-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
                    ₹{property.priceRange.max} {property.priceRange?.maxUnit === 'cr' ? 'Cr' : 'Lac'}
                  </p>
                ) : (
                  <p className={`text-2xl lg:text-xl xl:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ₹{property.priceRange?.min} {property.priceRange?.minUnit === 'cr' ? 'Cr' : 'Lac'}
                  </p>
                )}
              </motion.div>

              {/* Description Preview */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className={`text-sm lg:text-xs leading-relaxed mb-6 line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {content.subheadline || property.generatedContent?.overview?.summary}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="space-y-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openModal(property, 'cta-hero')}
                  className="cta-bounce-shine w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl cursor-pointer"
                  style={{ backgroundColor: colors.primary }}
                >
                  {ctaText}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openModal(property, 'cta-hero-visit')}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold rounded-xl transition-all cursor-pointer ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                  style={{ borderColor: colors.secondary, color: colors.secondary, backgroundColor: isDark ? 'transparent' : 'white', borderWidth: 2, borderStyle: 'solid' }}
                >
                  <Play className="w-4 h-4" />
                  Schedule Site Visit
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;