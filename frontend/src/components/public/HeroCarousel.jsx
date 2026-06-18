import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin, Building2, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { getFileUrl } from '../../services/api.js';

const HeroCarousel = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayTimeoutRef = useRef(null);
  const { content } = useSiteContent();

  const displaySlides = slides.length > 0 ? slides : [];

  // Get phone from site content for the call button
  const contactPhone = content?.contact?.phone || '+91 98765 43210';

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || displaySlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displaySlides.length]);

  // Cleanup auto-play resume timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);

    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    if (displaySlides.length === 0) return;
    goToSlide((currentSlide + 1) % displaySlides.length);
  }, [currentSlide, displaySlides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (displaySlides.length === 0) return;
    goToSlide((currentSlide - 1 + displaySlides.length) % displaySlides.length);
  }, [currentSlide, displaySlides.length, goToSlide]);

  // Get CTA button element based on type
  const renderSecondaryCta = (slide) => {
    const cta = slide.secondaryCta || { text: 'Call Us', type: 'phone' };

    // Phone CTA - always use global contact phone
    if (cta.type === 'phone') {
      return (
        <motion.a
          href={`tel:${contactPhone?.replace(/\s/g, '')}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
        >
          <Phone className="w-5 h-5" />
          {cta.text || 'Call Us'}
        </motion.a>
      );
    }

    // Link CTA - use the provided link
    return (
      <motion.span whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
        <Link
          to={cta.link || '#'}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all cursor-pointer"
        >
          {cta.text || 'Learn More'}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.span>
    );
  };

  if (displaySlides.length === 0) {
    return null;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={getFileUrl(displaySlides[currentSlide].image)}
            alt={displaySlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-full flex items-center">
          <div className="w-full lg:w-3/5 pt-20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Location Badge */}
                {displaySlides[currentSlide].location && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    {displaySlides[currentSlide].location && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        {displaySlides[currentSlide].location}
                      </span>
                    )}
                    {displaySlides[currentSlide].properties && (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/90 rounded-full text-white text-sm font-medium">
                        <Building2 className="w-4 h-4" />
                        {displaySlides[currentSlide].properties}
                      </span>
                    )}
                  </motion.div>
                )}

                {/* Main Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
                >
                  {displaySlides[currentSlide].title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg"
                >
                  {displaySlides[currentSlide].subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  {/* Primary CTA */}
                  <motion.span whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} className="inline-block">
                    <Link
                      to={displaySlides[currentSlide].primaryCta?.link || '/properties'}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 cursor-pointer"
                    >
                      {displaySlides[currentSlide].primaryCta?.text || 'Browse Properties'}
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </motion.span>

                  {/* Secondary CTA */}
                  {renderSecondaryCta(displaySlides[currentSlide])}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 mt-12"
            >
              {displaySlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 cursor-pointer ${
                    index === currentSlide
                      ? 'w-12 h-2 bg-amber-500 rounded-full'
                      : 'w-2 h-2 bg-white/40 rounded-full hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full items-center justify-center text-white hover:bg-white/20 transition-all z-10 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full items-center justify-center text-white hover:bg-white/20 transition-all z-10 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default HeroCarousel;