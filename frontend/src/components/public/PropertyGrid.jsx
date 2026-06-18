import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Bed, Bath, Maximize } from 'lucide-react';
import PropertyCard from './PropertyCard.jsx';
import Loading from '../common/Loading.jsx';
import { formatPriceRange } from '../../utils/formatters.js';
import { getFileUrl } from '../../services/api.js';

// List view item component - simple row without image
const PropertyListItem = ({ property, index }) => {
  const getPropertyImage = (property) => {
    if (property.heroImages && property.heroImages.length > 0 && property.heroImages[0].url) {
      return getFileUrl(property.heroImages[0].url);
    }
    if (property.gallery && property.gallery.length > 0 && property.gallery[0].url) {
      return getFileUrl(property.gallery[0].url);
    }
    return null;
  };

  const image = getPropertyImage(property);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/property/${property.slug}`}
        className="block bg-white rounded-xl border border-gray-200 hover:border-slate-400 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <div className="flex items-center p-4 gap-4">
          {/* Thumbnail - Small */}
          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            {image ? (
              <img
                src={image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-800 truncate group-hover:text-slate-600">
              {property.name}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.address?.locality}, {property.address?.city}
            </p>
          </div>

          {/* Configuration */}
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-600">
            {property.configurations && property.configurations.length > 0 && (
              <span className="px-3 py-1 bg-slate-100 rounded-full">
                {property.configurations.slice(0, 3).join(', ')}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-slate-800">
              {formatPriceRange(
                property.priceRange?.min,
                property.priceRange?.max,
                property.priceRange?.minUnit,
                property.priceRange?.maxUnit
              )}
            </p>
            <p className="text-xs text-slate-500">
              {property.status || 'Available'}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const PropertyGrid = ({
  properties = [],
  loading = false,
  columns = 3,
  emptyMessage = 'No properties found.',
}) => {
  const gridCols = {
    1: 'grid-cols-1', // List view - single column
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loading size="lg" text="Loading properties..." />
      </div>
    );
  }

  if (!properties.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[300px] flex flex-col items-center justify-center text-center px-4"
      >
        <div className="w-20 h-20 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
        <p className="text-gray-500 max-w-md">{emptyMessage}</p>
      </motion.div>
    );
  }

  // List view (columns === 1) - Simple list without large images
  if (columns === 1) {
    return (
      <div className="space-y-3">
        {properties.map((property, index) => (
          <PropertyListItem
            key={property._id || index}
            property={property}
            index={index}
          />
        ))}
      </div>
    );
  }

  // Grid view - Full cards with images
  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-6 lg:gap-8`}>
      {properties.map((property, index) => (
        <PropertyCard
          key={property._id || index}
          property={property}
          index={index}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;