import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard.jsx';
import Loading from '../common/Loading.jsx';

const PropertyGrid = ({
  properties = [],
  loading = false,
  columns = 3,
  emptyMessage = 'No properties found.',
}) => {
  const gridCols = {
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