import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { formatPriceRange } from '../../utils/formatters.js';
import { getFileUrl } from '../../services/api.js';

// Helper to get property image
const getPropertyImage = (property) => {
  // First try heroImages
  if (property.heroImages && property.heroImages.length > 0 && property.heroImages[0].url) {
    return getFileUrl(property.heroImages[0].url);
  }
  // Then try gallery
  if (property.gallery && property.gallery.length > 0 && property.gallery[0].url) {
    return getFileUrl(property.gallery[0].url);
  }
  // Fallback to placeholder
  return 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop';
};

const FeaturedSection = ({ properties = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Featured properties data (fallback when no properties passed)
  const featuredProperties = [
    {
      _id: '1',
      name: 'Prestige Lakeside Habitat',
      slug: 'prestige-lakeside',
      builder: 'Prestige Group',
      address: { locality: 'Whitefield', city: 'Bangalore' },
      priceRange: { min: 85, max: 150, minUnit: 'lac', maxUnit: 'lac' },
      configurations: ['2BHK', '3BHK', '4BHK'],
      status: 'Ready to Move',
      area: '15 Acres',
      highlights: ['RERA Verified', '50+ Amenities', 'Lakeside Living', 'Ready to Move'],
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
    },
    {
      _id: '2',
      name: 'DLF The Camellias',
      slug: 'dlf-camellias',
      builder: 'DLF Group',
      address: { locality: 'Sector 42', city: 'Gurgaon' },
      priceRange: { min: 5, max: 12, minUnit: 'cr', maxUnit: 'cr' },
      configurations: ['3BHK', '4BHK', '5BHK'],
      status: 'Ready to Move',
      area: '20 Acres',
      highlights: ['Luxury Living', 'Golf Course View', 'Premium Amenities', 'Ready Possession'],
      image: 'https://images.unsplash.com/photo-1600585154340-be9168c6a96a?w=1200&h=800&fit=crop',
    },
    {
      _id: '3',
      name: 'Lodha World Towers',
      slug: 'lodha-world-towers',
      builder: 'Lodha Group',
      address: { locality: 'Worli', city: 'Mumbai' },
      priceRange: { min: 8, max: 25, minUnit: 'cr', maxUnit: 'cr' },
      configurations: ['3BHK', '4BHK', 'Penthouse'],
      status: 'Under Construction',
      area: '18 Acres',
      highlights: ['World\'s Tallest Tower', 'Sea View', 'Luxury Interiors', '2025 Possession'],
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
    },
    {
      _id: '4',
      name: 'Brigade Gateway',
      slug: 'brigade-gateway',
      builder: 'Brigade Group',
      address: { locality: 'Rajajinagar', city: 'Bangalore' },
      priceRange: { min: 120, max: 280, minUnit: 'lac', maxUnit: 'lac' },
      configurations: ['2BHK', '3BHK'],
      status: 'Ready to Move',
      area: '12 Acres',
      highlights: ['Metro Connected', 'Mall Inside', 'School On Campus', 'Ready to Move'],
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop',
    },
    {
      _id: '5',
      name: 'Godrej Eden Estate',
      slug: 'godrej-eden',
      builder: 'Godrej Properties',
      address: { locality: 'Kanakapura Road', city: 'Bangalore' },
      priceRange: { min: 2, max: 5, minUnit: 'cr', maxUnit: 'cr' },
      configurations: ['3BHK', '4BHK'],
      status: 'New Launch',
      area: '25 Acres',
      highlights: ['New Launch Offer', 'Green Township', 'Club House', 'Best Price'],
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop',
    },
  ];

  const displayProperties = properties.length > 0 ? properties : featuredProperties;
  const currentProperty = displayProperties[currentIndex];

  // Get the image URL for the current property
  const currentPropertyImage = properties.length > 0
    ? getPropertyImage(currentProperty)
    : currentProperty.image;

  // Auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayProperties.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayProperties.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);

    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % displayProperties.length);
  }, [currentIndex, displayProperties.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + displayProperties.length) % displayProperties.length);
  }, [currentIndex, displayProperties.length, goToSlide]);

  // Handle swipe/drag for mobile
  const handleDragEnd = useCallback((event, info) => {
    const threshold = 50; // Minimum drag distance to trigger navigation

    if (info.offset.x < -threshold) {
      // Swiped left - go next
      nextSlide();
    } else if (info.offset.x > threshold) {
      // Swiped right - go previous
      prevSlide();
    }
  }, [nextSlide, prevSlide]);

  return (
    <section id="featured" className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
            Editor's Pick
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            Featured Property
          </h2>
          <p className="text-slate-600 mt-3 max-w-lg mx-auto">
            Handpicked properties offering the best in luxury, location, and lifestyle.
          </p>
        </motion.div>

        {/* Navigation - Desktop only */}
        <div className="hidden md:flex justify-end gap-3 mb-6">
          <motion.button
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-700 hover:bg-slate-800 active:bg-slate-900 hover:text-white transition-all cursor-pointer"
            aria-label="Previous property"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center text-slate-700 hover:bg-slate-800 active:bg-slate-900 hover:text-white transition-all cursor-pointer"
            aria-label="Next property"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Featured Property Card - Swipeable on mobile */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragMomentum={false}
            dragPropagation={false}
            onDragEnd={handleDragEnd}
            className="grid lg:grid-cols-5 gap-8 cursor-grab active:cursor-grabbing md:cursor-default"
          >
            {/* Image Section - 60% */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
                <img
                  src={currentPropertyImage}
                  alt={currentProperty.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Property Name Overlay on Mobile */}
                <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                  <h3 className="text-2xl font-bold text-white mb-1">{currentProperty.name}</h3>
                  <p className="text-white/80 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {currentProperty.address.locality}, {currentProperty.address.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Section - 40% */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 h-full">
                {/* Builder */}
                <p className="text-amber-500 font-medium text-sm mb-2">
                  by {currentProperty.builder}
                </p>

                {/* Property Name */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                  {currentProperty.name}
                </h3>

                {/* Location */}
                <div className="flex items-center text-slate-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2 text-slate-700" />
                  <span>{currentProperty.address.locality}, {currentProperty.address.city}</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-sm text-slate-500 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {formatPriceRange(currentProperty.priceRange?.min, currentProperty.priceRange?.max, currentProperty.priceRange?.minUnit, currentProperty.priceRange?.maxUnit)}
                  </p>
                </div>

                {/* CTA Button */}
                <motion.span whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="block">
                  <Link
                    to={`/property/${currentProperty.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 active:bg-slate-900 transition-all shadow-lg shadow-slate-800/30 cursor-pointer"
                  >
                    View Full Details
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {displayProperties.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`transition-all duration-300 cursor-pointer ${
                index === currentIndex
                  ? 'w-8 h-2 bg-slate-700 rounded-full'
                  : 'w-2 h-2 bg-slate-300 rounded-full hover:bg-slate-400 active:bg-slate-500'
              }`}
              aria-label={`Go to property ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;