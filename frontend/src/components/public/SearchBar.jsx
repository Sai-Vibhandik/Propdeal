import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { INDIAN_CITIES, PROPERTY_TYPES, CONFIGURATIONS } from '../../utils/constants.js';

const SearchBar = ({ onSearch, initialValues = {}, variant = 'default' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    city: initialValues.city || '',
    propertyType: initialValues.propertyType || '',
    configuration: initialValues.configuration || '',
    search: initialValues.search || '',
  });

  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showConfigDropdown, setShowConfigDropdown] = useState(false);

  const cityRef = useRef(null);
  const typeRef = useRef(null);
  const configRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityRef.current && !cityRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
      if (typeRef.current && !typeRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
      if (configRef.current && !configRef.current.contains(event.target)) {
        setShowConfigDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(formData);
    }
  };

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const variantStyles = {
    default: 'bg-white shadow-lg',
    hero: 'bg-white/95 backdrop-blur-lg shadow-2xl',
    compact: 'bg-white shadow-md',
  };

  const selectedCity = INDIAN_CITIES.find((c) => c === formData.city);
  const selectedType = PROPERTY_TYPES.find((t) => t.value === formData.propertyType);
  const selectedConfig = formData.configuration;

  return (
    <div className={`w-full max-w-5xl mx-auto ${variantStyles[variant]} rounded-2xl p-6`}>
      {/* Main Search Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* City Dropdown */}
        <div className="relative flex-1" ref={cityRef}>
          <button
            type="button"
            onClick={() => {
              setShowCityDropdown(!showCityDropdown);
              setShowTypeDropdown(false);
              setShowConfigDropdown(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <MapPin className="w-5 h-5 text-blue-800 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Location</p>
              <p className="font-medium text-gray-900 truncate">
                {selectedCity || 'Select City'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
              >
                {INDIAN_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      handleChange('city', city);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                      formData.city === city ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Property Type Dropdown */}
        <div className="relative flex-1" ref={typeRef}>
          <button
            type="button"
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown);
              setShowCityDropdown(false);
              setShowConfigDropdown(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <svg className="w-5 h-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Property Type</p>
              <p className="font-medium text-gray-900 truncate">
                {selectedType?.label || 'All Types'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTypeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleChange('propertyType', '');
                    setShowTypeDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                    !formData.propertyType ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-700'
                  }`}
                >
                  All Types
                </button>
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      handleChange('propertyType', type.value);
                      setShowTypeDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                      formData.propertyType === type.value ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Configuration Dropdown */}
        <div className="relative flex-1" ref={configRef}>
          <button
            type="button"
            onClick={() => {
              setShowConfigDropdown(!showConfigDropdown);
              setShowCityDropdown(false);
              setShowTypeDropdown(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <svg className="w-5 h-5 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">Configuration</p>
              <p className="font-medium text-gray-900 truncate">
                {selectedConfig || 'All Configs'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showConfigDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showConfigDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleChange('configuration', '');
                    setShowConfigDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                    !formData.configuration ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-700'
                  }`}
                >
                  All Configurations
                </button>
                {CONFIGURATIONS.map((config) => (
                  <button
                    key={config}
                    type="button"
                    onClick={() => {
                      handleChange('configuration', config);
                      setShowConfigDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors ${
                      formData.configuration === config ? 'bg-blue-50 text-blue-800 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {config}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <motion.button
          type="button"
          onClick={handleSearch}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-800 to-blue-900 text-white font-semibold rounded-xl hover:from-blue-900 hover:to-blue-950 transition-all shadow-lg shadow-blue-800/30"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </motion.button>
      </div>

      {/* Selected Filters */}
      {(formData.city || formData.propertyType || formData.configuration) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100"
        >
          <span className="text-sm text-gray-500">Selected:</span>
          {formData.city && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {formData.city}
              <button onClick={() => handleClear('city')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {formData.propertyType && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {selectedType?.label}
              <button onClick={() => handleClear('propertyType')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {formData.configuration && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {formData.configuration}
              <button onClick={() => handleClear('configuration')} className="hover:text-blue-900">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={() => setFormData({ city: '', propertyType: '', configuration: '', search: '' })}
            className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;