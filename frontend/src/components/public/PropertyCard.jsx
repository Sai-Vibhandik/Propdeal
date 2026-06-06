import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart, ArrowRight } from 'lucide-react';
import { formatPrice, formatPriceRange } from '../../utils/formatters.js';

const PropertyCard = ({ property, index = 0 }) => {
  const {
    _id,
    name,
    slug,
    builder,
    propertyType,
    category,
    address,
    priceRange,
    priceUnit,
    configurations,
    featured,
    heroImage,
  } = property;

  // Placeholder images
  const mainImage = heroImage || `https://placehold.co/800x600/1e3a8a/white?text=${encodeURIComponent(name || 'Property')}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={`/property/${slug}`} className="block">
        {/* Card Container with 3D perspective */}
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 group-hover:shadow-2xl"
          style={{
            perspective: '1000px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold rounded-full shadow-lg">
                Featured
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
              {category?.replace('-', ' ')}
            </div>

            {/* Property Type Tag */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-800 text-white text-sm font-medium rounded-lg">
                {propertyType}
              </span>
              {configurations?.length > 0 && (
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-lg">
                  {configurations.slice(0, 2).join(' | ')}
                </span>
              )}
            </div>

            {/* Heart Icon */}
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to wishlist
              }}
              className="absolute top-4 right-4 mt-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Location */}
            <div className="flex items-center text-gray-500 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0" />
              <span className="truncate">
                {address?.locality && `${address.locality}, `}
                {address?.city}
              </span>
            </div>

            {/* Property Name */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors line-clamp-1">
              {name}
            </h3>

            {/* Builder */}
            <p className="text-sm text-gray-600 mb-4">
              by <span className="font-medium text-gray-800">{builder}</span>
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-blue-800">
                {formatPriceRange(priceRange?.min, priceRange?.max, priceUnit)}
              </span>
              {priceUnit === 'cr' && <span className="text-sm text-gray-500">onwards</span>}
            </div>

            {/* Quick Info */}
            <div className="flex items-center gap-4 text-gray-600 text-sm pt-4 border-t border-gray-100">
              {configurations?.[0] && (
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{configurations[0]}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>2-3 Baths</span>
              </div>
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>Plot</span>
              </div>
            </div>
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;