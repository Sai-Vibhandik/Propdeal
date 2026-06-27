import { useState, useEffect } from 'react';
import { MapPin, Building2, Calendar, Layers, Hash, Plus, X, Trash2, ShoppingBag, Heart, Book, Train, Utensils, Dumbbell, TreePine, Fuel, Banknote, Upload, Edit3 } from 'lucide-react';
import { mediaAPI, getFileUrl } from '../../../services/api.js';

// Place types for nearby places
const placeTypes = [
  { value: 'school', label: 'School', icon: Book },
  { value: 'hospital', label: 'Hospital', icon: Heart },
  { value: 'shopping', label: 'Shopping Mall', icon: ShoppingBag },
  { value: 'work', label: 'IT Park / Office', icon: Building2 },
  { value: 'transport', label: 'Metro / Bus', icon: Train },
  { value: 'restaurant', label: 'Restaurant', icon: Utensils },
  { value: 'gym', label: 'Gym / Fitness', icon: Dumbbell },
  { value: 'park', label: 'Park', icon: TreePine },
  { value: 'bank', label: 'Bank / ATM', icon: Banknote },
  { value: 'fuel', label: 'Fuel Station', icon: Fuel },
  { value: 'other', label: 'Other', icon: MapPin },
];

// Property type specific field configurations
const propertyTypeFields = {
  // Residential - Apartments/Villas
  apartment: { showUnits: true, showFloors: true, showUnitSize: true, showConfigurations: true },
  studio: { showUnits: true, showFloors: true, showUnitSize: true },
  duplex: { showUnits: true, showFloors: true, showUnitSize: true },
  penthouse: { showUnits: true, showFloors: true, showUnitSize: true },
  villa: { showUnits: false, showFloors: true, showUnitSize: true, showPlotSize: true },
  'row-house': { showUnits: true, showFloors: true, showUnitSize: true },
  'builder-floor': { showUnits: true, showFloors: true, showUnitSize: true },
  bungalow: { showUnits: false, showFloors: true, showUnitSize: true, showPlotSize: true },
  'farm-house': { showUnits: false, showFloors: true, showUnitSize: true, showPlotSize: true, showLandArea: true },

  // Land
  'residential-plot': { showLandArea: true, showDimensions: true, showFacing: true },
  'commercial-plot': { showLandArea: true, showDimensions: true, showFacing: true },
  'agricultural-land': { showLandArea: true, showDimensions: true },

  // Commercial
  shop: { showUnits: true, showFloors: true, showUnitSize: true },
  office: { showUnits: true, showFloors: true, showUnitSize: true },
  showroom: { showUnits: true, showFloors: true, showUnitSize: true },
  warehouse: { showLandArea: true, showBuiltUp: true },

  // Industrial
  'industrial-shed': { showLandArea: true, showBuiltUp: true },
  factory: { showLandArea: true, showBuiltUp: true, showFloors: true },
};

// Field character limits (min and max)
const fieldLimits = {
  name: { min: 3, max: 80 },
  slug: { min: 3, max: 80 },
  builder: { min: 2, max: 100 },
  fullAddress: { min: 10, max: 500 },
  locality: { min: 2, max: 100 },
  city: { min: 2, max: 100 },
  state: { min: 2, max: 100 },
  pincode: { min: 6, max: 10 },
  landmark: { min: 3, max: 200 },
  googleMapUrl: { min: 10, max: 2000 },
  reraNumber: { min: 5, max: 100 },
  reraWebsite: { min: 10, max: 500 },
  advertiserName: { min: 2, max: 100 },
  advertiserRegNo: { min: 3, max: 50 },
  totalArea: { min: 1, max: 100 },
  totalUnits: { min: 1, max: 20 },
  totalFloors: { min: 1, max: 20 },
  unitSize: { min: 1, max: 100 },
  plotSize: { min: 1, max: 100 },
  landArea: { min: 1, max: 100 },
  dimensions: { min: 1, max: 100 },
  facing: { min: 1, max: 50 },
  builtUpArea: { min: 1, max: 100 },
  nearbyPlaceName: { min: 2, max: 100 },
  nearbyPlaceDistance: { min: 1, max: 20 },
};

const BasicInfoStep = ({ propertyData, updatePropertyData }) => {
  const [errors, setErrors] = useState({});
  const [uploadingReraQr, setUploadingReraQr] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: '', distance: '', type: 'school' });
  const [newCustomField, setNewCustomField] = useState({ label: '', value: '' });

  // Get fields configuration based on property type
  const fieldConfig = propertyTypeFields[propertyData.propertyType] || propertyTypeFields.apartment;

  // Normalize propertyCategory to lowercase on mount
  useEffect(() => {
    if (propertyData.propertyCategory && propertyData.propertyCategory !== propertyData.propertyCategory.toLowerCase()) {
      updatePropertyData('propertyCategory', propertyData.propertyCategory.toLowerCase());
    }
  }, []);

  // Auto-generate slug from name if not manually edited
  useEffect(() => {
    if (!slugManuallyEdited && propertyData.name) {
      const autoSlug = propertyData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      if (autoSlug !== propertyData.slug) {
        updatePropertyData('slug', autoSlug);
      }
    }
  }, [propertyData.name, slugManuallyEdited]);

  const handleChange = (field, value) => {
    updatePropertyData(field, value);
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePriceChange = (field, value) => {
    updatePropertyData(field, value);
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSlugChange = (value) => {
    setSlugManuallyEdited(true);
    updatePropertyData('slug', value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  };

  const handleAddressChange = (field, value) => {
    updatePropertyData(['address', field], value);
    // Clear error when user types
    if (errors[`address.${field}`]) {
      setErrors((prev) => ({ ...prev, [`address.${field}`]: null }));
    }
  };

  // Validation function with min/max length check
  const validateField = (field, value, limits) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    if (limits) {
      if (value.length < limits.min) {
        return `Minimum ${limits.min} characters required`;
      }
      if (value.length > limits.max) {
        return `Maximum ${limits.max} characters allowed`;
      }
    }
    return null;
  };

  // Expose validation function for parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.basicInfoStepValidation = () => {
        const newErrors = {};

        // Property Details - name
        if (!propertyData.name?.trim()) {
          newErrors.name = 'Property name is required';
        } else if (propertyData.name.length < fieldLimits.name.min) {
          newErrors.name = `Minimum ${fieldLimits.name.min} characters required`;
        } else if (propertyData.name.length > fieldLimits.name.max) {
          newErrors.name = `Maximum ${fieldLimits.name.max} characters allowed`;
        }

        // Builder name
        if (!propertyData.builder?.trim()) {
          newErrors.builder = 'Builder/Developer name is required';
        } else if (propertyData.builder.length < fieldLimits.builder.min) {
          newErrors.builder = `Minimum ${fieldLimits.builder.min} characters required`;
        } else if (propertyData.builder.length > fieldLimits.builder.max) {
          newErrors.builder = `Maximum ${fieldLimits.builder.max} characters allowed`;
        }

        // Location - Full Address
        if (!propertyData.address?.fullAddress?.trim()) {
          newErrors['address.fullAddress'] = 'Full address is required';
        } else if (propertyData.address.fullAddress.length < fieldLimits.fullAddress.min) {
          newErrors['address.fullAddress'] = `Minimum ${fieldLimits.fullAddress.min} characters required`;
        } else if (propertyData.address.fullAddress.length > fieldLimits.fullAddress.max) {
          newErrors['address.fullAddress'] = `Maximum ${fieldLimits.fullAddress.max} characters allowed`;
        }

        // Locality
        if (!propertyData.address?.locality?.trim()) {
          newErrors['address.locality'] = 'Locality is required';
        } else if (propertyData.address.locality.length < fieldLimits.locality.min) {
          newErrors['address.locality'] = `Minimum ${fieldLimits.locality.min} characters required`;
        } else if (propertyData.address.locality.length > fieldLimits.locality.max) {
          newErrors['address.locality'] = `Maximum ${fieldLimits.locality.max} characters allowed`;
        }

        // City
        if (!propertyData.address?.city?.trim()) {
          newErrors['address.city'] = 'City is required';
        } else if (propertyData.address.city.length < fieldLimits.city.min) {
          newErrors['address.city'] = `Minimum ${fieldLimits.city.min} characters required`;
        } else if (propertyData.address.city.length > fieldLimits.city.max) {
          newErrors['address.city'] = `Maximum ${fieldLimits.city.max} characters allowed`;
        }

        // State
        if (!propertyData.address?.state?.trim()) {
          newErrors['address.state'] = 'State is required';
        } else if (propertyData.address.state.length < fieldLimits.state.min) {
          newErrors['address.state'] = `Minimum ${fieldLimits.state.min} characters required`;
        } else if (propertyData.address.state.length > fieldLimits.state.max) {
          newErrors['address.state'] = `Maximum ${fieldLimits.state.max} characters allowed`;
        }

        // Pincode
        if (!propertyData.address?.pincode?.trim()) {
          newErrors['address.pincode'] = 'Pincode is required';
        } else if (propertyData.address.pincode.length < fieldLimits.pincode.min) {
          newErrors['address.pincode'] = `Minimum ${fieldLimits.pincode.min} characters required`;
        } else if (propertyData.address.pincode.length > fieldLimits.pincode.max) {
          newErrors['address.pincode'] = `Maximum ${fieldLimits.pincode.max} characters allowed`;
        } else if (!/^\d+$/.test(propertyData.address.pincode)) {
          newErrors['address.pincode'] = 'Pincode must contain only numbers';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    }
  }, [propertyData]);

  const propertyTypes = [
    // Residential
    { value: 'apartment', label: 'Apartment', category: 'Residential' },
    { value: 'studio', label: 'Studio Apartment', category: 'Residential' },
    { value: 'duplex', label: 'Duplex', category: 'Residential' },
    { value: 'penthouse', label: 'Penthouse', category: 'Residential' },
    { value: 'villa', label: 'Villa / Independent House', category: 'Residential' },
    { value: 'row-house', label: 'Row House', category: 'Residential' },
    { value: 'builder-floor', label: 'Builder Floor', category: 'Residential' },
    { value: 'bungalow', label: 'Bungalow', category: 'Residential' },
    { value: 'farm-house', label: 'Farm House', category: 'Residential' },
    // Land
    { value: 'residential-plot', label: 'Residential Plot', category: 'Land' },
    { value: 'commercial-plot', label: 'Commercial Plot', category: 'Land' },
    { value: 'agricultural-land', label: 'Agricultural Land', category: 'Land' },
    // Commercial
    { value: 'shop', label: 'Shop / Retail', category: 'Commercial' },
    { value: 'office', label: 'Office Space', category: 'Commercial' },
    { value: 'showroom', label: 'Showroom', category: 'Commercial' },
    { value: 'warehouse', label: 'Warehouse', category: 'Commercial' },
    // Industrial
    { value: 'industrial-shed', label: 'Industrial Shed', category: 'Industrial' },
    { value: 'factory', label: 'Factory / Manufacturing', category: 'Industrial' },
  ];

  // Group property types by category
  const propertyTypeGroups = {
    'Residential': propertyTypes.filter(t => t.category === 'Residential'),
    'Land': propertyTypes.filter(t => t.category === 'Land'),
    'Commercial': propertyTypes.filter(t => t.category === 'Commercial'),
    'Industrial': propertyTypes.filter(t => t.category === 'Industrial'),
  };

  // Get category from property type (returns lowercase for schema)
  const getPropertyCategory = (type) => {
    const pt = propertyTypes.find(t => t.value === type);
    return pt?.category?.toLowerCase() || 'residential';
  };

  const categories = [
    { value: 'ready-to-move', label: 'Ready to Move' },
    { value: 'under-construction', label: 'Under Construction' },
    { value: 'new-launch', label: 'New Launch' },
    { value: 'pre-launch', label: 'Pre-Launch' },
  ];

  // Nearby Places handlers
  const nearbyPlaces = propertyData.nearbyPlaces || [];

  const handleAddPlace = () => {
    if (!newPlace.name.trim() || !newPlace.distance.trim()) return;
    const places = [...nearbyPlaces, { ...newPlace, id: Date.now() }];
    updatePropertyData('nearbyPlaces', places);
    setNewPlace({ name: '', distance: '', type: 'school' });
  };

  const handleRemovePlace = (index) => {
    const places = nearbyPlaces.filter((_, i) => i !== index);
    updatePropertyData('nearbyPlaces', places);
  };

  const handlePlaceChange = (index, field, value) => {
    const places = [...nearbyPlaces];
    places[index] = { ...places[index], [field]: value };
    updatePropertyData('nearbyPlaces', places);
  };

  // RERA QR Code upload
  const handleReraQrUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingReraQr(true);
    try {
      const response = await mediaAPI.uploadImage(file);
      if (response.data.success) {
        updatePropertyData('branding', {
          ...propertyData.branding,
          reraQrCode: response.data.data.url,
        });
      }
    } catch (err) {
      console.error('Failed to upload RERA QR code:', err);
    } finally {
      setUploadingReraQr(false);
    }
  };

  const removeReraQr = () => {
    updatePropertyData('branding', {
      ...propertyData.branding,
      reraQrCode: '',
    });
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-600 mt-1">Enter the property details and location</p>
      </div>

      {/* Property Name & Builder */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Name<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Prestige Lakeside Habitat"
              maxLength={fieldLimits.name.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.name?.length || 0}/{fieldLimits.name.max} characters (min {fieldLimits.name.min})</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">/property/</span>
              <input
                type="text"
                value={propertyData.slug || ''}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-name"
                maxLength={fieldLimits.slug.max}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Auto-generated from name. {propertyData.slug?.length || 0}/{fieldLimits.slug.max} characters (min {fieldLimits.slug.min})
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Builder/Developer Name<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.builder}
              onChange={(e) => handleChange('builder', e.target.value)}
              placeholder="e.g., Prestige Group"
              maxLength={fieldLimits.builder.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.builder ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.builder && <p className="text-red-500 text-sm mt-1">{errors.builder}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.builder?.length || 0}/{fieldLimits.builder.max} characters (min {fieldLimits.builder.min})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type<sup className="text-red-500">*</sup>
            </label>
            <select
              value={propertyData.propertyType}
              onChange={(e) => {
                handleChange('propertyType', e.target.value);
                handleChange('propertyCategory', getPropertyCategory(e.target.value));
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(propertyTypeGroups).map(([category, types]) => (
                <optgroup key={category} label={category}>
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category<sup className="text-red-500">*</sup>
            </label>
            <select
              value={propertyData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Possession Date
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="date"
              value={propertyData.possessionDate ? (typeof propertyData.possessionDate === 'string' && propertyData.possessionDate.includes('-') ? propertyData.possessionDate.split('T')[0] : new Date(propertyData.possessionDate).toISOString().split('T')[0]) : ''}
              onChange={(e) => handleChange('possessionDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Expected completion/possession date</p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location Details
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.address?.fullAddress}
              onChange={(e) => handleAddressChange('fullAddress', e.target.value)}
              placeholder="e.g., Whitefield Main Road, Bangalore - 560066"
              maxLength={fieldLimits.fullAddress.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.fullAddress'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.fullAddress'] && <p className="text-red-500 text-sm mt-1">{errors['address.fullAddress']}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.address?.fullAddress?.length || 0}/{fieldLimits.fullAddress.max} characters (min {fieldLimits.fullAddress.min})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locality<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.address?.locality}
              onChange={(e) => handleAddressChange('locality', e.target.value)}
              placeholder="e.g., Whitefield"
              maxLength={fieldLimits.locality.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.locality'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.locality'] && <p className="text-red-500 text-sm mt-1">{errors['address.locality']}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.address?.locality?.length || 0}/{fieldLimits.locality.max} characters (min {fieldLimits.locality.min})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.address?.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="e.g., Bangalore"
              maxLength={fieldLimits.city.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.city'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.address?.city?.length || 0}/{fieldLimits.city.max} characters (min {fieldLimits.city.min})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.address?.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="e.g., Karnataka"
              maxLength={fieldLimits.state.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.state'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.address?.state?.length || 0}/{fieldLimits.state.max} characters (min {fieldLimits.state.min})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode<sup className="text-red-500">*</sup>
            </label>
            <input
              type="text"
              value={propertyData.address?.pincode}
              onChange={(e) => handleAddressChange('pincode', e.target.value)}
              placeholder="e.g., 560066"
              maxLength={fieldLimits.pincode.max}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.pincode'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.pincode'] && <p className="text-red-500 text-sm mt-1">{errors['address.pincode']}</p>}
            <p className="text-xs text-gray-500 mt-1">{propertyData.address?.pincode?.length || 0}/{fieldLimits.pincode.max} characters (min {fieldLimits.pincode.min})</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
            <input
              type="text"
              value={propertyData.address?.landmark}
              onChange={(e) => handleAddressChange('landmark', e.target.value)}
              placeholder="e.g., Near ITPL"
              maxLength={fieldLimits.landmark.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.address?.landmark?.length || 0}/{fieldLimits.landmark.max} characters (min {fieldLimits.landmark.min})</p>
          </div>

          {/* Google Maps Embed URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps Embed
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={propertyData.googleMapUrl || ''}
              onChange={(e) => updatePropertyData('googleMapUrl', e.target.value)}
              placeholder="<iframe src='https://www.google.com/maps/embed?pb=...' ...></iframe>"
              maxLength={fieldLimits.googleMapUrl.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.googleMapUrl?.length || 0}/{fieldLimits.googleMapUrl.max} characters</p>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-900 mb-1">How to get the map embed:</p>
              <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a></li>
                <li>Search for your property location</li>
                <li>Click <strong>Share</strong> (button with arrow icon)</li>
                <li>Select <strong>Embed a map</strong> tab</li>
                <li>Click <strong>Copy HTML</strong> and paste here</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                You can paste the full iframe code or just the URL
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RERA Number
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={propertyData.reraNumber}
              onChange={(e) => handleChange('reraNumber', e.target.value)}
              placeholder="e.g., PRM/KA/RERA/1251/446/PR/171020/001"
              maxLength={fieldLimits.reraNumber.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.reraNumber?.length || 0}/{fieldLimits.reraNumber.max} characters (min {fieldLimits.reraNumber.min})</p>
          </div>

          {/* RERA QR Code Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RERA QR Code
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Upload the QR code image from your RERA certificate. This will be displayed in the hero section.
            </p>
            {propertyData.branding?.reraQrCode ? (
              <div className="flex items-start gap-4">
                <div className="relative group">
                  <img
                    src={getFileUrl(propertyData.branding.reraQrCode)}
                    alt="RERA QR Code"
                    className="w-32 h-32 object-contain rounded-lg border border-gray-200 bg-white p-2"
                  />
                  <button
                    onClick={removeReraQr}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium">QR Code uploaded</p>
                  <p className="text-xs text-gray-500 mt-1">The QR code will appear in the hero section next to RERA number.</p>
                </div>
              </div>
            ) : (
              <label className="block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleReraQrUpload}
                  disabled={uploadingReraQr}
                />
                {uploadingReraQr ? (
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mb-2" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload QR code</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            )}
          </div>

          {/* RERA Website URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RERA Website URL
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="url"
              value={propertyData.branding?.reraWebsite || ''}
              onChange={(e) => updatePropertyData('branding', {
                ...propertyData.branding,
                reraWebsite: e.target.value,
              })}
              placeholder="e.g., https://www.rera.delhi.gov.in/"
              maxLength={fieldLimits.reraWebsite.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.branding?.reraWebsite?.length || 0}/{fieldLimits.reraWebsite.max} characters (min {fieldLimits.reraWebsite.min})</p>
          </div>

          {/* Advertiser Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advertiser Name
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={propertyData.branding?.advertiserName || ''}
              onChange={(e) => updatePropertyData('branding', {
                ...propertyData.branding,
                advertiserName: e.target.value,
              })}
              placeholder="e.g., Homesfy Realty Ltd"
              maxLength={fieldLimits.advertiserName.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.branding?.advertiserName?.length || 0}/{fieldLimits.advertiserName.max} characters (min {fieldLimits.advertiserName.min})</p>
          </div>

          {/* Advertiser Registration No. */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Advertiser Reg. No.
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={propertyData.branding?.advertiserRegNo || ''}
              onChange={(e) => updatePropertyData('branding', {
                ...propertyData.branding,
                advertiserRegNo: e.target.value,
              })}
              placeholder="e.g., A51900000136"
              maxLength={fieldLimits.advertiserRegNo.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.branding?.advertiserRegNo?.length || 0}/{fieldLimits.advertiserRegNo.max} characters (min {fieldLimits.advertiserRegNo.min})</p>
          </div>
        </div>
      </div>

      {/* Property Details - Dynamic based on property type */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Project Details
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Land Area - shown for all property types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Land Area
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={propertyData.totalArea}
              onChange={(e) => handleChange('totalArea', e.target.value)}
              placeholder="e.g., 15 Acres, 50,000 sq.ft."
              maxLength={fieldLimits.totalArea.max}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">{propertyData.totalArea?.length || 0}/{fieldLimits.totalArea.max} characters (min {fieldLimits.totalArea.min})</p>
          </div>

          {/* Number of Units - only for apartments/offices */}
          {fieldConfig.showUnits && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Units
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <input
                type="text"
                value={propertyData.totalUnits}
                onChange={(e) => handleChange('totalUnits', e.target.value)}
                placeholder="e.g., 500"
                maxLength={fieldLimits.totalUnits.max}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{propertyData.totalUnits?.length || 0}/{fieldLimits.totalUnits.max} characters (min {fieldLimits.totalUnits.min})</p>
            </div>
          )}

          {/* Number of Floors - only for buildings */}
          {fieldConfig.showFloors && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Floors
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <input
                type="text"
                value={propertyData.totalFloors}
                onChange={(e) => handleChange('totalFloors', e.target.value)}
                placeholder="e.g., Stilt + 14, B+G+18"
                maxLength={fieldLimits.totalFloors.max}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{propertyData.totalFloors?.length || 0}/{fieldLimits.totalFloors.max} characters (min {fieldLimits.totalFloors.min})</p>
            </div>
          )}

          {/* Plot Facing - only for land/plots */}
          {fieldConfig.showFacing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plot Facing
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <select
                value={propertyData.plotFacing || ''}
                onChange={(e) => handleChange('plotFacing', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Facing</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="north-east">North East</option>
                <option value="north-west">North West</option>
                <option value="south-east">South East</option>
                <option value="south-west">South West</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Direction the plot faces</p>
            </div>
          )}

          {/* Built-up Area - for warehouses/factories */}
          {fieldConfig.showBuiltUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area
                <span className="text-gray-400 font-normal ml-1">(optional)</span>
              </label>
              <input
                type="text"
                value={propertyData.builtUpArea || ''}
                onChange={(e) => handleChange('builtUpArea', e.target.value)}
                placeholder="e.g., 20,000 sq.ft."
                maxLength={fieldLimits.builtUpArea.max}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">{propertyData.builtUpArea?.length || 0}/{fieldLimits.builtUpArea.max} characters (min {fieldLimits.builtUpArea.min})</p>
            </div>
          )}
        </div>

        {/* Unit Size Range - only for residential/commercial with units */}
        {fieldConfig.showUnitSize && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Unit Size Range
            </h4>
            <p className="text-sm text-gray-500 mb-4">Enter the size range for individual units</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Size
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="number"
                  value={propertyData.unitAreaRange?.min || ''}
                  onChange={(e) => updatePropertyData(['unitAreaRange', 'min'], e.target.value ? Number(e.target.value) : null)}
                  placeholder="1200"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Smallest unit size</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Size
                  <span className="text-gray-400 font-normal ml-1">(optional)</span>
                </label>
                <input
                  type="number"
                  value={propertyData.unitAreaRange?.max || ''}
                  onChange={(e) => updatePropertyData(['unitAreaRange', 'max'], e.target.value ? Number(e.target.value) : null)}
                  placeholder="3500"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Largest unit size</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area Unit</label>
                <select
                  value={propertyData.unitAreaRange?.unit || 'sq.ft.'}
                  onChange={(e) => updatePropertyData(['unitAreaRange', 'unit'], e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sq.ft.">Square Feet (sq.ft.)</option>
                  <option value="sq.m.">Square Meters (sq.m.)</option>
                  <option value="sq.yd.">Square Yards (sq.yd.)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Fields */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Edit3 className="w-5 h-5" />
          Additional Details
          <span className="text-sm font-normal text-gray-500">(custom fields)</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">Add any additional property details like Facing, Boundary Wall, Water Source, etc.</p>

        {/* Existing Custom Fields */}
        {(propertyData.customFields || []).length > 0 && (
          <div className="space-y-3 mb-4">
            {(propertyData.customFields || []).map((field, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      const newFields = [...(propertyData.customFields || [])];
                      newFields[index] = { ...newFields[index], label: e.target.value };
                      updatePropertyData('customFields', newFields);
                    }}
                    placeholder="Field name (e.g., Plot Facing)"
                    maxLength={50}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => {
                      const newFields = [...(propertyData.customFields || [])];
                      newFields[index] = { ...newFields[index], value: e.target.value };
                      updatePropertyData('customFields', newFields);
                    }}
                    placeholder="Value (e.g., East Facing)"
                    maxLength={200}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={() => {
                    const newFields = (propertyData.customFields || []).filter((_, i) => i !== index);
                    updatePropertyData('customFields', newFields);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Custom Field */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Add custom field:</p>
          <div className="flex items-end gap-3">
            <div className="flex-1 grid md:grid-cols-2 gap-3">
              <input
                type="text"
                value={newCustomField.label}
                onChange={(e) => setNewCustomField({ ...newCustomField, label: e.target.value })}
                placeholder="Field name (e.g., Plot Facing)"
                maxLength={50}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newCustomField.value}
                onChange={(e) => setNewCustomField({ ...newCustomField, value: e.target.value })}
                placeholder="Value (e.g., East Facing)"
                maxLength={200}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => {
                if (newCustomField.label.trim() && newCustomField.value.trim()) {
                  const newFields = [...(propertyData.customFields || []), { ...newCustomField }];
                  updatePropertyData('customFields', newFields);
                  setNewCustomField({ label: '', value: '' });
                }
              }}
              disabled={!newCustomField.label.trim() || !newCustomField.value.trim()}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Field
            </button>
          </div>
        </div>

        {/* Quick suggestions */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Facing', value: 'East' },
              { label: 'Boundary Wall', value: 'Yes' },
              { label: 'Water Source', value: 'Borewell' },
              { label: 'Road Width', value: '30 ft' },
              { label: 'Corner Plot', value: 'Yes' },
              { label: 'Approval', value: 'RERA Approved' },
              { label: 'Electricity', value: 'BESCOM' },
            ].map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => {
                  if (!(propertyData.customFields || []).some(f => f.label === suggestion.label)) {
                    // Directly add the field instead of just pre-filling
                    const newFields = [...(propertyData.customFields || []), { label: suggestion.label, value: suggestion.value }];
                    updatePropertyData('customFields', newFields);
                  }
                }}
                disabled={(propertyData.customFields || []).some(f => f.label === suggestion.label)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nearby Places */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Nearby Places
          <span className="text-sm font-normal text-gray-500">(optional)</span>
        </h3>
        <p className="text-sm text-gray-500 mb-4">Add important places near your property (schools, hospitals, malls, etc.)</p>

        {/* Add New Place Form */}
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Place Name</label>
            <input
              type="text"
              value={newPlace.name}
              onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              placeholder="e.g., Phoenix Mall"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
            <input
              type="text"
              value={newPlace.distance}
              onChange={(e) => setNewPlace({ ...newPlace, distance: e.target.value })}
              placeholder="e.g., 2 km"
              maxLength={50}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={newPlace.type}
              onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {placeTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPlace}
              disabled={!newPlace.name.trim() || !newPlace.distance.trim()}
              className="w-full px-4 py-3 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
        </div>

        {/* Added Places List */}
        {nearbyPlaces.length > 0 && (
          <div className="space-y-2">
            {nearbyPlaces.map((place, index) => {
              const TypeIcon = placeTypes.find(t => t.value === place.type)?.icon || MapPin;
              return (
                <div key={place.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TypeIcon className="w-4 h-4 text-blue-800" />
                  </div>
                  <div className="flex-1 grid md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={place.name}
                      onChange={(e) => handlePlaceChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Place name"
                      maxLength={100}
                    />
                    <input
                      type="text"
                      value={place.distance}
                      onChange={(e) => handlePlaceChange(index, 'distance', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Distance"
                      maxLength={50}
                    />
                    <select
                      value={place.type}
                      onChange={(e) => handlePlaceChange(index, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      {placeTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleRemovePlace(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Add */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {['Metro Station', 'Hospital', 'School', 'Shopping Mall', 'IT Park'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  const type = suggestion.toLowerCase().includes('metro') ? 'transport'
                    : suggestion.toLowerCase().includes('hospital') ? 'hospital'
                    : suggestion.toLowerCase().includes('school') ? 'school'
                    : suggestion.toLowerCase().includes('mall') ? 'shopping'
                    : 'work';
                  if (!nearbyPlaces.some(p => p.name.toLowerCase() === suggestion.toLowerCase())) {
                    setNewPlace({ name: suggestion, distance: '', type });
                  }
                }}
                disabled={nearbyPlaces.some(p => p.name.toLowerCase() === suggestion.toLowerCase())}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-blue-50 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;