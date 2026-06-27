import { useState } from 'react';
import { Check, AlertCircle, Eye, Edit2, ExternalLink, Save, UserCog } from 'lucide-react';
import TelecallerAssignment from './TelecallerAssignment.jsx';

const ReviewStep = ({ propertyData, onSaveDraft, onPublish }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Check if property has been saved to database
  const isPropertySaved = !!propertyData._id;

  // Validation checks
  const checks = {
    basicInfo: {
      name: !!propertyData.name,
      slug: !!propertyData.slug,
      builder: !!propertyData.builder,
      propertyType: !!propertyData.propertyType,
      category: !!propertyData.category,
      city: !!propertyData.address?.city,
      locality: !!propertyData.address?.locality,
      priceRange: !!propertyData.priceRange?.min && !!propertyData.priceRange?.max,
    },
    sections: {
      enabledSections: Object.values(propertyData.sections || {}).filter((s) => s.enabled).length > 0,
    },
    media: {
      heroImages: (propertyData.heroImages || []).length > 0,
      gallery: (propertyData.gallery || []).length > 0,
    },
    content: {
      hero: !!propertyData.generatedContent?.hero?.headline,
      overview: !!propertyData.generatedContent?.overview?.description,
    },
  };

  const allChecksPassed = Object.values(checks).every((group) =>
    Object.values(group).every((check) => check)
  );

  const enabledSections = Object.entries(propertyData.sections || {})
    .filter(([_, config]) => config.enabled)
    .sort((a, b) => a[1].order - b[1].order);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Publish</h2>
        <p className="text-gray-600 mt-1">Review your property details before publishing</p>
      </div>

      {/* Validation Summary */}
      <div
        className={`rounded-xl p-6 ${
          allChecksPassed ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          {allChecksPassed ? (
            <Check className="w-6 h-6 text-emerald-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600" />
          )}
          <h3 className={`text-lg font-semibold ${allChecksPassed ? 'text-emerald-900' : 'text-amber-900'}`}>
            {allChecksPassed ? 'All checks passed! Ready to publish.' : 'Some items need attention'}
          </h3>
        </div>

        {/* Basic Info Checks */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(checks.basicInfo).map(([key, passed]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {passed ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className={passed ? 'text-gray-600' : 'text-amber-700'}>
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Media Checks */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Media</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(checks.media).map(([key, passed]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {passed ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className={passed ? 'text-gray-600' : 'text-amber-700'}>
                  {key === 'heroImages' ? 'Hero Images' : key === 'gallery' ? 'Gallery Images' : key}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Checks */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">AI Content</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(checks.content).map(([key, passed]) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {passed ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                <span className={passed ? 'text-gray-600' : 'text-amber-700'}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} Content
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Property Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Property Summary</h3>
        </div>

        <div className="divide-y divide-gray-100">
          {/* Basic Info */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Property Name</p>
                <p className="font-medium text-gray-900">{propertyData.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">URL Slug</p>
                <p className="font-medium text-gray-900">/property/{propertyData.slug || 'not-set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Builder</p>
                <p className="font-medium text-gray-900">{propertyData.builder || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium text-gray-900 capitalize">
                  {propertyData.propertyType?.replace('-', ' ') || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900 capitalize">
                  {propertyData.category?.replace('-', ' ') || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Configurations</p>
                <p className="font-medium text-gray-900">
                  {(propertyData.pricingPlans || []).map(p => p.configuration).filter(Boolean).join(', ') || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">Location</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {propertyData.address?.fullAddress || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">City</p>
                <p className="font-medium text-gray-900">
                  {propertyData.address?.locality}, {propertyData.address?.city}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">Pricing</h4>
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-sm text-blue-600">Price Range</p>
                <p className="text-2xl font-bold text-blue-800">
                  ₹{propertyData.priceRange?.min || '0'} {propertyData.priceRange?.minUnit === 'cr' ? 'Cr' : 'Lac'} - ₹{propertyData.priceRange?.max || '0'} {propertyData.priceRange?.maxUnit === 'cr' ? 'Cr' : 'Lac'}
                </p>
              </div>
              {propertyData.reraNumber && (
                <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                  <p className="text-sm text-emerald-600">RERA Number</p>
                  <p className="font-medium text-emerald-800">{propertyData.reraNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sections */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">Enabled Sections</h4>
            <div className="flex flex-wrap gap-2">
              {enabledSections.map(([key, config]) => (
                <span
                  key={key}
                  className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)} ({config.layout})
                </span>
              ))}
            </div>
          </div>

          {/* Media */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">Media</h4>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hero Images</p>
                <p className="font-medium text-gray-900">
                  {propertyData.heroImages?.length || 0} images
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gallery</p>
                <p className="font-medium text-gray-900">
                  {propertyData.gallery?.length || 0} images
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Floor Plans</p>
                <p className="font-medium text-gray-900">
                  {propertyData.plans?.floorPlans?.length || 0} floor plans
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Master Plan</p>
                <p className="font-medium text-gray-900">
                  {propertyData.plans?.masterPlan?.url ? 'Uploaded' : 'Not uploaded'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Video Tour</p>
                <p className="font-medium text-gray-900">
                  {propertyData.videoTour ? 'Added' : 'Not added'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Brochure</p>
                <p className="font-medium text-gray-900">
                  {propertyData.brochure?.url ? 'Uploaded' : 'Not uploaded'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amenities</p>
                <p className="font-medium text-gray-900">
                  {(propertyData.amenities || []).filter(a => a.image).length} with images
                </p>
              </div>
              {propertyData.propertyType === 'residential-plot' || propertyData.propertyType === 'commercial-plot' || propertyData.propertyType === 'agricultural-land' ? (
                <div>
                  <p className="text-sm text-gray-500">Dimension Plans</p>
                  <p className="font-medium text-gray-900">
                    {propertyData.plans?.dimensionPlans?.length || 0} plans
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* AI Content */}
          <div className="p-6">
            <h4 className="font-medium text-gray-900 mb-4">AI Generated Content</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['hero', 'overview', 'highlights', 'location', 'investment', 'faq', 'seo'].map(
                (section) => {
                  const hasContent =
                    propertyData.generatedContent?.[section] &&
                    Object.keys(propertyData.generatedContent[section]).length > 0;
                  return (
                    <div key={section} className="flex items-center gap-2">
                      {hasContent ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-300" />
                      )}
                      <span className={hasContent ? 'text-gray-600' : 'text-gray-400'}>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Telecaller Assignment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <UserCog className="w-5 h-5 text-blue-800" />
            <h3 className="text-lg font-semibold text-gray-900">Lead Distribution</h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Assign telecallers to distribute leads in round-robin order
          </p>
        </div>
        <div className="p-6">
          <TelecallerAssignment propertyId={propertyData._id} />
        </div>
      </div>

      {/* Preview Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setPreviewOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 relative"
        >
          <Eye className="w-5 h-5" />
          Preview Landing Page
          {!isPropertySaved && (
            <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
              Save First
            </span>
          )}
        </button>
      </div>

      {/* Unsaved Property Warning */}
      {!isPropertySaved && (
        <div className="flex items-center justify-center gap-2 text-amber-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Save the property as draft to enable preview</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <button
          onClick={onSaveDraft}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
        >
          Save as Draft
        </button>
        <button
          onClick={onPublish}
          disabled={!allChecksPassed}
          className="px-8 py-3 bg-blue-800 text-white font-medium rounded-xl hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Publish Property
        </button>
      </div>

      {!allChecksPassed && (
        <p className="text-center text-sm text-amber-600">
          Please complete all required fields before publishing
        </p>
      )}

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold">Preview: {propertyData.name || 'Property'}</h3>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              {!isPropertySaved ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Save Property First</h4>
                  <p className="text-gray-500 mb-4">
                    You need to save the property before you can preview it.
                  </p>
                  <button
                    onClick={async () => {
                      await onSaveDraft();
                      setPreviewOpen(false);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                  >
                    <Save className="w-4 h-4" />
                    Save Draft
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 text-center py-4">
                    Preview will open in a new tab. Make sure you have saved your changes.
                  </p>
                  <button
                    onClick={() => window.open(`/property/${propertyData.slug}`, '_blank')}
                    className="w-full py-2 bg-blue-800 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-900"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Preview
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;