import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '??';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// Helper to get a consistent color based on name
const getAvatarColor = (name) => {
  const colors = [
    'bg-slate-700',
    'bg-amber-600',
    'bg-emerald-600',
    'bg-purple-600',
    'bg-rose-600',
    'bg-teal-600',
    'bg-indigo-600',
    'bg-orange-600',
  ];
  if (!name) return colors[0];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const defaultTestimonials = [
  {
    name: 'Rahul Sharma',
    location: 'Bangalore',
    rating: 5,
    property: 'Prestige Lakeside Habitat',
    text: 'Found my dream home through PropDeal. The team was incredibly helpful and guided me through every step. The property details were accurate and the photos matched exactly what I saw during the visit.',
  },
  {
    name: 'Priya Patel',
    location: 'Mumbai',
    rating: 5,
    property: 'Lodha World Towers',
    text: 'I was skeptical about online property search, but PropDeal made it so easy. The RERA verification gave me confidence, and the pricing was transparent with no hidden charges. Highly recommend!',
  },
  {
    name: 'Amit Kumar',
    location: 'Gurgaon',
    rating: 5,
    property: 'DLF The Camellias',
    text: 'The team helped me find the perfect 4BHK for my family. They understood my requirements and showed me only relevant properties. Saved me weeks of searching. Thank you PropDeal!',
  },
];

const TestimonialsSection = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState('next');

  const displayTestimonials = testimonials?.length > 0
    ? testimonials.filter(t => t.isActive !== false)
    : defaultTestimonials;

  // Auto-rotate
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setDirection('next');
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, displayTestimonials.length]);

  const goToSlide = useCallback((index, dir) => {
    setDirection(dir);
    setCurrentIndex(index);
    setIsAutoPlaying(false);

    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextTestimonial = useCallback(() => {
    goToSlide((currentIndex + 1) % displayTestimonials.length, 'next');
  }, [currentIndex, displayTestimonials.length, goToSlide]);

  const prevTestimonial = useCallback(() => {
    goToSlide((currentIndex - 1 + displayTestimonials.length) % displayTestimonials.length, 'prev');
  }, [currentIndex, displayTestimonials.length, goToSlide]);

  // Handle swipe/drag for mobile
  const handleDragEnd = useCallback((event, info) => {
    const threshold = 50; // Minimum drag distance to trigger navigation

    if (info.offset.x < -threshold) {
      // Swiped left - go next
      nextTestimonial();
    } else if (info.offset.x > threshold) {
      // Swiped right - go previous
      prevTestimonial();
    }
  }, [nextTestimonial, prevTestimonial]);

  // Animation variants for smooth transitions
  const variants = {
    enter: (direction) => ({
      x: direction === 'next' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === 'next' ? -100 : 100,
      opacity: 0,
    }),
  };

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="py-12 md:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Hear from families who found their perfect home with us.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons - Desktop only */}
          <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-0 right-0 justify-between pointer-events-none z-10">
            <motion.button
              onClick={prevTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white shadow-lg shadow-slate-200/50 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-800 active:bg-slate-900 hover:text-white transition-all pointer-events-auto cursor-pointer"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 bg-white shadow-lg shadow-slate-200/50 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-800 active:bg-slate-900 hover:text-white transition-all pointer-events-auto cursor-pointer"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Testimonial Card - Swipeable on mobile */}
          <div className="max-w-3xl mx-auto pt-4">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                dragMomentum={false}
                dragPropagation={false}
                onDragEnd={handleDragEnd}
                className="cursor-grab active:cursor-grabbing md:cursor-default"
              >
                <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 px-8 py-8 md:px-12 md:py-10">
                  {/* Author Info at Top */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md ${getAvatarColor(displayTestimonials[currentIndex].name)}`}>
                      {getInitials(displayTestimonials[currentIndex].name)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg">
                        {displayTestimonials[currentIndex].name}
                      </h4>
                      <p className="text-slate-500 text-sm mb-1">
                        {displayTestimonials[currentIndex].location}
                        {displayTestimonials[currentIndex].property && ` • ${displayTestimonials[currentIndex].property}`}
                      </p>
                      {/* Rating Stars */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (displayTestimonials[currentIndex].rating || 5)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-slate-700 text-lg md:text-xl leading-relaxed">
                    "{displayTestimonials[currentIndex].text}"
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {displayTestimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index, index > currentIndex ? 'next' : 'prev')}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === currentIndex
                    ? 'w-8 bg-slate-700'
                    : 'w-2.5 bg-slate-300 hover:bg-slate-400 active:bg-slate-500'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;