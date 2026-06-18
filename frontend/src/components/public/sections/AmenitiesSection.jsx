import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Waves, Dumbbell, Car, TreePine, Shield, Wifi, Zap, Droplets,
  Users, Coffee, Gamepad2, Book, Baby, Heart, ShoppingBag,
  PartyPopper, Film, Home, Flower2, Mountain, Sprout, Leaf
} from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { useLead } from '../../../context/LeadContext.jsx';

// Icon map for amenities (used as fallback when no image)
const iconMap = {
  'Swimming Pool': Waves,
  'Gym': Dumbbell,
  'Gymnasium': Dumbbell,
  'Clubhouse': Users,
  "Children's Play Area": Baby,
  'Children Play Area': Baby,
  'Jogging Track': TreePine,
  'Tennis Court': Gamepad2,
  'Badminton Court': Gamepad2,
  'Basketball Court': Gamepad2,
  'Car Parking': Car,
  'Parking': Car,
  '24/7 Security': Shield,
  'Security': Shield,
  'CCTV Surveillance': Shield,
  'Power Backup': Zap,
  'Garden': Flower2,
  'Indoor Games': Gamepad2,
  'Party Hall': PartyPopper,
  'Mini Theater': Film,
  'Yoga Deck': Leaf,
  'Spa': Heart,
  'Library': Book,
  'Creche': Baby,
  'Day Care': Baby,
  'default': Home
};

// Get icon for amenity name
const getAmenityIcon = (name) => {
  if (iconMap[name]) return iconMap[name];
  // Match by keywords
  const lowerName = name.toLowerCase();
  if (lowerName.includes('pool') || lowerName.includes('swim')) return Waves;
  if (lowerName.includes('gym') || lowerName.includes('fitness')) return Dumbbell;
  if (lowerName.includes('club')) return Users;
  if (lowerName.includes('child') || lowerName.includes('kid') || lowerName.includes('play')) return Baby;
  if (lowerName.includes('garden') || lowerName.includes('park')) return Flower2;
  if (lowerName.includes('security') || lowerName.includes('cctv')) return Shield;
  if (lowerName.includes('parking') || lowerName.includes('car')) return Car;
  if (lowerName.includes('power') || lowerName.includes('backup')) return Zap;
  if (lowerName.includes('court') || lowerName.includes('sport')) return Gamepad2;
  return iconMap['default'];
};

const AmenitiesSection = ({ property, layout = 'grid', theme = {}, bgVariant = 'white' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  // Get amenities from property data (manual entry)
  const amenities = property.amenities || [];

  // If no amenities, don't render the section
  if (amenities.length === 0) {
    return null;
  }

  // Number of cards to show at once
  const cardsPerView = 3;
  const totalAmenities = amenities.length;

  // Calculate total number of slides
  const totalSlides = Math.ceil(totalAmenities / cardsPerView);

  // Get cards for current slide
  const getVisibleCards = useCallback(() => {
    const cards = [];
    for (let i = 0; i < cardsPerView; i++) {
      const index = currentIndex * cardsPerView + i;
      if (index < totalAmenities) {
        cards.push({ ...amenities[index], originalIndex: index });
      }
    }
    return cards;
  }, [currentIndex, amenities, totalAmenities, cardsPerView]);

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalSlides]);

  // Handle card click - open lead modal
  const handleCardClick = (amenityName) => {
    openModal(property, 'cta-amenities');
  };

  const visibleCards = getVisibleCards();

  // Check if navigation is possible
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < totalSlides - 1;

  return (
    <section id="amenities" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="font-semibold text-sm uppercase tracking-wider"
            style={{ color: colors.secondary }}
          >
            Amenities
          </span>
          <h2 className={`text-3xl md:text-4xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            World-Class Amenities
          </h2>
          <p className={`mt-3 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need for a comfortable and luxurious lifestyle
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
              canGoPrev ? '' : 'opacity-50 cursor-not-allowed'
            } ${
              isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
            style={{ boxShadow: `0 4px 20px rgba(0,0,0,0.15)` }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
              canGoNext ? '' : 'opacity-50 cursor-not-allowed'
            } ${
              isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-50'
            }`}
            style={{ boxShadow: `0 4px 20px rgba(0,0,0,0.15)` }}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>

          {/* Cards Container */}
          <div className="overflow-hidden px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-3 gap-4 md:gap-6"
              >
                {visibleCards.map((amenity, i) => {
                  const Icon = getAmenityIcon(amenity.name);
                  const hasImage = amenity.image && amenity.image.length > 0;

                  return (
                    <motion.div
                      key={`${amenity.originalIndex}-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleCardClick(amenity.name)}
                      className={`${cardBgClass} ${cardBorderClass} rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer`}
                    >
                      {/* Image or Icon */}
                      <div className="aspect-square relative overflow-hidden">
                        {hasImage ? (
                          <img
                            src={amenity.image}
                            alt={amenity.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}30)` }}
                          >
                            <Icon
                              className="w-12 h-12 md:w-16 md:h-16 transition-transform group-hover:scale-110"
                              style={{ color: colors.primary }}
                            />
                          </div>
                        )}
                        {/* Overlay gradient for better text readability when image exists */}
                        {hasImage && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        )}
                      </div>

                      {/* Amenity Name */}
                      <div className="p-3 text-center">
                        <h3 className={`font-medium text-sm md:text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {amenity.name}
                        </h3>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-6'
                    : isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={index === currentIndex ? { backgroundColor: colors.primary } : {}}
              />
            ))}
          </div>
        )}

        {/* Total Count */}
        <p className={`text-center mt-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {totalAmenities} Amenities Available
        </p>
      </div>
    </section>
  );
};

export default AmenitiesSection;