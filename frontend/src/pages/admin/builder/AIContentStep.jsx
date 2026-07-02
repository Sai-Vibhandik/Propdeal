import { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw, Check, Edit2, Wifi, WifiOff, Info, X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aiAPI } from '../../../services/api.js';

// Helper function to check if a value is a JS code string (corrupted data)
const isJsCodeString = (value) => {
  if (typeof value !== 'string') return false;
  const str = value.trim();
  return (str.startsWith('[') && str.endsWith(']')) ||
         (str.startsWith('{') && str.endsWith('}'));
};

// Helper function to check if a value is a valid array (not a string)
const isValidArray = (value) => {
  return Array.isArray(value) && !isJsCodeString(value);
};

// Sanitize content to ensure arrays are properly formatted
const sanitizeContent = (section, content) => {
  if (!content || typeof content !== 'object') return content;

  // For sections that return arrays directly (highlights, faq)
  // The content IS the array, not an object containing it
  if (section === 'highlights' || section === 'faq') {
    // If it's already a valid array, return it as-is
    if (Array.isArray(content)) {
      return content;
    }
    // If it's a string that looks like JS code, return empty array
    if (typeof content === 'string' && isJsCodeString(content)) {
      return [];
    }
    // Otherwise return empty array
    return [];
  }

  // For sections that return objects
  const sanitized = { ...content };

  if (section === 'location') {
    if (sanitized.nearbyPlaces && !isValidArray(sanitized.nearbyPlaces)) {
      sanitized.nearbyPlaces = [];
    }
  }

  if (section === 'overview') {
    if (sanitized.keyPoints && !isValidArray(sanitized.keyPoints)) {
      sanitized.keyPoints = [];
    }
  }

  if (section === 'investment') {
    if (sanitized.benefits && !isValidArray(sanitized.benefits)) {
      sanitized.benefits = [];
    }
  }

  if (section === 'builder') {
    if (sanitized.keyFacts && !isValidArray(sanitized.keyFacts)) {
      sanitized.keyFacts = [];
    }
    if (sanitized.stats && !isValidArray(sanitized.stats)) {
      sanitized.stats = [];
    }
  }

  if (section === 'seo') {
    if (sanitized.keywords && !isValidArray(sanitized.keywords)) {
      sanitized.keywords = [];
    }
  }

  return sanitized;
};

const AIContentStep = ({ propertyData, updatePropertyData }) => {
  const [generating, setGenerating] = useState(new Set()); // Set of sections being generated
  const [editingSection, setEditingSection] = useState(null);
  const [aiStatus, setAiStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [fallbackUsed, setFallbackUsed] = useState(false);

  // Check AI status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await aiAPI.getStatus();
        setAiStatus(response.data.data);
      } catch (error) {
        console.error('Failed to check AI status:', error);
        setAiStatus({ available: false, error: 'Failed to connect to AI service' });
      } finally {
        setCheckingStatus(false);
      }
    };
    checkStatus();
  }, []);

  // Generate content using AI
  const generateContent = async (section, isParallel = false) => {
    // Add section to generating set
    setGenerating(prev => new Set(prev).add(section));
    if (!isParallel) {
      toast.loading(`Generating ${section}...`, { id: `generate-${section}` });
    }
    setFallbackUsed(false);

    try {
      // Call the AI API - pass propertyData directly (works for both saved and unsaved properties)
      console.log(`Generating content for section: ${section}`);
      const response = await aiAPI.generate(section, propertyData._id, propertyData);

      if (response.data.success) {
        // The API returns the content directly
        let content = response.data.data.content;
        console.log(`Raw AI response for ${section}:`, content);

        // Sanitize content to ensure arrays are properly formatted
        content = sanitizeContent(section, content);
        console.log(`Sanitized content for ${section}:`, content);

        // Update the generatedContent for this section
        // For highlights and faq, content is already the array
        // For other sections, content is an object
        if (section === 'highlights' || section === 'faq') {
          // content is the array directly
          updatePropertyData(['generatedContent', section], content);
        } else if (content[section]) {
          // content has the section nested
          updatePropertyData(['generatedContent', section], content[section]);
        } else {
          // content is the object to store directly
          updatePropertyData(['generatedContent', section], content);
        }

        // Show notification if fallback content was used
        if (response.data.data.fallback) {
          setFallbackUsed(true);
        }

        // Show success toast for individual section generation
        if (!isParallel) {
          toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} generated successfully!`, { id: `generate-${section}` });
        }

        return { success: true };
      }
    } catch (error) {
      console.error('Error generating content:', error);

      // Fallback to mock content if API fails completely
      const mockContent = getMockContent(section);
      console.log(`Using mock content for ${section}:`, mockContent);
      updatePropertyData(['generatedContent', section], mockContent);
      setFallbackUsed(true);

      // Show error toast for individual section generation
      if (!isParallel) {
        toast.error(`Failed to generate ${section}. Using template content.`, { id: `generate-${section}` });
      }

      return { success: false };
    } finally {
      // Remove section from generating set
      setGenerating(prev => {
        const newSet = new Set(prev);
        newSet.delete(section);
        return newSet;
      });
    }
  };

  const getMockContent = (section) => {
    const mockContent = {
      hero: {
        headline: `Luxury Living at ${propertyData.name || 'Property'}`,
        subheadline: `Experience premium ${propertyData.configurations?.[0] || 'apartments'} in ${propertyData.address?.locality || 'prime location'} with world-class amenities`,
        ctaText: 'Schedule a Visit',
        badge: propertyData.category === 'ready-to-move' ? 'Ready to Move' : 'New Launch',
        offers: [
          { icon: 'percent', text: 'No Pre-EMI till Possession', highlight: true },
          { icon: 'tag', text: 'Free Car Parking Worth ₹5L', highlight: false },
          { icon: 'clock', text: 'Early Bird Discount: 2% Off', highlight: false },
        ],
        offerValidity: 'Limited Time Only',
      },
      overview: {
        description: `${propertyData.name} is a premium residential project by ${propertyData.builder || 'a renowned developer'} located in ${propertyData.address?.locality}, ${propertyData.address?.city}. Spread across ${propertyData.area || 'acres of land'}, this project offers thoughtfully designed ${propertyData.configurations?.join(', ') || 'apartments'} with modern amenities and excellent connectivity.`,
        summary: 'A premium residential project with excellent connectivity and world-class amenities.',
        keyPoints: [
          `${propertyData.area || 'Spacious'} project area`,
          `${propertyData.units || 'Multiple'} units available`,
          'Modern amenities and facilities',
          'Excellent connectivity to major hubs',
          propertyData.reraNumber ? 'RERA registered project' : 'Premium specifications',
        ],
      },
      highlights: [
        { icon: 'home', title: propertyData.category === 'ready-to-move' ? 'Ready to Move' : 'New Launch', description: 'Immediate possession available with all amenities operational' },
        { icon: 'pool', title: 'World-Class Amenities', description: 'Clubhouse, swimming pool, gym, sports courts, and more' },
        { icon: 'tree', title: 'Prime Location', description: `Located in ${propertyData.address?.locality || 'prime area'} with excellent connectivity` },
        { icon: 'shield', title: propertyData.reraNumber ? 'RERA Verified' : 'Quality Construction', description: 'Complete transparency and verified documentation' },
      ],
      location: {
        connectivity: `Excellent connectivity to major IT hubs and business centers. ${propertyData.address?.locality || 'The area'} is well-connected via roads and public transport.`,
        nearbyPlaces: [
          { name: 'IT Hub', distance: '5 mins', type: 'work', icon: 'briefcase' },
          { name: 'Shopping Mall', distance: '10 mins', type: 'shopping', icon: 'shopping-bag' },
          { name: 'Hospital', distance: '8 mins', type: 'hospital', icon: 'heart' },
          { name: 'School', distance: '5 mins', type: 'school', icon: 'book' },
        ],
      },
      investment: {
        benefits: [
          'High rental yield due to prime location',
          'Strong appreciation potential',
          'Excellent social infrastructure',
          'Growing demand in the area',
        ],
        rentalPotential: 'Expected rental yield of 3-4% per annum',
        futureGrowth: 'Property values expected to appreciate significantly in the coming years.',
      },
      builder: {
        aboutBuilder: `A renowned developer known for quality construction and timely delivery with decades of experience.`,
        stats: [
          { icon: 'award', value: '30+', label: 'Years of Experience' },
          { icon: 'building', value: '250+', label: 'Projects Delivered' },
          { icon: 'mapPin', value: '15+', label: 'Cities Presence' },
          { icon: 'users', value: '50,000+', label: 'Happy Customers' },
        ],
        keyFacts: [
          { icon: 'shield', text: 'RERA registered and compliant projects' },
          { icon: 'clock', text: 'On-time delivery with quality construction' },
          { icon: 'check', text: 'Transparent pricing with no hidden charges' },
          { icon: 'award', text: 'Excellent after-sales service' },
          { icon: 'mapPin', text: 'Prime location selection for all projects' },
          { icon: 'home', text: 'Modern amenities and premium specifications' },
        ],
      },
      faq: [
        {
          question: `What is the possession status of ${propertyData.name}?`,
          answer: propertyData.category === 'ready-to-move'
            ? 'The project is ready to move with immediate possession available.'
            : 'The project is currently under construction with possession expected as per schedule.',
        },
        {
          question: `What configurations are available in ${propertyData.name}?`,
          answer: `The project offers ${propertyData.configurations?.join(', ') || 'various configurations'} to suit different needs and budgets.`,
        },
        {
          question: 'Is the project RERA registered?',
          answer: propertyData.reraNumber
            ? `Yes, the project is RERA registered with registration number ${propertyData.reraNumber}.`
            : 'Please contact our team for RERA details and documentation.',
        },
        {
          question: 'What amenities are available?',
          answer: 'The project offers a wide range of amenities including clubhouse, swimming pool, gym, sports courts, children\'s play area, and more.',
        },
      ],
      seo: {
        metaTitle: `${propertyData.name} | ${propertyData.configurations?.[0] || 'Apartments'} in ${propertyData.address?.locality || 'Bangalore'}`,
        metaDescription: `Buy ${propertyData.configurations?.join(', ') || 'apartments'} in ${propertyData.name}, ${propertyData.address?.locality}. ${propertyData.category === 'ready-to-move' ? 'Ready to move' : 'Under construction'} with world-class amenities. Starting ₹${propertyData.priceRange?.min || 'Affordable'} ${propertyData.priceRange?.minUnit === 'cr' ? 'Cr' : 'Lac'}.`,
        keywords: [propertyData.name, propertyData.address?.locality, 'apartments', 'flats', propertyData.address?.city, 'buy property'],
      },
    };

    return mockContent[section];
  };

  const generateAllContent = async () => {
    const sections = ['hero', 'overview', 'highlights', 'location', 'investment', 'builder', 'faq', 'seo'];

    // Add 'all' to generating set
    setGenerating(prev => new Set(prev).add('all'));

    // Show toast for starting
    toast.loading('Generating all content in parallel...', { id: 'generate-all' });

    try {
      const results = await Promise.allSettled(
        sections.map(section => generateContent(section, true)) // Pass true to skip individual toasts
      );

      // Count successes and failures
      const successes = results.filter(r => r.status === 'fulfilled').length;
      const failures = results.filter(r => r.status === 'rejected');
      const failedSections = failures.map((f, i) => sections[i]).filter((_, i) => results[i].status === 'rejected');

      // Dismiss loading toast
      toast.dismiss('generate-all');

      if (failures.length === 0) {
        // All sections generated successfully
        toast.success(`All ${sections.length} sections generated successfully!`);
      } else if (failures.length === sections.length) {
        // All sections failed
        toast.error('Failed to generate all content. Please try again.');
      } else {
        // Some sections failed
        toast.error(`Generated ${successes}/${sections.length} sections. Failed: ${failedSections.join(', ')}`);
      }
    } catch (error) {
      toast.dismiss('generate-all');
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      // Remove 'all' from generating set
      setGenerating(prev => {
        const newSet = new Set(prev);
        newSet.delete('all');
        return newSet;
      });
    }
  };

  const sections = [
    { key: 'hero', name: 'Hero', description: 'Headline, subheadline, CTA, and offers' },
    { key: 'overview', name: 'Overview', description: 'Description and key points' },
    { key: 'highlights', name: 'Highlights', description: 'Key selling points' },
    { key: 'location', name: 'Location', description: 'Nearby places' },
    { key: 'investment', name: 'Investment', description: 'Investment benefits' },
    { key: 'builder', name: 'Builder', description: 'About developer and key facts' },
    { key: 'faq', name: 'FAQ', description: 'Frequently asked questions' },
    { key: 'seo', name: 'SEO', description: 'Meta tags and keywords' },
  ];

  const hasContent = (section) => {
    const content = propertyData.generatedContent?.[section];
    if (!content) return false;

    // Special handling for different section types
    if (section === 'highlights' || section === 'faq') {
      return Array.isArray(content) && content.length > 0;
    }

    // For hero, check if it has headline or offers
    if (section === 'hero') {
      return content.headline || (content.offers && content.offers.length > 0);
    }

    return Object.keys(content).length > 0;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">AI Content Generation</h2>
        <p className="text-gray-600 mt-1">Generate property content using AI</p>
      </div>

      {/* AI Status */}
      {!checkingStatus && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          aiStatus?.available
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          {aiStatus?.available ? (
            <>
              <Wifi className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-emerald-800 font-medium">
                  AI Connected
                </p>
                <p className="text-emerald-600 text-sm">
                  Ready to generate content
                </p>
              </div>
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-amber-800 font-medium">AI Not Connected</p>
                <p className="text-amber-600 text-sm">
                  Content will use templates
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Fallback notification */}
      {fallbackUsed && (
        <div className="rounded-xl p-4 flex items-center gap-3 bg-blue-50 border border-blue-200">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium">Template Content Used</p>
            <p className="text-blue-600 text-sm">
              AI service unavailable. Template content has been generated based on property details. You can edit or regenerate later.
            </p>
          </div>
        </div>
      )}

      {/* Generate All Button */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Generate All Content</h3>
            <p className="text-blue-200 text-xs sm:text-sm">
              AI will generate content for all sections in parallel based on property details
            </p>
          </div>
          <button
            onClick={generateAllContent}
            disabled={generating.size > 0 || checkingStatus}
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-800 font-semibold rounded-xl hover:bg-blue-50 transition-colors disabled:opacity-50 flex-shrink-0 text-sm sm:text-base"
          >
            {generating.has('all') ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="hidden sm:inline">Generating All...</span>
                <span className="sm:hidden">Generating...</span>
              </>
            ) : generating.size > 0 ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Generate All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Content Cards */}
      <div className="grid gap-4">
        {sections.map((section) => (
          <div
            key={section.key}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{section.name}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {hasContent(section.key) && (
                    <span className="flex items-center justify-center gap-1 text-emerald-600 text-sm">
                      <Check className="w-4 h-4" />
                      Generated
                    </span>
                  )}
                  <button
                    onClick={() => generateContent(section.key)}
                    disabled={generating.has('all')}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50"
                  >
                    {generating.has(section.key) ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : generating.has('all') ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="opacity-50">Generating...</span>
                      </>
                    ) : hasContent(section.key) ? (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate
                      </>
                    )}
                  </button>
                  {hasContent(section.key) && (
                    <button
                      onClick={() => setEditingSection(section.key)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content Preview */}
            {hasContent(section.key) && (
              <div className="p-4 bg-white">
                {section.key === 'hero' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Headline:</strong> {propertyData.generatedContent?.hero?.headline}</p>
                    <p className="text-sm"><strong>Subheadline:</strong> {propertyData.generatedContent?.hero?.subheadline}</p>
                    <p className="text-sm"><strong>CTA:</strong> {propertyData.generatedContent?.hero?.ctaText}</p>
                  </div>
                )}

                {section.key === 'overview' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Description:</strong> {propertyData.generatedContent?.overview?.description?.substring(0, 100)}...</p>
                    <p className="text-sm"><strong>Key Points:</strong> {propertyData.generatedContent?.overview?.keyPoints?.length || 0} points</p>
                  </div>
                )}

                {section.key === 'highlights' && (
                  <div className="flex flex-wrap gap-2">
                    {propertyData.generatedContent?.highlights?.map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">
                        {h.title}
                      </span>
                    ))}
                  </div>
                )}

                {section.key === 'location' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Connectivity:</strong> {propertyData.generatedContent?.location?.connectivity?.substring(0, 100)}...</p>
                  </div>
                )}

                {section.key === 'investment' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Benefits:</strong> {propertyData.generatedContent?.investment?.benefits?.length || 0} benefits</p>
                    <p className="text-sm"><strong>Rental Potential:</strong> {propertyData.generatedContent?.investment?.rentalPotential}</p>
                  </div>
                )}

                {section.key === 'builder' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>About:</strong> {propertyData.generatedContent?.builder?.aboutBuilder?.substring(0, 80)}...</p>
                    <p className="text-sm"><strong>Stats:</strong> {propertyData.generatedContent?.builder?.stats?.length || 0} stats</p>
                    <p className="text-sm"><strong>Key Facts:</strong> {propertyData.generatedContent?.builder?.keyFacts?.length || 0} facts</p>
                  </div>
                )}

                {section.key === 'faq' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Questions:</strong> {propertyData.generatedContent?.faq?.length || 0} FAQs</p>
                  </div>
                )}

                {section.key === 'seo' && (
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Title:</strong> {propertyData.generatedContent?.seo?.metaTitle}</p>
                    <p className="text-sm"><strong>Keywords:</strong> {propertyData.generatedContent?.seo?.keywords?.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingSection && (
        <EditContentModal
          section={editingSection}
          content={propertyData.generatedContent[editingSection]}
          onClose={() => setEditingSection(null)}
          onSave={(updatedContent) => {
            updatePropertyData(['generatedContent', editingSection], updatedContent);
            setEditingSection(null);
            toast.success(`${editingSection.charAt(0).toUpperCase() + editingSection.slice(1)} updated successfully!`);
          }}
        />
      )}
    </div>
  );
};

// Character limits for fields
const FIELD_LIMITS = {
  headline: { min: 5, max: 100 },
  subheadline: { min: 10, max: 300 },
  ctaText: { min: 2, max: 30 },
  badge: { min: 2, max: 30 },
  offerText: { min: 2, max: 100 },
  offerValidity: { min: 2, max: 50 },
  keyPoint: { min: 5, max: 200 },
  description: { min: 20, max: 2000 },
  highlightTitle: { min: 3, max: 50 },
  highlightDescription: { min: 10, max: 200 },
  connectivity: { min: 10, max: 500 },
  benefit: { min: 5, max: 200 },
  rentalPotential: { min: 10, max: 500 },
  futureGrowth: { min: 10, max: 500 },
  faqQuestion: { min: 10, max: 200 },
  faqAnswer: { min: 20, max: 1000 },
  metaTitle: { min: 10, max: 60 },
  metaDescription: { min: 50, max: 160 },
};

// Form-based Edit Modal Component
const EditContentModal = ({ section, content, onClose, onSave }) => {
  const [formData, setFormData] = useState(() => {
    // Initialize form data based on section type
    if (section === 'highlights' || section === 'faq') {
      return Array.isArray(content) ? [...content] : [];
    }
    return content ? { ...content } : {};
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayItemChange = (index, field, value) => {
    setFormData(prev => {
      // For overview section, keyPoints is inside the object
      if (section === 'overview') {
        const newKeyPoints = [...(prev.keyPoints || [])];
        newKeyPoints[index] = value;
        return { ...prev, keyPoints: newKeyPoints };
      }
      // For investment section, benefits is inside the object
      if (section === 'investment') {
        const newBenefits = [...(prev.benefits || [])];
        newBenefits[index] = value;
        return { ...prev, benefits: newBenefits };
      }
      // For builder section, keyFacts is inside the object
      if (section === 'builder') {
        const newKeyFacts = [...(prev.keyFacts || [])];
        newKeyFacts[index] = value;
        return { ...prev, keyFacts: newKeyFacts };
      }
      // For location section, nearbyPlaces is inside the object
      if (section === 'location') {
        const newNearbyPlaces = [...(prev.nearbyPlaces || [])];
        if (typeof prev.nearbyPlaces[index] === 'object') {
          newNearbyPlaces[index] = { ...newNearbyPlaces[index], [field]: value };
        } else {
          newNearbyPlaces[index] = value;
        }
        return { ...prev, nearbyPlaces: newNearbyPlaces };
      }
      // For other sections, formData is an array
      const newArray = [...prev];
      if (typeof prev[index] === 'object') {
        newArray[index] = { ...newArray[index], [field]: value };
      } else {
        newArray[index] = value;
      }
      return newArray;
    });
    // Clear error for array items
    if (errors[`${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`${index}_${field}`]: '' }));
    }
  };

  const addArrayItem = (template, fieldName = null) => {
    setFormData(prev => {
      // For overview section, add to keyPoints array
      if (section === 'overview' && fieldName === 'keyPoints') {
        return { ...prev, keyPoints: [...(prev.keyPoints || []), template] };
      }
      // For investment section, add to benefits array
      if (section === 'investment' && fieldName === 'benefits') {
        return { ...prev, benefits: [...(prev.benefits || []), template] };
      }
      // For builder section, add to keyFacts array
      if (section === 'builder' && fieldName === 'keyFacts') {
        return { ...prev, keyFacts: [...(prev.keyFacts || []), template] };
      }
      // For location section, add to nearbyPlaces array
      if (section === 'location' && fieldName === 'nearbyPlaces') {
        return { ...prev, nearbyPlaces: [...(prev.nearbyPlaces || []), template] };
      }
      // For other sections, formData is an array
      return [...prev, template];
    });
  };

  const removeArrayItem = (index, fieldName = null) => {
    setFormData(prev => {
      // For overview section, remove from keyPoints array
      if (section === 'overview' && fieldName === 'keyPoints') {
        return { ...prev, keyPoints: (prev.keyPoints || []).filter((_, i) => i !== index) };
      }
      // For investment section, remove from benefits array
      if (section === 'investment' && fieldName === 'benefits') {
        return { ...prev, benefits: (prev.benefits || []).filter((_, i) => i !== index) };
      }
      // For builder section, remove from keyFacts array
      if (section === 'builder' && fieldName === 'keyFacts') {
        return { ...prev, keyFacts: (prev.keyFacts || []).filter((_, i) => i !== index) };
      }
      // For location section, remove from nearbyPlaces array
      if (section === 'location' && fieldName === 'nearbyPlaces') {
        return { ...prev, nearbyPlaces: (prev.nearbyPlaces || []).filter((_, i) => i !== index) };
      }
      // For other sections, formData is an array
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (section === 'hero') {
      if (!formData.headline?.trim()) {
        newErrors.headline = 'Headline is required';
      } else if (formData.headline.length < FIELD_LIMITS.headline.min) {
        newErrors.headline = `Minimum ${FIELD_LIMITS.headline.min} characters required`;
      }
    }

    if (section === 'overview') {
      if (!formData.description?.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < FIELD_LIMITS.description.min) {
        newErrors.description = `Minimum ${FIELD_LIMITS.description.min} characters required`;
      }
    }

    if (section === 'highlights') {
      formData.forEach((highlight, index) => {
        if (!highlight.title?.trim()) {
          newErrors[`${index}_title`] = 'Title is required';
        }
        if (!highlight.description?.trim()) {
          newErrors[`${index}_description`] = 'Description is required';
        }
      });
    }

    if (section === 'faq') {
      formData.forEach((faq, index) => {
        if (!faq.question?.trim()) {
          newErrors[`${index}_question`] = 'Question is required';
        }
        if (!faq.answer?.trim()) {
          newErrors[`${index}_answer`] = 'Answer is required';
        }
      });
    }

    if (section === 'builder') {
      if (!formData.aboutBuilder?.trim()) {
        newErrors.aboutBuilder = 'About builder is required';
      } else if (formData.aboutBuilder.length < 10) {
        newErrors.aboutBuilder = 'Minimum 10 characters required';
      }
    }

    if (section === 'seo') {
      if (!formData.metaTitle?.trim()) {
        newErrors.metaTitle = 'Meta title is required';
      } else if (formData.metaTitle.length < FIELD_LIMITS.metaTitle.min) {
        newErrors.metaTitle = `Minimum ${FIELD_LIMITS.metaTitle.min} characters required`;
      }
      if (!formData.metaDescription?.trim()) {
        newErrors.metaDescription = 'Meta description is required';
      } else if (formData.metaDescription.length < FIELD_LIMITS.metaDescription.min) {
        newErrors.metaDescription = `Minimum ${FIELD_LIMITS.metaDescription.min} characters required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    onSave(formData);
  };

  const renderHeroEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Headline<sup className="text-red-500">*</sup>
        </label>
        <input
          type="text"
          value={formData.headline || ''}
          onChange={(e) => handleChange('headline', e.target.value)}
          placeholder="e.g., Luxury Living at Prestige Towers"
          maxLength={FIELD_LIMITS.headline.max}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.headline ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.headline && <p className="text-sm text-red-500 mt-1">{errors.headline}</p>}
        <p className="text-xs text-gray-400 mt-1">{(formData.headline || '').length}/{FIELD_LIMITS.headline.max}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
        <textarea
          value={formData.subheadline || ''}
          onChange={(e) => handleChange('subheadline', e.target.value)}
          placeholder="e.g., Experience premium apartments in prime location"
          rows={3}
          maxLength={FIELD_LIMITS.subheadline.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.subheadline || '').length}/{FIELD_LIMITS.subheadline.max}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
        <input
          type="text"
          value={formData.ctaText || ''}
          onChange={(e) => handleChange('ctaText', e.target.value)}
          placeholder="e.g., Schedule a Visit"
          maxLength={FIELD_LIMITS.ctaText.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.ctaText || '').length}/{FIELD_LIMITS.ctaText.max}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
        <input
          type="text"
          value={formData.badge || ''}
          onChange={(e) => handleChange('badge', e.target.value)}
          placeholder="e.g., New Launch, Ready to Move"
          maxLength={FIELD_LIMITS.badge.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.badge || '').length}/{FIELD_LIMITS.badge.max}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Exclusive Offers</label>
        <div className="space-y-2">
          {(formData.offers || []).map((offer, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={offer.text || ''}
                onChange={(e) => {
                  const newOffers = [...(formData.offers || [])];
                  newOffers[index] = { ...newOffers[index], text: e.target.value };
                  handleChange('offers', newOffers);
                }}
                placeholder={`Offer ${index + 1}`}
                maxLength={FIELD_LIMITS.offerText.max}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label className="flex items-center gap-1 text-xs text-gray-600">
                <input
                  type="checkbox"
                  checked={offer.highlight || false}
                  onChange={(e) => {
                    const newOffers = [...(formData.offers || [])];
                    newOffers[index] = { ...newOffers[index], highlight: e.target.checked };
                    handleChange('offers', newOffers);
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                HOT
              </label>
              <button
                onClick={() => {
                  const newOffers = (formData.offers || []).filter((_, i) => i !== index);
                  handleChange('offers', newOffers);
                }}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newOffers = [...(formData.offers || []), { text: '', highlight: false }];
              handleChange('offers', newOffers);
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Offer
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Validity</label>
        <input
          type="text"
          value={formData.offerValidity || ''}
          onChange={(e) => handleChange('offerValidity', e.target.value)}
          placeholder="e.g., 31st March 2026, Limited Time Only"
          maxLength={FIELD_LIMITS.offerValidity.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.offerValidity || '').length}/{FIELD_LIMITS.offerValidity.max}</p>
      </div>
    </div>
  );

  const renderOverviewEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description<sup className="text-red-500">*</sup>
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Detailed description of the property..."
          rows={5}
          maxLength={FIELD_LIMITS.description.max}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        <p className="text-xs text-gray-400 mt-1">{(formData.description || '').length}/{FIELD_LIMITS.description.max}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Key Points</label>
        <div className="space-y-2">
          {(formData.keyPoints || []).map((point, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={point}
                onChange={(e) => handleArrayItemChange(index, null, e.target.value)}
                placeholder={`Point ${index + 1}`}
                maxLength={FIELD_LIMITS.keyPoint.max}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeArrayItem(index, 'keyPoints')}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('', 'keyPoints')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Key Point
          </button>
        </div>
      </div>
    </div>
  );

  const renderHighlightsEditor = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
      {formData.map((highlight, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
          <button
            onClick={() => removeArrayItem(index)}
            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Icon</label>
              <select
                value={highlight.icon || ''}
                onChange={(e) => handleArrayItemChange(index, 'icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an icon</option>
                <option value="home">Home</option>
                <option value="pool">Pool</option>
                <option value="tree">Tree</option>
                <option value="shield">Shield</option>
                <option value="star">Star</option>
                <option value="heart">Heart</option>
                <option value="building">Building</option>
                <option value="location">Location</option>
                <option value="clock">Clock</option>
                <option value="award">Award</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Title<sup className="text-red-500">*</sup>
              </label>
              <input
                type="text"
                value={highlight.title || ''}
                onChange={(e) => handleArrayItemChange(index, 'title', e.target.value)}
                placeholder="e.g., Ready to Move"
                maxLength={FIELD_LIMITS.highlightTitle.max}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`${index}_title`] ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors[`${index}_title`] && <p className="text-xs text-red-500 mt-1">{errors[`${index}_title`]}</p>}
              <p className="text-xs text-gray-400 mt-1">{(highlight.title || '').length}/{FIELD_LIMITS.highlightTitle.max}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Description<sup className="text-red-500">*</sup>
              </label>
              <textarea
                value={highlight.description || ''}
                onChange={(e) => handleArrayItemChange(index, 'description', e.target.value)}
                placeholder="Brief description of this highlight"
                rows={2}
                maxLength={FIELD_LIMITS.highlightDescription.max}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors[`${index}_description`] ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors[`${index}_description`] && <p className="text-xs text-red-500 mt-1">{errors[`${index}_description`]}</p>}
              <p className="text-xs text-gray-400 mt-1">{(highlight.description || '').length}/{FIELD_LIMITS.highlightDescription.max}</p>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => addArrayItem({ icon: '', title: '', description: '' })}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="w-4 h-4" />
        Add Highlight
      </button>
    </div>
  );

  const renderLocationEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Connectivity</label>
        <textarea
          value={formData.connectivity || ''}
          onChange={(e) => handleChange('connectivity', e.target.value)}
          placeholder="Describe the location connectivity..."
          rows={4}
          maxLength={FIELD_LIMITS.connectivity.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.connectivity || '').length}/{FIELD_LIMITS.connectivity.max}</p>
      </div>
    </div>
  );

  const renderInvestmentEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Investment Benefits</label>
        <div className="space-y-2">
          {(formData.benefits || []).map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayItemChange(index, null, e.target.value)}
                placeholder={`Benefit ${index + 1}`}
                maxLength={FIELD_LIMITS.benefit.max}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeArrayItem(index, 'benefits')}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => addArrayItem('', 'benefits')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Benefit
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rental Potential</label>
        <textarea
          value={formData.rentalPotential || ''}
          onChange={(e) => handleChange('rentalPotential', e.target.value)}
          placeholder="Describe rental potential..."
          rows={3}
          maxLength={FIELD_LIMITS.rentalPotential.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.rentalPotential || '').length}/{FIELD_LIMITS.rentalPotential.max}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Future Growth</label>
        <textarea
          value={formData.futureGrowth || ''}
          onChange={(e) => handleChange('futureGrowth', e.target.value)}
          placeholder="Describe future growth potential..."
          rows={3}
          maxLength={FIELD_LIMITS.futureGrowth.max}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{(formData.futureGrowth || '').length}/{FIELD_LIMITS.futureGrowth.max}</p>
      </div>
    </div>
  );

  const renderFAQEditor = () => (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">FAQs</label>
      {formData.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
          <button
            onClick={() => removeArrayItem(index)}
            className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Question<sup className="text-red-500">*</sup>
              </label>
              <input
                type="text"
                value={faq.question || ''}
                onChange={(e) => handleArrayItemChange(index, 'question', e.target.value)}
                placeholder="Enter question"
                maxLength={FIELD_LIMITS.faqQuestion.max}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`${index}_question`] ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors[`${index}_question`] && <p className="text-xs text-red-500 mt-1">{errors[`${index}_question`]}</p>}
              <p className="text-xs text-gray-400 mt-1">{(faq.question || '').length}/{FIELD_LIMITS.faqQuestion.max}</p>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Answer<sup className="text-red-500">*</sup>
              </label>
              <textarea
                value={faq.answer || ''}
                onChange={(e) => handleArrayItemChange(index, 'answer', e.target.value)}
                placeholder="Enter answer"
                rows={3}
                maxLength={FIELD_LIMITS.faqAnswer.max}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors[`${index}_answer`] ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors[`${index}_answer`] && <p className="text-xs text-red-500 mt-1">{errors[`${index}_answer`]}</p>}
              <p className="text-xs text-gray-400 mt-1">{(faq.answer || '').length}/{FIELD_LIMITS.faqAnswer.max}</p>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => addArrayItem({ question: '', answer: '' })}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
      >
        <Plus className="w-4 h-4" />
        Add FAQ
      </button>
    </div>
  );

  const renderBuilderEditor = () => {
    const iconOptions = [
      { value: 'building', label: 'Building', icon: '🏢' },
      { value: 'award', label: 'Award', icon: '🏆' },
      { value: 'mapPin', label: 'Map Pin', icon: '📍' },
      { value: 'users', label: 'Users', icon: '👥' },
      { value: 'briefcase', label: 'Briefcase', icon: '💼' },
      { value: 'home', label: 'Home', icon: '🏠' },
      { value: 'globe', label: 'Globe', icon: '🌐' },
      { value: 'star', label: 'Star', icon: '⭐' },
    ];

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            About Builder<sup className="text-red-500">*</sup>
          </label>
          <textarea
            value={formData.aboutBuilder || ''}
            onChange={(e) => handleChange('aboutBuilder', e.target.value)}
            placeholder="Brief description of the builder (1-2 lines, max 150 characters)"
            rows={2}
            maxLength={150}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.aboutBuilder ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.aboutBuilder && <p className="text-sm text-red-500 mt-1">{errors.aboutBuilder}</p>}
          <p className="text-xs text-gray-400 mt-1">{(formData.aboutBuilder || '').length}/150 characters (1-2 lines recommended)</p>
        </div>

        {/* Stats Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Builder Stats</label>
          <p className="text-xs text-gray-500 mb-3">Add statistics like projects delivered, years of experience, etc.</p>
          <div className="space-y-2">
            {(formData.stats || []).map((stat, index) => (
              <div key={index} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg">
                <select
                  value={stat.icon || 'building'}
                  onChange={(e) => {
                    const newStats = [...(formData.stats || [])];
                    newStats[index] = { ...newStats[index], icon: e.target.value };
                    handleChange('stats', newStats);
                  }}
                  className="px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={stat.value || ''}
                  onChange={(e) => {
                    const newStats = [...(formData.stats || [])];
                    newStats[index] = { ...newStats[index], value: e.target.value };
                    handleChange('stats', newStats);
                  }}
                  placeholder="e.g., 250+"
                  maxLength={20}
                  className="w-20 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="text"
                  value={stat.label || ''}
                  onChange={(e) => {
                    const newStats = [...(formData.stats || [])];
                    newStats[index] = { ...newStats[index], label: e.target.value };
                    handleChange('stats', newStats);
                  }}
                  placeholder="e.g., Projects Delivered"
                  maxLength={50}
                  className="flex-1 px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => {
                    const newStats = (formData.stats || []).filter((_, i) => i !== index);
                    handleChange('stats', newStats);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(formData.stats || []).length < 6 && (
              <button
                onClick={() => {
                  const newStats = [...(formData.stats || []), { icon: 'building', value: '', label: '' }];
                  handleChange('stats', newStats);
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Stat
              </button>
            )}
          </div>
        </div>

        {/* Key Facts Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Why Choose Us (Key Facts)</label>
          <p className="text-xs text-gray-500 mb-3">Add 4-6 key facts about the builder that will appear in the "Why Choose Us" section</p>
          <div className="space-y-2">
            {(formData.keyFacts || []).map((fact, index) => (
              <div key={index} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg">
                <select
                  value={fact.icon || 'check'}
                  onChange={(e) => {
                    const newKeyFacts = [...(formData.keyFacts || [])];
                    newKeyFacts[index] = { ...newKeyFacts[index], icon: e.target.value };
                    handleChange('keyFacts', newKeyFacts);
                  }}
                  className="px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={fact.text || ''}
                  onChange={(e) => {
                    const newKeyFacts = [...(formData.keyFacts || [])];
                    newKeyFacts[index] = { ...newKeyFacts[index], text: e.target.value };
                    handleChange('keyFacts', newKeyFacts);
                  }}
                  placeholder={`Fact ${index + 1}`}
                  maxLength={200}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={() => {
                    const newKeyFacts = (formData.keyFacts || []).filter((_, i) => i !== index);
                    handleChange('keyFacts', newKeyFacts);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(formData.keyFacts || []).length < 6 && (
              <button
                onClick={() => {
                  const newKeyFacts = [...(formData.keyFacts || []), { icon: 'check', text: '' }];
                  handleChange('keyFacts', newKeyFacts);
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Key Fact
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSEOEditor = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Title<sup className="text-red-500">*</sup>
        </label>
        <input
          type="text"
          value={formData.metaTitle || ''}
          onChange={(e) => handleChange('metaTitle', e.target.value)}
          placeholder="Page title for SEO"
          maxLength={FIELD_LIMITS.metaTitle.max}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.metaTitle ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.metaTitle && <p className="text-sm text-red-500 mt-1">{errors.metaTitle}</p>}
        <p className="text-xs text-gray-400 mt-1">{(formData.metaTitle || '').length}/{FIELD_LIMITS.metaTitle.max} characters (recommended: 50-60)</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description<sup className="text-red-500">*</sup>
        </label>
        <textarea
          value={formData.metaDescription || ''}
          onChange={(e) => handleChange('metaDescription', e.target.value)}
          placeholder="Brief description for search engines"
          rows={3}
          maxLength={FIELD_LIMITS.metaDescription.max}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.metaDescription ? 'border-red-500' : 'border-gray-200'}`}
        />
        {errors.metaDescription && <p className="text-sm text-red-500 mt-1">{errors.metaDescription}</p>}
        <p className="text-xs text-gray-400 mt-1">{(formData.metaDescription || '').length}/{FIELD_LIMITS.metaDescription.max} characters (recommended: 150-160)</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(formData.keywords || []).map((keyword, index) => (
            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm flex items-center gap-1">
              {keyword}
              <button
                onClick={() => {
                  const newKeywords = formData.keywords.filter((_, i) => i !== index);
                  handleChange('keywords', newKeywords);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add keyword"
            maxLength={50}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleChange('keywords', [...(formData.keywords || []), e.target.value.trim()]);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector('input[placeholder="Add keyword"]');
              if (input && input.value.trim()) {
                handleChange('keywords', [...(formData.keywords || []), input.value.trim()]);
                input.value = '';
              }
            }}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (section) {
      case 'hero':
        return renderHeroEditor();
      case 'overview':
        return renderOverviewEditor();
      case 'highlights':
        return renderHighlightsEditor();
      case 'location':
        return renderLocationEditor();
      case 'investment':
        return renderInvestmentEditor();
      case 'builder':
        return renderBuilderEditor();
      case 'faq':
        return renderFAQEditor();
      case 'seo':
        return renderSEOEditor();
      default:
        return <p className="text-gray-500">No editor available for this section</p>;
    }
  };

  const sectionNames = {
    hero: 'Hero',
    overview: 'Overview',
    highlights: 'Highlights',
    location: 'Location',
    investment: 'Investment',
    builder: 'Builder',
    faq: 'FAQ',
    seo: 'SEO'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Edit {sectionNames[section] || section}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderEditor()}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIContentStep;