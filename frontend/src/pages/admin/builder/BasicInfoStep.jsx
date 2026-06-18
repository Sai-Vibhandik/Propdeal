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

  // Validation function
  const validateField = (field, value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  };

  // Expose validation function for parent component
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.basicInfoStepValidation = () => {
        const newErrors = {};

        // Property Details
        if (!propertyData.name?.trim()) newErrors.name = 'Property name is required';
        if (!propertyData.builder?.trim()) newErrors.builder = 'Builder/Developer name is required';

        // Location
        if (!propertyData.address?.fullAddress?.trim()) newErrors['address.fullAddress'] = 'Full address is required';
        if (!propertyData.address?.locality?.trim()) newErrors['address.locality'] = 'Locality is required';
        if (!propertyData.address?.city?.trim()) newErrors['address.city'] = 'City is required';
        // Note: Pricing is now handled in Pricing Plans step

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
              Property Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={propertyData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Prestige Lakeside Habitat"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            <p className="text-xs text-gray-500 mt-1">The name of your property project as it will appear on the landing page</p>
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
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Auto-generated from name. You can customize it if needed.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Builder/Developer Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={propertyData.builder}
              onChange={(e) => handleChange('builder', e.target.value)}
              placeholder="e.g., Prestige Group"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.builder ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.builder && <p className="text-red-500 text-sm mt-1">{errors.builder}</p>}
            <p className="text-xs text-gray-500 mt-1">Company or developer building this project</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type <span className="text-red-500">*</span>
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
              Category <span className="text-red-500">*</span>
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
              Full Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={propertyData.address?.fullAddress}
              onChange={(e) => handleAddressChange('fullAddress', e.target.value)}
              placeholder="e.g., Whitefield Main Road, Bangalore - 560066"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.fullAddress'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.fullAddress'] && <p className="text-red-500 text-sm mt-1">{errors['address.fullAddress']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={propertyData.address?.locality}
              onChange={(e) => handleAddressChange('locality', e.target.value)}
              placeholder="e.g., Whitefield"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.locality'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.locality'] && <p className="text-red-500 text-sm mt-1">{errors['address.locality']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={propertyData.address?.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="e.g., Bangalore"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['address.city'] ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              value={propertyData.address?.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="e.g., Karnataka"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
            <input
              type="text"
              value={propertyData.address?.pincode}
              onChange={(e) => handleAddressChange('pincode', e.target.value)}
              placeholder="e.g., 560066"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
            <input
              type="text"
              value={propertyData.address?.landmark}
              onChange={(e) => handleAddressChange('landmark', e.target.value)}
              placeholder="e.g., Near ITPL"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Google Maps Embed URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Maps Embed URL
              <span className="text-gray-400 font-normal ml-1">(optional)</span>
            </label>
            <input
              type="text"
              value={propertyData.googleMapUrl || ''}
              onChange={(e) => updatePropertyData('googleMapUrl', e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-900 mb-1">How to get the embed URL:</p>
              <ol className="text-blue-700 space-y-1 list-decimal list-inside">
                <li>Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a></li>
                <li>Search for your property location</li>
                <li>Click <strong>Share</strong> (button with arrow icon)</li>
                <li>Select <strong>Embed a map</strong> tab</li>
                <li>Click <strong>Copy HTML</strong></li>
                <li>Paste here and extract only the <code className="bg-blue-100 px-1 rounded">src="..."</code> URL</li>
              </ol>
              <p className="text-xs text-blue-600 mt-2">
                Example: https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.51234...
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Real Estate Regulatory Authority registration number</p>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">The official RERA website URL to display below the RERA number</p>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Government RERA Authorised Advertiser's name</p>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Advertiser's RERA registration number</p>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Total land area of the project</p>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Total units in the project</p>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Format: Basement + Ground + Upper floors</p>
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Total constructed area</p>
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
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newCustomField.value}
                onChange={(e) => setNewCustomField({ ...newCustomField, value: e.target.value })}
                placeholder="Value (e.g., East Facing)"
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
                    />
                    <input
                      type="text"
                      value={place.distance}
                      onChange={(e) => handlePlaceChange(index, 'distance', e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="Distance"
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