import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Square, ArrowRight } from 'lucide-react';
import { formatPriceRange } from '../../utils/formatters.js';
import { getFileUrl } from '../../services/api.js';

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
    featured,
    heroImages,
  } = property;

  // Realistic placeholder images based on property type
  const getPlaceholderImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be9168c6a96a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    ];
    return images[index % images.length];
  };

  // Get the first hero image or fallback
  const mainImage = heroImages?.[0]?.url ? getFileUrl(heroImages[0].url) : getPlaceholderImage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link to={`/property/${slug}`} className="block h-full">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-md shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-500 h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-48 flex-shrink-0 overflow-hidden">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Price Tag */}
            <div className="absolute bottom-4 left-4">
              <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
                <p className="text-lg font-bold text-slate-800">
                  {formatPriceRange(priceRange?.min, priceRange?.max, priceRange?.minUnit, priceRange?.maxUnit)}
                </p>
              </div>
            </div>
          </div>

          {/* Content - Flex-grow to fill remaining space */}
          <div className="p-5 flex flex-col flex-grow">
            {/* Location */}
            <div className="flex items-center text-slate-500 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-amber-500" />
              <span className="truncate">
                {address?.locality && `${address.locality}, `}
                {address?.city}
              </span>
            </div>

            {/* Property Name */}
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-amber-500 transition-colors line-clamp-1">
              {name}
            </h3>

            {/* Builder */}
            <p className="text-sm text-slate-600 mb-3">
              by <span className="font-medium text-slate-700">{builder}</span>
            </p>

            {/* Spacer to push quick info to bottom */}
            <div className="flex-grow"></div>

            {/* Quick Info - Always at bottom */}
            <div className="flex items-center gap-4 text-slate-500 text-sm pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{propertyType?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            </div>
          </div>

          {/* Hover Arrow */}
          <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;