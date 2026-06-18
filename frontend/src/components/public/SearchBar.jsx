import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronDown, X } from 'lucide-react';
import { INDIAN_CITIES, PROPERTY_TYPES, PROPERTY_TYPE_GROUPS, CONFIGURATIONS } from '../../utils/constants.js';

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
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
          >
            <MapPin className="w-5 h-5 text-slate-700 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-0.5">Location</p>
              <p className="font-medium text-slate-800 truncate">
                {selectedCity || 'Select City'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showCityDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50 max-h-64 overflow-y-auto"
              >
                {INDIAN_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      handleChange('city', city);
                      setShowCityDropdown(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                      formData.city === city ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-700'
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
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-0.5">Property Type</p>
              <p className="font-medium text-slate-800 truncate">
                {selectedType?.label || 'All Types'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showTypeDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50 max-h-80 overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleChange('propertyType', '');
                    setShowTypeDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                    !formData.propertyType ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-700'
                  }`}
                >
                  All Types
                </button>

                {/* Grouped Property Types */}
                {PROPERTY_TYPE_GROUPS.map((group) => (
                  <div key={group.label}>
                    <div className="px-4 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {group.label}
                    </div>
                    {group.types.map((typeValue) => {
                      const type = PROPERTY_TYPES.find((t) => t.value === typeValue);
                      return (
                        <button
                          key={typeValue}
                          type="button"
                          onClick={() => {
                            handleChange('propertyType', typeValue);
                            setShowTypeDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 transition-colors ${
                            formData.propertyType === typeValue ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-700'
                          }`}
                        >
                          {type?.label || typeValue}
                        </button>
                      );
                    })}
                  </div>
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
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
          >
            <div className="w-5 h-5 flex-shrink-0">
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-0.5">Configuration</p>
              <p className="font-medium text-slate-800 truncate">
                {selectedConfig || 'All Configs'}
              </p>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showConfigDropdown ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showConfigDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    handleChange('configuration', '');
                    setShowConfigDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                    !formData.configuration ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-700'
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
                    className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                      formData.configuration === config ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-700'
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
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-all shadow-lg shadow-slate-800/30 cursor-pointer"
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
          className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100"
        >
          <span className="text-sm text-slate-500">Selected:</span>
          {formData.city && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 text-sm font-medium rounded-full">
              {formData.city}
              <button onClick={() => handleClear('city')} className="hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {formData.propertyType && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 text-sm font-medium rounded-full">
              {selectedType?.label}
              <button onClick={() => handleClear('propertyType')} className="hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {formData.configuration && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 text-sm font-medium rounded-full">
              {formData.configuration}
              <button onClick={() => handleClear('configuration')} className="hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={() => setFormData({ city: '', propertyType: '', configuration: '', search: '' })}
            className="text-sm text-slate-500 hover:text-slate-700 underline ml-2"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;