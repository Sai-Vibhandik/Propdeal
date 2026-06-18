import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Check, Building2, Layers,
  Image, Sparkles, Eye, Save, Send, Palette, Loader2, DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import { propertiesAPI } from '../../services/api.js';
import { useAdminProperty } from '../../hooks/useProperty.js';

// Step Components
import BasicInfoStep from './builder/BasicInfoStep.jsx';
import PricingPlansStep from './builder/PricingPlansStep.jsx';
import SectionConfigStep from './builder/SectionConfigStep.jsx';
import MediaUploadStep from './builder/MediaUploadStep.jsx';
import AIContentStep from './builder/AIContentStep.jsx';
import ThemeStep from './builder/ThemeStep.jsx';
import ReviewStep from './builder/ReviewStep.jsx';

// LocalStorage key for draft (will include property ID if editing)
const getDraftKey = (id) => id ? `property_draft_${id}` : 'property_draft_new';
const DRAFT_TIMESTAMP_KEY = 'property_draft_timestamp';

const STEPS = [
  { id: 1, name: 'Basic Info', icon: Building2, description: 'Property details & location' },
  { id: 2, name: 'Pricing', icon: DollarSign, description: 'Plans & configurations' },
  { id: 3, name: 'Sections', icon: Layers, description: 'Configure layout' },
  { id: 4, name: 'Media', icon: Image, description: 'Upload images' },
  { id: 5, name: 'AI Content', icon: Sparkles, description: 'Generate content' },
  { id: 6, name: 'Theme', icon: Palette, description: 'Branding & style' },
  { id: 7, name: 'Review', icon: Eye, description: 'Preview & publish' },
];

// Helper functions for localStorage draft management
const saveDraftToStorage = (data, id, currentStep) => {
  try {
    const key = getDraftKey(id);
    const draftData = {
      ...data,
      _currentStep: currentStep,
    };
    localStorage.setItem(key, JSON.stringify(draftData));
    localStorage.setItem(`${key}_timestamp`, new Date().toISOString());
    console.log('[Draft] Saved to localStorage:', key, 'step:', currentStep);
  } catch (error) {
    console.error('[Draft] Error saving to localStorage:', error);
  }
};

const loadDraftFromStorage = (id) => {
  try {
    const key = getDraftKey(id);
    const draft = localStorage.getItem(key);
    console.log('[Draft] Loading from localStorage:', key, 'found:', !!draft);
    if (draft) {
      const data = JSON.parse(draft);
      const step = data._currentStep || 1;
      delete data._currentStep;
      console.log('[Draft] Loaded step:', step, 'data keys:', Object.keys(data).length);
      return { data, step };
    }
  } catch (error) {
    console.error('[Draft] Error loading from localStorage:', error);
  }
  return null;
};

const clearDraftFromStorage = (id) => {
  try {
    const key = getDraftKey(id);
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_timestamp`);
    console.log('[Draft] Cleared from localStorage:', key);
  } catch (error) {
    console.error('[Draft] Error clearing from localStorage:', error);
  }
};

// Default property data structure
const getDefaultPropertyData = () => ({
  // Basic Info
  name: '',
  slug: '',
  builder: '',
  propertyType: 'apartment',
  propertyCategory: 'residential',
  category: 'ready-to-move',
  status: 'draft',

  // Location
  address: {
    fullAddress: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  },
  coordinates: { lat: '', lng: '' },
  googleMapUrl: '',

  // Property Details
  configurations: [],
  possessionDate: '',
  totalArea: '',
  totalUnits: '',
  totalFloors: '',
  plotFacing: '',
  builtUpArea: '',
  customFields: [],
  reraNumber: '',

  // Unit Area Range
  unitAreaRange: {
    min: null,
    max: null,
    unit: 'sq.ft.',
  },

  // Nearby Places (manually entered)
  nearbyPlaces: [],

  // Pricing (auto-calculated from pricingPlans)
  priceRange: { min: '', max: '', minUnit: 'lac', maxUnit: 'cr' },

  // Pricing Plans (property type aware)
  pricingPlans: [],

  // Price Includes
  priceIncludes: [],

  // Plans (Master Plan, Floor Plans, Dimension Plans)
  plans: {
    masterPlan: { url: '', publicId: '', title: 'Master Plan' },
    floorPlans: [],
    dimensionPlans: [],
  },

  // Section Configuration
  sections: {
    hero: { enabled: true, order: 1, layout: 'full-screen' },
    overview: { enabled: true, order: 2, layout: 'standard' },
    highlights: { enabled: true, order: 3, layout: 'cards' },
    amenities: { enabled: true, order: 4, layout: 'grid' },
    pricing: { enabled: true, order: 5, layout: 'cards' },
    plans: { enabled: true, order: 6, layout: 'grid' },
    location: { enabled: true, order: 7, layout: 'map-list' },
    gallery: { enabled: true, order: 8, layout: 'grid' },
    videoTour: { enabled: false, order: 9, layout: 'full-width' },
    builderInfo: { enabled: true, order: 10, layout: 'standard' },
    investment: { enabled: true, order: 11, layout: 'cards' },
    faq: { enabled: true, order: 12, layout: 'accordion' },
    contact: { enabled: true, order: 13, layout: 'standard' },
  },

  // Media
  heroImages: [],
  gallery: [],
  floorPlans: [],
  videoTour: '',
  amenities: [], // Manual amenities with images
  sectionBackgrounds: {
    overview: { image: '', layout: 'background' },
    highlights: { image: '', layout: 'background' },
    location: { image: '', layout: 'background' },
    investment: { image: '', layout: 'background' },
    builder: { image: '', layout: 'background' },
  },

  // Theme
  theme: {
    primaryColor: '#1e40af',
    secondaryColor: '#d4af37',
    accentColor: '#059669',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    cardBackground: '#ffffff',
    preset: 'classic-blue',
    sectionStyle: 'minimal',
    fontStyle: 'modern',
    darkMode: false,
  },

  // Branding
  branding: {
    logo: '',
    favicon: '',
    logoPosition: 'left',
    companyName: '',
    tagline: '',
    showBuilderLogo: true,
    showReraBadge: true,
    reraQrCode: '',
    reraWebsite: '',
    advertiserName: '',
    advertiserRegNo: '',
    customCtaText: '',
    phoneNumber: '',
    email: '',
  },

  // AI Generated Content
  generatedContent: {
    hero: {},
    overview: {},
    highlights: [],
    amenities: {},
    location: {},
    investment: {},
    faq: [],
    seo: {},
  },
});

const PropertyBuilderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  // Use ref to prevent duplicate toasts in React Strict Mode
  const toastShownRef = useRef(false);

  // Check if this is a fresh start (new property without editing)
  const isFreshStart = searchParams.get('fresh') === 'true';

  // Fetch existing property if editing
  const { property: existingProperty, loading: loadingProperty } = useAdminProperty(id);

  // Use useMemo for stable values that don't change
  const isNewProp = !id;

  // Remove ?fresh=true from URL after first render (it only needs to clear draft once)
  useEffect(() => {
    if (isFreshStart) {
      // Clear the draft on fresh start
      clearDraftFromStorage(null);
      console.log('[FreshStart] Cleared draft and removing fresh=true from URL');
      // Remove ?fresh=true from URL without reloading
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [isFreshStart]);

  // Initialize propertyData with lazy initialization to ensure it only runs once
  const [propertyData, setPropertyData] = useState(() => {
    const defaultData = getDefaultPropertyData();
    console.log('[PropertyBuilder] Lazy init, id:', id, 'isFreshStart:', isFreshStart);

    // For new properties (no id), try to load draft from localStorage
    if (isNewProp && !isFreshStart) {
      const draft = loadDraftFromStorage(null);
      if (draft && draft.data) {
        console.log('[PropertyBuilder] Found draft, restoring...');
        // We'll restore the step in a separate effect
        return {
          ...defaultData,
          ...draft.data,
          propertyCategory: draft.data.propertyCategory?.toLowerCase() || 'residential',
          _restoredStep: draft.step || 1,
        };
      }
    }

    console.log('[PropertyBuilder] No draft found, using default data');
    return defaultData;
  });

  // Debug: Log state changes
  useEffect(() => {
    console.log('[Debug] initialLoadComplete changed to:', initialLoadComplete);
  }, [initialLoadComplete]);

  useEffect(() => {
    console.log('[Debug] loadingProperty changed to:', loadingProperty, 'id:', id);
  }, [loadingProperty, id]);

  // Restore step from draft after initial render
  useEffect(() => {
    if (propertyData._restoredStep && !draftRestored) {
      console.log('[StepRestore] Restoring step:', propertyData._restoredStep);
      setCurrentStep(propertyData._restoredStep);
      setDraftRestored(true);

      // Show toast (only once using ref)
      const timestamp = localStorage.getItem(`${getDraftKey(null)}_timestamp`);
      if (timestamp && !toastShownRef.current) {
        toastShownRef.current = true;
        setLastSaved(new Date(timestamp));
        toast.success('Draft restored from previous session');
      }
    }
  }, [propertyData._restoredStep, draftRestored]);

  // Load existing property data when editing
  useEffect(() => {
    console.log('[LoadEffect] Running, loadingProperty:', loadingProperty, 'id:', id);
    // Don't proceed until loading is complete
    if (loadingProperty) {
      console.log('[LoadEffect] Waiting for property to load...');
      return;
    }

    if (id && existingProperty) {
      console.log('[LoadEffect] Editing existing property, checking for local draft...');
      // Editing existing property - check for local draft first
      const draft = loadDraftFromStorage(id);
      if (draft && draft.data) {
        console.log('[LoadEffect] Using local draft');
        // Use local draft if available
        const normalizedDraft = {
          ...getDefaultPropertyData(),
          ...draft.data,
          propertyCategory: draft.data.propertyCategory?.toLowerCase() || 'residential',
        };
        setPropertyData(normalizedDraft);
        setCurrentStep(draft.step || 1);
        const timestamp = localStorage.getItem(`${getDraftKey(id)}_timestamp`);
        if (timestamp && !toastShownRef.current) {
          toastShownRef.current = true;
          setLastSaved(new Date(timestamp));
          toast.success('Draft restored from previous session');
        }
      } else {
        console.log('[LoadEffect] No local draft, using API data');
        // No local draft, use data from API
        const normalizedProperty = {
          ...getDefaultPropertyData(),
          ...existingProperty,
          propertyCategory: existingProperty.propertyCategory?.toLowerCase() || 'residential',
        };
        setPropertyData(normalizedProperty);
      }
    } else if (!id) {
      console.log('[LoadEffect] New property, draft was already loaded in lazy init');
    }

    console.log('[LoadEffect] Setting initialLoadComplete to true');
    setInitialLoadComplete(true);
  }, [existingProperty, id, loadingProperty]);

  // Auto-save to localStorage when propertyData changes (only after initial load is complete)
  useEffect(() => {
    // Don't auto-save until initial load is complete
    if (!initialLoadComplete) {
      console.log('[AutoSave] Waiting for initial load to complete...');
      return;
    }

    // Debounce auto-save
    const timer = setTimeout(() => {
      // Only save if there's meaningful data
      if (propertyData.name || propertyData.address?.city) {
        console.log('[AutoSave] Triggering save, name:', propertyData.name, 'city:', propertyData.address?.city);
        // Don't save the internal _restoredStep field
        const { _restoredStep, ...dataToSave } = propertyData;
        saveDraftToStorage(dataToSave, id, currentStep);
        setLastSaved(new Date());
      } else {
        console.log('[AutoSave] Skipping save - no meaningful data');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [propertyData, id, currentStep, initialLoadComplete]);

  const updatePropertyData = (field, value) => {
    setPropertyData((prev) => {
      let newData;
      if (typeof field === 'string') {
        newData = { ...prev, [field]: value };
      } else {
        // For nested updates
        newData = { ...prev };
        let current = newData;
        const keys = field;
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      }

      return newData;
    });
  };

  const nextStep = () => {
    // Validate current step before proceeding
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      toast.error('Please fill in all required fields');
      // Trigger validation in the current step component if available
      if (currentStep === 1 && window.basicInfoStepValidation) {
        window.basicInfoStepValidation();
      }
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate specific step
  const validateStep = (step) => {
    const errors = {};

    switch (step) {
      case 1: // Basic Info
        if (!propertyData.name?.trim()) errors.name = 'Property name is required';
        if (!propertyData.builder?.trim()) errors.builder = 'Builder name is required';
        if (!propertyData.address?.fullAddress?.trim()) errors['address.fullAddress'] = 'Full address is required';
        if (!propertyData.address?.locality?.trim()) errors['address.locality'] = 'Locality is required';
        if (!propertyData.address?.city?.trim()) errors['address.city'] = 'City is required';
        // Price range is now auto-calculated from pricingPlans
        break;
      case 2: // Pricing Plans
        // Validate pricing plans
        const validPlans = propertyData.pricingPlans?.filter(p => p.configuration && p.price);
        if (!validPlans || validPlans.length === 0) {
          // Don't block - allow empty pricing for now
        }
        break;
      case 3: // Sections - no required fields
        break;
      case 4: // Media - hero images required for publishing
        if (!propertyData.heroImages?.length) {
          // Don't block, just warn
        }
        break;
      case 5: // AI Content - no required fields
        break;
      case 6: // Theme - no required fields
        break;
      case 7: // Review - no validation needed
        break;
    }

    return errors;
  };

  const handleSaveDraft = async () => {
    // Minimum validation - property name is required
    if (!propertyData.name?.trim()) {
      toast.error('Please enter a property name before saving');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data - generate slug from name if not provided
      const dataToSave = {
        ...propertyData,
        status: 'draft',
      };

      // Generate slug from name if not set
      if (!dataToSave.slug && dataToSave.name) {
        dataToSave.slug = dataToSave.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      let response;
      if (id) {
        response = await propertiesAPI.update(id, dataToSave);
        toast.success('Property updated successfully!');
      } else {
        response = await propertiesAPI.create(dataToSave);
        toast.success('Property saved as draft!');
      }

      // Clear localStorage draft after successful save
      clearDraftFromStorage(id);

      // Navigate to properties list or to edit the new property
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(error.response?.data?.message || 'Failed to save property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    // Validate required fields
    const errors = [];

    if (!propertyData.name?.trim()) {
      errors.push('Property name is required');
    }
    if (!propertyData.builder?.trim()) {
      errors.push('Builder/Developer name is required');
    }
    if (!propertyData.address?.fullAddress?.trim()) {
      errors.push('Full address is required');
    }
    if (!propertyData.address?.locality?.trim()) {
      errors.push('Locality is required');
    }
    if (!propertyData.address?.city?.trim()) {
      errors.push('City is required');
    }
    if (!propertyData.priceRange?.min) {
      errors.push('Starting price is required');
    }
    if (!propertyData.priceRange?.max) {
      errors.push('Maximum price is required');
    }

    if (errors.length > 0) {
      toast.error(errors[0]); // Show first error
      // Trigger validation in BasicInfoStep if on step 1
      if (currentStep === 1 && window.basicInfoStepValidation) {
        window.basicInfoStepValidation();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare data - generate slug from name if not provided
      const dataToSave = {
        ...propertyData,
        status: 'published',
        publishedAt: new Date().toISOString(),
      };

      // Generate slug from name if not set
      if (!dataToSave.slug && dataToSave.name) {
        dataToSave.slug = dataToSave.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }

      if (id) {
        await propertiesAPI.update(id, dataToSave);
        toast.success('Property published successfully!');
      } else {
        await propertiesAPI.create(dataToSave);
        toast.success('Property published!');
      }

      // Clear localStorage draft after successful publish
      clearDraftFromStorage(id);

      navigate('/admin/properties');
    } catch (error) {
      console.error('Error publishing property:', error);
      toast.error(error.response?.data?.message || 'Failed to publish property');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    const stepProps = {
      propertyData,
      updatePropertyData,
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <PricingPlansStep {...stepProps} />;
      case 3:
        return <SectionConfigStep {...stepProps} />;
      case 4:
        return <MediaUploadStep {...stepProps} />;
      case 5:
        return <AIContentStep {...stepProps} />;
      case 6:
        return <ThemeStep {...stepProps} />;
      case 7:
        return <ReviewStep {...stepProps} onSaveDraft={handleSaveDraft} onPublish={handlePublish} />;
      default:
        return <BasicInfoStep {...stepProps} />;
    }
  };

  if (loadingProperty && id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  // Save draft before leaving
                  if (propertyData.name || propertyData.address?.city) {
                    // Remove internal _restoredStep field before saving
                    const { _restoredStep, ...dataToSave } = propertyData;
                    console.log('[BackButton] Saving draft, name:', propertyData.name, 'step:', currentStep);
                    saveDraftToStorage(dataToSave, id, currentStep);
                    toast.success('Draft saved');
                  }
                  navigate('/admin/properties');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {id ? 'Edit Property' : 'New Property'}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500">
                    {propertyData.name || 'Untitled'} • {propertyData.status || 'draft'}
                  </p>
                  {!id && lastSaved && (
                    <span className="text-xs text-gray-400">
                      (Auto-saved {lastSaved.toLocaleTimeString()})
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <span>✓ Auto-saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Draft
                  </>
                )}
              </button>
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center gap-2 ${
                      isActive ? 'text-blue-800' : isCompleted ? 'text-emerald-600' : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? 'bg-blue-800 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-sm">{step.name}</p>
                      <p className="text-xs opacity-75">{step.description}</p>
                    </div>
                  </button>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`hidden md:block w-12 h-0.5 mx-2 ${
                        currentStep > step.id ? 'bg-emerald-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === STEPS.length}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              currentStep === STEPS.length
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-800 text-white hover:bg-blue-900'
            }`}
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyBuilderPage;