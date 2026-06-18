import { useState, useEffect } from 'react';
import { Plus, X, Upload, Image, Home, Building, MapPin, Store, Briefcase, Warehouse, Layers, Factory, Tractor, TreePine } from 'lucide-react';
import { mediaAPI, getFileUrl } from '../../../services/api.js';

// Default price includes items
const defaultPriceIncludes = [
  'Car Parking',
  'Clubhouse Membership',
  'Maintenance (1 Year)',
  'All Statutory Charges',
];

// Configuration presets based on property type
const configurationPresets = {
  // Residential
  apartment: {
    icon: Building,
    label: 'Apartment',
    configurations: ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', 'Studio'],
    sizePlaceholder: 'e.g., 1200 sq.ft.',
    pricePlaceholder: 'e.g., ₹85 Lac',
    showUnitPlan: true,
  },
  studio: {
    icon: Building,
    label: 'Studio',
    configurations: ['Studio', 'Studio Premium', 'Studio Deluxe'],
    sizePlaceholder: 'e.g., 400 sq.ft.',
    pricePlaceholder: 'e.g., ₹35 Lac',
    showUnitPlan: true,
  },
  duplex: {
    icon: Building,
    label: 'Duplex',
    configurations: ['2BHK Duplex', '3BHK Duplex', '4BHK Duplex'],
    sizePlaceholder: 'e.g., 2000 sq.ft.',
    pricePlaceholder: 'e.g., ₹1.2 Cr',
    showUnitPlan: true,
  },
  penthouse: {
    icon: Building,
    label: 'Penthouse',
    configurations: ['3BHK Penthouse', '4BHK Penthouse', '5BHK Penthouse'],
    sizePlaceholder: 'e.g., 3000 sq.ft.',
    pricePlaceholder: 'e.g., ₹2.5 Cr',
    showUnitPlan: true,
  },
  villa: {
    icon: Home,
    label: 'Villa',
    configurations: ['3BHK Villa', '4BHK Villa', '5BHK Villa', 'Duplex Villa'],
    sizePlaceholder: 'e.g., 2400 sq.ft. plot',
    pricePlaceholder: 'e.g., ₹1.5 Cr',
    showUnitPlan: false,
  },
  'row-house': {
    icon: Layers,
    label: 'Row House',
    configurations: ['2BHK Row House', '3BHK Row House', '4BHK Row House'],
    sizePlaceholder: 'e.g., 1500 sq.ft.',
    pricePlaceholder: 'e.g., ₹95 Lac',
    showUnitPlan: true,
  },
  'builder-floor': {
    icon: Building,
    label: 'Builder Floor',
    configurations: ['2BHK Floor', '3BHK Floor', '4BHK Floor'],
    sizePlaceholder: 'e.g., 1500 sq.ft.',
    pricePlaceholder: 'e.g., ₹90 Lac',
    showUnitPlan: true,
  },
  bungalow: {
    icon: Home,
    label: 'Bungalow',
    configurations: ['4BHK Bungalow', '5BHK Bungalow', '6BHK Bungalow'],
    sizePlaceholder: 'e.g., 4000 sq.ft.',
    pricePlaceholder: 'e.g., ₹3 Cr',
    showUnitPlan: false,
  },
  'farm-house': {
    icon: TreePine,
    label: 'Farm House',
    configurations: ['3BHK Farm House', '4BHK Farm House', '5BHK Farm House'],
    sizePlaceholder: 'e.g., 5000 sq.ft. plot',
    pricePlaceholder: 'e.g., ₹2 Cr',
    showUnitPlan: false,
  },
  // Land
  'residential-plot': {
    icon: MapPin,
    label: 'Residential Plot',
    configurations: ['30x40', '40x60', '50x80', '60x100', '80x120'],
    sizePlaceholder: 'e.g., 1200 sq.ft.',
    pricePlaceholder: 'e.g., ₹60 Lac',
    showUnitPlan: false,
  },
  'commercial-plot': {
    icon: MapPin,
    label: 'Commercial Plot',
    configurations: ['50x80', '60x100', '80x120', '100x150'],
    sizePlaceholder: 'e.g., 4000 sq.ft.',
    pricePlaceholder: 'e.g., ₹2 Cr',
    showUnitPlan: false,
  },
  'agricultural-land': {
    icon: Tractor,
    label: 'Agricultural Land',
    configurations: ['1 Acre', '2 Acres', '5 Acres', '10 Acres'],
    sizePlaceholder: 'e.g., 43560 sq.ft.',
    pricePlaceholder: 'e.g., ₹50 Lac',
    showUnitPlan: false,
  },
  // Commercial
  shop: {
    icon: Store,
    label: 'Shop',
    configurations: ['Small Shop', 'Medium Shop', 'Large Shop'],
    sizePlaceholder: 'e.g., 500 sq.ft.',
    pricePlaceholder: 'e.g., ₹30 Lac',
    showUnitPlan: true,
  },
  office: {
    icon: Briefcase,
    label: 'Office Space',
    configurations: ['Small Office', 'Medium Office', 'Large Office'],
    sizePlaceholder: 'e.g., 1000 sq.ft.',
    pricePlaceholder: 'e.g., ₹75 Lac',
    showUnitPlan: true,
  },
  showroom: {
    icon: Store,
    label: 'Showroom',
    configurations: ['Small Showroom', 'Medium Showroom', 'Large Showroom'],
    sizePlaceholder: 'e.g., 2000 sq.ft.',
    pricePlaceholder: 'e.g., ₹1.5 Cr',
    showUnitPlan: false,
  },
  warehouse: {
    icon: Warehouse,
    label: 'Warehouse',
    configurations: ['Small Warehouse', 'Medium Warehouse', 'Large Warehouse'],
    sizePlaceholder: 'e.g., 5000 sq.ft.',
    pricePlaceholder: 'e.g., ₹1 Cr',
    showUnitPlan: false,
  },
  // Industrial
  'industrial-shed': {
    icon: Factory,
    label: 'Industrial Shed',
    configurations: ['Small Shed', 'Medium Shed', 'Large Shed'],
    sizePlaceholder: 'e.g., 10000 sq.ft.',
    pricePlaceholder: 'e.g., ₹2 Cr',
    showUnitPlan: false,
  },
  factory: {
    icon: Factory,
    label: 'Factory',
    configurations: ['Small Factory', 'Medium Factory', 'Large Factory'],
    sizePlaceholder: 'e.g., 20000 sq.ft.',
    pricePlaceholder: 'e.g., ₹5 Cr',
    showUnitPlan: false,
  },
};

const defaultConfiguration = {
  configuration: '',
  size: '',
  price: '',
  unitPlan: { url: '', publicId: '' },
  isCustom: false,
};

const PricingPlansStep = ({ propertyData, updatePropertyData }) => {
  const [plans, setPlans] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customConfig, setCustomConfig] = useState({ configuration: '', size: '', price: '' });
  const [errors, setErrors] = useState({});
  const [priceIncludes, setPriceIncludes] = useState([]);
  const [newIncludeItem, setNewIncludeItem] = useState('');

  const propertyType = propertyData.propertyType || 'apartment';
  const preset = configurationPresets[propertyType] || configurationPresets.apartment;
  const PresetIcon = preset.icon;

  // Initialize plans from propertyData
  useEffect(() => {
    const existingPlans = propertyData.pricingPlans || [];
    if (existingPlans.length > 0) {
      setPlans(existingPlans);
    } else {
      // Initialize with default empty rows based on preset
      const defaultPlans = preset.configurations.slice(0, 3).map(config => ({
        ...defaultConfiguration,
        configuration: '',
      }));
      setPlans(defaultPlans);
    }
  }, [propertyType]);

  // Initialize priceIncludes from propertyData
  useEffect(() => {
    const existingIncludes = propertyData.priceIncludes || [];
    if (existingIncludes.length > 0) {
      setPriceIncludes(existingIncludes.map(item => typeof item === 'string' ? item : item.type || item));
    } else {
      setPriceIncludes(defaultPriceIncludes);
    }
  }, []);

  // Update parent state when plans change
  useEffect(() => {
    updatePropertyData('pricingPlans', plans);
    autoCalculatePriceRange(plans);
  }, [plans]);

  // Update parent state when priceIncludes changes
  useEffect(() => {
    updatePropertyData('priceIncludes', priceIncludes);
  }, [priceIncludes]);

  // Add new price include item
  const handleAddIncludeItem = () => {
    if (newIncludeItem.trim() && !priceIncludes.includes(newIncludeItem.trim())) {
      setPriceIncludes([...priceIncludes, newIncludeItem.trim()]);
      setNewIncludeItem('');
    }
  };

  // Remove price include item
  const handleRemoveIncludeItem = (index) => {
    setPriceIncludes(priceIncludes.filter((_, i) => i !== index));
  };

  // Quick add suggestions for price includes
  const suggestedIncludes = [
    'Car Parking',
    'Clubhouse Membership',
    'Power Backup',
    'Maintenance',
    'Registration Charges',
    'Stamp Duty',
    'Home Loan Assistance',
    'Interior Consultation',
    'Modular Kitchen',
    'Smart Home Setup',
    'Landscaping',
    'Security System',
  ].filter(item => !priceIncludes.includes(item));

  // Auto-calculate price range from plans
  const autoCalculatePriceRange = (planList) => {
    const validPlans = planList.filter(p => p.priceValue && p.priceValue > 0);

    if (validPlans.length === 0) {
      return;
    }

    const prices = validPlans.map(p => {
      const value = p.priceValue;
      const unit = p.priceUnit || 'lac';
      // Convert to lac for comparison
      return unit === 'cr' ? value * 100 : value;
    });

    const minLac = Math.min(...prices);
    const maxLac = Math.max(...prices);

    // Convert back to appropriate units
    const minPrice = minLac >= 100 ? minLac / 100 : minLac;
    const maxPrice = maxLac >= 100 ? maxLac / 100 : maxLac;
    const minUnit = minLac >= 100 ? 'cr' : 'lac';
    const maxUnit = maxLac >= 100 ? 'cr' : 'lac';

    updatePropertyData('priceRange', {
      min: Math.round(minPrice * 100) / 100,
      max: Math.round(maxPrice * 100) / 100,
      minUnit,
      maxUnit,
    });
  };

  // Parse price string to value and unit
  const parsePrice = (priceStr) => {
    if (!priceStr) return { value: null, unit: 'lac' };

    const cleanStr = priceStr.toLowerCase().replace(/[^0-9.]/g, '');
    const value = parseFloat(cleanStr) || null;

    let unit = 'lac';
    if (priceStr.toLowerCase().includes('cr') || priceStr.toLowerCase().includes('crore')) {
      unit = 'cr';
    }

    return { value, unit };
  };

  // Handle configuration change
  const handleConfigChange = (index, field, value) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };

    if (field === 'price') {
      const { value: priceValue, unit: priceUnit } = parsePrice(value);
      newPlans[index].priceValue = priceValue;
      newPlans[index].priceUnit = priceUnit;
    }

    setPlans(newPlans);

    if (errors[`plan-${index}`]) {
      setErrors(prev => ({ ...prev, [`plan-${index}`]: null }));
    }
  };

  // Handle unit plan upload
  const handleUnitPlanUpload = async (index, file) => {
    if (!file) return;

    setUploadingIndex(index);
    try {
      const response = await mediaAPI.uploadImage(file);
      // Extract URL and publicId from the response
      const data = response.data.data;
      const newPlans = [...plans];
      newPlans[index] = {
        ...newPlans[index],
        unitPlan: {
          url: data.url,
          publicId: data.publicId,
        },
      };
      setPlans(newPlans);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Remove unit plan
  const handleRemoveUnitPlan = (index) => {
    const newPlans = [...plans];
    newPlans[index] = {
      ...newPlans[index],
      unitPlan: { url: '', publicId: '' },
    };
    setPlans(newPlans);
  };

  // Add new row
  const handleAddRow = () => {
    setPlans([...plans, { ...defaultConfiguration }]);
  };

  // Remove row
  const handleRemoveRow = (index) => {
    const newPlans = plans.filter((_, i) => i !== index);
    setPlans(newPlans);
  };

  // Add custom configuration
  const handleAddCustom = () => {
    if (!customConfig.configuration.trim()) {
      setErrors({ customConfig: 'Configuration name is required' });
      return;
    }

    const { value, unit } = parsePrice(customConfig.price);
    setPlans([
      ...plans,
      {
        ...defaultConfiguration,
        configuration: customConfig.configuration,
        size: customConfig.size,
        price: customConfig.price,
        priceValue: value,
        priceUnit: unit,
        isCustom: true,
      },
    ]);

    setCustomConfig({ configuration: '', size: '', price: '' });
    setShowCustomModal(false);
    setErrors({});
  };

  // Add preset configuration row
  const handleAddPresetConfig = (config) => {
    const exists = plans.some(p => p.configuration === config);
    if (!exists) {
      setPlans([...plans, { ...defaultConfiguration, configuration: config }]);
    }
  };

  // Validation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.pricingPlansStepValidation = () => {
        const newErrors = {};
        const validPlans = plans.filter(p => p.configuration || p.size || p.price);

        if (validPlans.length === 0) {
          newErrors.plans = 'At least one pricing plan is required';
        }

        validPlans.forEach((plan, index) => {
          if (!plan.configuration) {
            newErrors[`plan-${index}-config`] = 'Configuration is required';
          }
          if (!plan.price) {
            newErrors[`plan-${index}-price`] = 'Price is required';
          }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    }
  }, [plans]);

  // Get unused preset configurations
  const unusedPresetConfigs = preset.configurations.filter(
    config => !plans.some(p => p.configuration === config)
  );

  // Calculate display price range
  const priceRange = propertyData.priceRange || {};
  const displayPriceRange = () => {
    if (!priceRange.min && !priceRange.max) return 'Add plans to auto-calculate';

    const minDisplay = priceRange.minUnit === 'cr'
      ? `₹${priceRange.min} Cr`
      : `₹${priceRange.min} Lac`;
    const maxDisplay = priceRange.maxUnit === 'cr'
      ? `₹${priceRange.max} Cr`
      : `₹${priceRange.max} Lac`;

    if (priceRange.min === priceRange.max && priceRange.minUnit === priceRange.maxUnit) {
      return `Starting from ${minDisplay}`;
    }

    return `${minDisplay} — ${maxDisplay}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <PresetIcon className="w-5 h-5 text-blue-800" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pricing & Plans</h3>
            <p className="text-sm text-gray-500">
              Add pricing configurations for {propertyType.replace('-', ' ')}
            </p>
          </div>
        </div>

        {/* Auto-calculated price range */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Auto-calculated Price Range</p>
              <p className="text-lg font-bold text-gray-900">{displayPriceRange()}</p>
              <p className="text-xs text-gray-500 mt-1">This will be displayed in the hero section</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">Property Type:</span>
              <p className="text-sm font-medium text-blue-800 capitalize">{propertyType.replace('-', ' ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-4">Configurations</h4>

        {errors.plans && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {errors.plans}
          </div>
        )}

        <div className="space-y-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Configuration Select */}
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Configuration</label>
                  {plan.isCustom ? (
                    <input
                      type="text"
                      value={plan.configuration}
                      onChange={(e) => handleConfigChange(index, 'configuration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Custom configuration"
                    />
                  ) : (
                    <select
                      value={plan.configuration}
                      onChange={(e) => handleConfigChange(index, 'configuration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select configuration</option>
                      {preset.configurations.map(config => (
                        <option key={config} value={config}>{config}</option>
                      ))}
                      <option value="__custom__">+ Custom</option>
                    </select>
                  )}
                  {errors[`plan-${index}-config`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`plan-${index}-config`]}</p>
                  )}
                </div>

                {/* Size */}
                <div className="w-32">
                  <label className="block text-xs text-gray-500 mb-1">Size</label>
                  <input
                    type="text"
                    value={plan.size}
                    onChange={(e) => handleConfigChange(index, 'size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={preset.sizePlaceholder}
                  />
                </div>

                {/* Price */}
                <div className="w-32">
                  <label className="block text-xs text-gray-500 mb-1">Price *</label>
                  <input
                    type="text"
                    value={plan.price}
                    onChange={(e) => handleConfigChange(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={preset.pricePlaceholder}
                  />
                  {errors[`plan-${index}-price`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`plan-${index}-price`]}</p>
                  )}
                </div>

                {/* Unit Plan (only for property types that have unit plans) */}
                {preset.showUnitPlan && (
                  <div className="w-24">
                    <label className="block text-xs text-gray-500 mb-1">Unit Plan</label>
                    {plan.unitPlan?.url ? (
                      <div className="relative group">
                        <img
                          src={getFileUrl(plan.unitPlan.url)}
                          alt="Unit plan"
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleRemoveUnitPlan(index)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                        {uploadingIndex === index ? (
                          <div className="w-4 h-4 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-400 mt-1">Upload</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUnitPlanUpload(index, e.target.files[0])}
                          disabled={uploadingIndex !== null}
                        />
                      </label>
                    )}
                  </div>
                )}

                {/* Remove Button */}
                <div className="pt-5">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {/* Quick Add Preset Configs */}
          {unusedPresetConfigs.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Quick add:</span>
              {unusedPresetConfigs.slice(0, 3).map(config => (
                <button
                  key={config}
                  onClick={() => handleAddPresetConfig(config)}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition-colors"
                >
                  + {config}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAddRow}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Custom Configuration
          </button>
        </div>
      </div>

      {/* Price Includes Section */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Includes</h3>
        <p className="text-sm text-gray-500 mb-4">Add items that are included in the property price</p>

        {/* Current Items */}
        <div className="flex flex-wrap gap-2 mb-4">
          {priceIncludes.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg group"
            >
              <span className="text-sm text-gray-700">{item}</span>
              <button
                onClick={() => handleRemoveIncludeItem(index)}
                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Item */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newIncludeItem}
            onChange={(e) => setNewIncludeItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIncludeItem())}
            placeholder="Add new item..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddIncludeItem}
            disabled={!newIncludeItem.trim()}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {/* Quick Add Suggestions */}
        {suggestedIncludes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-400 mr-2">Quick add:</span>
            {suggestedIncludes.slice(0, 6).map((item) => (
              <button
                key={item}
                onClick={() => setPriceIncludes([...priceIncludes, item])}
                className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                + {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Price range is auto-calculated from the configurations you add</li>
          <li>• Floor plan images are optional but recommended</li>
          <li>• Use "Add Custom Configuration" for unique unit types</li>
          <li>• You can reorder configurations by dragging</li>
        </ul>
      </div>

      {/* Custom Configuration Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Configuration</h3>

            {errors.customConfig && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {errors.customConfig}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Configuration Name *
                </label>
                <input
                  type="text"
                  value={customConfig.configuration}
                  onChange={(e) => setCustomConfig({ ...customConfig, configuration: e.target.value })}
                  placeholder="e.g., Studio, Duplex, Penthouse"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={customConfig.size}
                  onChange={(e) => setCustomConfig({ ...customConfig, size: e.target.value })}
                  placeholder={preset.sizePlaceholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="text"
                  value={customConfig.price}
                  onChange={(e) => setCustomConfig({ ...customConfig, price: e.target.value })}
                  placeholder={preset.pricePlaceholder}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  setCustomConfig({ configuration: '', size: '', price: '' });
                  setErrors({});
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustom}
                className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingPlansStep;