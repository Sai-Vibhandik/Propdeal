import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { formatPriceRange } from '../../utils/formatters.js';

const FeaturedSection = ({ properties = [], loading = false }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Placeholder featured properties
  const defaultProperties = [
    {
      _id: '1',
      name: 'Prestige Lakeside',
      slug: 'prestige-lakeside',
      builder: 'Prestige Group',
      propertyType: 'apartment',
      address: { locality: 'Whitefield', city: 'Bangalore' },
      priceRange: { min: 8500000, max: 15000000 },
      priceUnit: 'lac',
      configurations: ['2BHK', '3BHK', '4BHK'],
      image: 'https://placehold.co/600x400/1e3a8a/white?text=Prestige+Lakeside',
    },
    {
      _id: '2',
      name: 'DLF The Camellias',
      slug: 'dlf-camellias',
      builder: 'DLF Group',
      propertyType: 'apartment',
      address: { locality: 'Sector 42', city: 'Gurgaon' },
      priceRange: { min: 5, max: 12 },
      priceUnit: 'cr',
      configurations: ['3BHK', '4BHK', '5BHK'],
      image: 'https://placehold.co/600x400/0f172a/white?text=DLF+Camellias',
    },
    {
      _id: '3',
      name: 'Lodha World Towers',
      slug: 'lodha-world-towers',
      builder: 'Lodha Group',
      propertyType: 'apartment',
      address: { locality: 'Worli', city: 'Mumbai' },
      priceRange: { min: 8, max: 25 },
      priceUnit: 'cr',
      configurations: ['3BHK', '4BHK', 'Penthouse'],
      image: 'https://placehold.co/600x400/1e40af/white?text=Lodha+World',
    },
    {
      _id: '4',
      name: 'Brigade Gateway',
      slug: 'brigade-gateway',
      builder: 'Brigade Group',
      propertyType: 'apartment',
      address: { locality: 'Rajajinagar', city: 'Bangalore' },
      priceRange: { min: 12000000, max: 28000000 },
      priceUnit: 'lac',
      configurations: ['2BHK', '3BHK'],
      image: 'https://placehold.co/600x400/1e3a8a/white?text=Brigade+Gateway',
    },
    {
      _id: '5',
      name: 'Godrej Properties',
      slug: 'godrej-properties',
      builder: 'Godrej Group',
      propertyType: 'villa',
      address: { locality: 'Kanakapura Road', city: 'Bangalore' },
      priceRange: { min: 2, max: 5 },
      priceUnit: 'cr',
      configurations: ['3BHK', '4BHK'],
      image: 'https://placehold.co/600x400/0f172a/white?text=Godrej+Villas',
    },
  ];

  const displayProperties = properties.length > 0 ? properties : defaultProperties;

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">
              Handpicked for You
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Featured Properties
            </h2>
            <p className="text-gray-600 mt-3 max-w-lg">
              Explore our curated selection of premium properties that offer the best in luxury, location, and lifestyle.
            </p>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-white shadow-md hover:bg-blue-800 hover:text-white text-gray-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-white shadow-md hover:bg-blue-800 hover:text-white text-gray-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayProperties.map((property, index) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[320px] md:w-[380px]"
            >
              <Link to={`/property/${property.slug}`} className="block group">
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={property.image || `https://placehold.co/600x400/1e3a8a/white?text=${encodeURIComponent(property.name)}`}
                      alt={property.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                      Featured
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg">
                      <p className="text-sm text-gray-600">Starting from</p>
                      <p className="text-lg font-bold text-blue-800">
                        {formatPriceRange(property.priceRange?.min, property.priceRange?.max, property.priceUnit)}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
                      <span className="truncate">
                        {property.address?.locality && `${property.address.locality}, `}
                        {property.address?.city}
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-800 transition-colors">
                      {property.name}
                    </h3>

                    {/* Builder */}
                    <p className="text-sm text-gray-600 mb-4">
                      by <span className="font-medium">{property.builder}</span>
                    </p>

                    {/* Configurations */}
                    <div className="flex flex-wrap gap-2">
                      {property.configurations?.slice(0, 3).map((config) => (
                        <span
                          key={config}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {config}
                        </span>
                      ))}
                    </div>

                    {/* View Details Arrow */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm text-gray-500">View Details</span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-800 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-800/30"
          >
            View All Properties
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;