import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Grid, List, Search, X, ChevronDown, Loader2 } from 'lucide-react';
import PropertyGrid from '../../components/public/PropertyGrid.jsx';
import Button from '../../components/common/Button.jsx';
import { propertiesAPI } from '../../services/api.js';
import { INDIAN_CITIES, PROPERTY_TYPES, PROPERTY_TYPE_GROUPS, PROPERTY_CATEGORIES, CONFIGURATIONS } from '../../utils/constants.js';

const FiltersPanel = ({ isOpen, onClose, filters, onFilterChange, onClearAll }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    type: true,
    budget: false,
    configuration: false,
    status: false,
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleLocalChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({
      city: '',
      propertyType: '',
      category: '',
      configuration: '',
      minPrice: '',
      maxPrice: '',
      search: '',
    });
    onClearAll();
  };

  const hasActiveFilters = Object.values(localFilters).some((v) => v && v !== '');

  const priceRanges = [
    { label: 'Under ₹50 Lac', min: 0, max: 5000000 },
    { label: '₹50 Lac - ₹1 Cr', min: 5000000, max: 10000000 },
    { label: '₹1 Cr - ₹2 Cr', min: 10000000, max: 20000000 },
    { label: '₹2 Cr - ₹5 Cr', min: 20000000, max: 50000000 },
    { label: 'Above ₹5 Cr', min: 50000000, max: null },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-800 hover:text-blue-900"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Sections */}
            <div className="p-5 space-y-5">
              {/* Location */}
              <div className="border-b pb-5">
                <button
                  onClick={() => toggleSection('location')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-gray-900">Location</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections.location ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.location && (
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {INDIAN_CITIES.map((city) => (
                      <label
                        key={city}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="city"
                          checked={localFilters.city === city}
                          onChange={() => handleLocalChange('city', city)}
                          className="w-4 h-4 text-blue-800 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{city}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Property Type */}
              <div className="border-b pb-5">
                <button
                  onClick={() => toggleSection('type')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-gray-900">Property Type</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections.type ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.type && (
                  <div className="mt-3 space-y-3">
                    {PROPERTY_TYPE_GROUPS.map((group) => (
                      <div key={group.label}>
                        <p className="text-xs font-medium text-gray-500 mb-2">{group.label}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {group.types.map((typeValue) => {
                            const type = PROPERTY_TYPES.find((t) => t.value === typeValue);
                            return (
                              <button
                                key={typeValue}
                                onClick={() =>
                                  handleLocalChange(
                                    'propertyType',
                                    localFilters.propertyType === typeValue ? '' : typeValue
                                  )
                                }
                                className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                  localFilters.propertyType === typeValue
                                    ? 'bg-blue-800 text-white border-blue-800'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-800'
                                }`}
                              >
                                {type?.label || typeValue}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div className="border-b pb-5">
                <button
                  onClick={() => toggleSection('budget')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-gray-900">Budget</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections.budget ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.budget && (
                  <div className="mt-3 space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          if (
                            localFilters.minPrice === range.min &&
                            localFilters.maxPrice === range.max
                          ) {
                            handleLocalChange('minPrice', '');
                            handleLocalChange('maxPrice', '');
                          } else {
                            handleLocalChange('minPrice', range.min);
                            handleLocalChange('maxPrice', range.max);
                          }
                        }}
                        className={`w-full px-3 py-2 text-sm text-left rounded-lg border transition-all ${
                          localFilters.minPrice === range.min &&
                          localFilters.maxPrice === range.max
                            ? 'bg-blue-800 text-white border-blue-800'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-800'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Configuration */}
              <div className="border-b pb-5">
                <button
                  onClick={() => toggleSection('configuration')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-gray-900">Configuration</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections.configuration ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.configuration && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CONFIGURATIONS.map((config) => (
                      <button
                        key={config}
                        onClick={() =>
                          handleLocalChange(
                            'configuration',
                            localFilters.configuration === config ? '' : config
                          )
                        }
                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                          localFilters.configuration === config
                            ? 'bg-blue-800 text-white border-blue-800'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-800'
                        }`}
                      >
                        {config}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <button
                  onClick={() => toggleSection('status')}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-gray-900">Status</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedSections.status ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedSections.status && (
                  <div className="mt-3 space-y-2">
                    {PROPERTY_CATEGORIES.map((cat) => (
                      <label
                        key={cat.value}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          checked={localFilters.category === cat.value}
                          onChange={() => handleLocalChange('category', cat.value)}
                          className="w-4 h-4 text-blue-800 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white border-t px-5 py-4">
              <Button onClick={applyFilters} className="w-full" size="lg">
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Map MongoDB sort values to frontend display values
const SORT_VALUE_MAP = {
  '-createdAt': 'newest',
  'priceRange.min': 'price-low',
  '-priceRange.min': 'price-high',
  '-featured': 'featured',
};

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get sort from URL and convert to display value
  const urlSort = searchParams.get('sort') || '-createdAt';
  const initialSortBy = SORT_VALUE_MAP[urlSort] || 'newest';

  const [sortBy, setSortBy] = useState(initialSortBy);

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    propertyType: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    configuration: searchParams.get('config') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('q') || '',
    sort: urlSort,
  });

  // Properties state
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // Build query params
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.category) params.category = filters.category;
      if (filters.configuration) params.configuration = filters.configuration;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;
      params.status = 'published'; // Only show published properties

      const response = await propertiesAPI.getAll(params);
      setProperties(response.data.data || []);
      setPagination(response.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    // Update URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      city: '',
      propertyType: '',
      category: '',
      configuration: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sort: '-createdAt',
    };
    setFilters(clearedFilters);
    setSortBy('newest');
    setSearchParams({});
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortBy(sortValue);

    // Convert frontend sort values to MongoDB sort values
    const sortMap = {
      'newest': '-createdAt',
      'price-low': 'priceRange.min',
      'price-high': '-priceRange.min',
      'featured': '-featured',
    };

    updateFilters({ ...filters, sort: sortMap[sortValue] || '-createdAt' });
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== '-createdAt').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, builder, or location..."
                value={filters.search}
                onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-800 text-white text-xs font-medium rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="featured">Featured First</option>
              </select>

              {/* View Toggle */}
              <div className="hidden md:flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.city && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {filters.city}
                  <button onClick={() => updateFilters({ ...filters, city: '' })}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {filters.propertyType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {PROPERTY_TYPES.find((t) => t.value === filters.propertyType)?.label}
                  <button onClick={() => updateFilters({ ...filters, propertyType: '' })}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {filters.configuration && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {filters.configuration}
                  <button onClick={() => updateFilters({ ...filters, configuration: '' })}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {PROPERTY_CATEGORIES.find((c) => c.value === filters.category)?.label}
                  <button onClick={() => updateFilters({ ...filters, category: '' })}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {(() => {
                    const formatPrice = (value) => {
                      if (!value) return '';
                      if (value >= 10000000) {
                        return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 1)} Cr`;
                      }
                      return `₹${(value / 100000).toFixed(0)} Lac`;
                    };
                    if (filters.minPrice && filters.maxPrice) {
                      return `${formatPrice(filters.minPrice)} - ${formatPrice(filters.maxPrice)}`;
                    }
                    if (filters.minPrice) {
                      return `Above ${formatPrice(filters.minPrice)}`;
                    }
                    return `Under ${formatPrice(filters.maxPrice)}`;
                  })()}
                  <button onClick={() => updateFilters({ ...filters, minPrice: '', maxPrice: '' })}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing{' '}
            <span className="font-semibold text-gray-900">
              {pagination.total || 0}
            </span>{' '}
            properties
          </p>
        </div>

        {/* Property Grid */}
        <PropertyGrid
          properties={properties}
          loading={loading}
          columns={viewMode === 'grid' ? 3 : 1}
          emptyMessage="No properties found matching your criteria. Try adjusting your filters."
        />

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              disabled={pagination.page === 1}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
            >
              Previous
            </button>
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .slice(Math.max(0, pagination.page - 3), Math.min(pagination.pages, pagination.page + 2))
                .map((page) => (
                  <button
                    key={page}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base cursor-pointer ${
                      page === pagination.page
                        ? 'bg-blue-800 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
            </div>
            <button
              disabled={pagination.page === pagination.pages}
              className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm sm:text-base cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FiltersPanel
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onFilterChange={updateFilters}
        onClearAll={clearAllFilters}
      />
    </div>
  );
};

export default PropertiesPage;