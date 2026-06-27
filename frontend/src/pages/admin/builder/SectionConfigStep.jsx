import { ChevronUp, ChevronDown, Settings2 } from 'lucide-react';
import { useState } from 'react';

const SECTION_CONFIG = [
  { key: 'hero', name: 'Hero', description: 'Main banner with property highlights' },
  { key: 'overview', name: 'Overview', description: 'About the property' },
  { key: 'highlights', name: 'Highlights', description: 'Key features and benefits' },
  { key: 'amenities', name: 'Amenities', description: 'Property amenities list' },
  { key: 'pricing', name: 'Pricing', description: 'Price details and configurations' },
  { key: 'plans', name: 'Plans', description: 'Master plan, floor plans, and dimensions' },
  { key: 'location', name: 'Location', description: 'Map and nearby places' },
  { key: 'gallery', name: 'Gallery', description: 'Property images' },
  { key: 'videoTour', name: 'Video Tour', description: 'Property video walkthrough' },
  { key: 'builderInfo', name: 'Builder Info', description: 'Developer information' },
  { key: 'investment', name: 'Investment', description: 'Investment benefits' },
  { key: 'faq', name: 'FAQ', description: 'Frequently asked questions' },
  { key: 'contact', name: 'Contact', description: 'Contact form and details' },
];

// Layout options for each section type
const LAYOUT_OPTIONS = {
  overview: [
    { value: 'standard', label: 'Standard', description: 'Two-column layout' },
  ],
  highlights: [
    { value: 'cards', label: 'Cards', description: 'Icon cards in grid' },
  ],
  amenities: [
    { value: 'grid', label: 'Grid', description: 'Grid with category cards' },
  ],
  pricing: [
    { value: 'cards', label: 'Cards', description: 'Price cards in grid' },
  ],
  plans: [
    { value: 'grid', label: 'Grid', description: 'All plans in grid layout' },
  ],
  location: [
    { value: 'map-list', label: 'Map with List', description: 'Map alongside nearby places' },
  ],
  gallery: [
    { value: 'carousel', label: 'Carousel', description: 'Slide through images' },
  ],
  videoTour: [
    { value: 'full-width', label: 'Full Width', description: 'Full-width video player' },
  ],
  builderInfo: [
    { value: 'standard', label: 'Standard', description: 'Builder info with logo' },
  ],
  investment: [
    { value: 'cards', label: 'Cards', description: 'Benefit cards in grid' },
  ],
  faq: [
    { value: 'accordion', label: 'Accordion', description: 'Expandable questions' },
  ],
  contact: [
    { value: 'standard', label: 'Standard', description: 'Contact form with details' },
  ],
};

const SectionConfigStep = ({ propertyData, updatePropertyData }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const getSections = () => {
    return SECTION_CONFIG.map((section) => ({
      ...section,
      enabled: propertyData.sections?.[section.key]?.enabled ?? true,
      order: propertyData.sections?.[section.key]?.order ?? SECTION_CONFIG.indexOf(section) + 1,
      layout: propertyData.sections?.[section.key]?.layout || LAYOUT_OPTIONS[section.key]?.[0]?.value || 'standard',
    })).sort((a, b) => a.order - b.order);
  };

  const [sections, setSections] = useState(getSections());

  const toggleSection = (key) => {
    const newSections = sections.map((section) =>
      section.key === key ? { ...section, enabled: !section.enabled } : section
    );
    setSections(newSections);
    updatePropertyData('sections', {
      ...propertyData.sections,
      [key]: {
        ...propertyData.sections[key],
        enabled: !propertyData.sections[key]?.enabled,
        layout: propertyData.sections[key]?.layout || LAYOUT_OPTIONS[key]?.[0]?.value || 'standard',
      },
    });
  };

  const moveSection = (key, direction) => {
    const currentIndex = sections.findIndex((s) => s.key === key);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newSections[currentIndex], newSections[targetIndex]] = [newSections[targetIndex], newSections[currentIndex]];

    // Update order values
    newSections.forEach((section, index) => {
      section.order = index + 1;
    });

    setSections(newSections);

    // Update property data
    const newPropertySections = {};
    newSections.forEach((section) => {
      newPropertySections[section.key] = {
        enabled: section.enabled,
        order: section.order,
        layout: section.layout,
      };
    });
    updatePropertyData('sections', newPropertySections);
  };

  const updateLayout = (key, layout) => {
    const newSections = sections.map((section) =>
      section.key === key ? { ...section, layout } : section
    );
    setSections(newSections);
    updatePropertyData('sections', {
      ...propertyData.sections,
      [key]: {
        ...propertyData.sections[key],
        layout,
      },
    });
  };

  const enabledCount = sections.filter((s) => s.enabled).length;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Section Configuration</h2>
        <p className="text-gray-600 mt-1">
          Enable sections, reorder them, and customize layouts
        </p>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Active Sections</h4>
            <p className="text-sm text-blue-700">
              {enabledCount} of {sections.length} sections will be displayed
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newPropertySections = {};
                sections.forEach((section) => {
                  newPropertySections[section.key] = {
                    enabled: true,
                    order: section.order,
                    layout: section.layout,
                  };
                });
                setSections(sections.map(s => ({ ...s, enabled: true })));
                updatePropertyData('sections', newPropertySections);
              }}
              className="px-3 py-1.5 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 cursor-pointer"
            >
              Enable All
            </button>
            <button
              onClick={() => {
                const newPropertySections = {};
                sections.forEach((section) => {
                  newPropertySections[section.key] = {
                    enabled: false,
                    order: section.order,
                    layout: section.layout,
                  };
                });
                setSections(sections.map(s => ({ ...s, enabled: false })));
                updatePropertyData('sections', newPropertySections);
              }}
              className="px-3 py-1.5 text-sm bg-white text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer"
            >
              Disable All
            </button>
          </div>
        </div>
      </div>

      {/* Section List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {sections.map((section, index) => {
            const layoutOptions = LAYOUT_OPTIONS[section.key] || [];
            const hasMultipleLayouts = layoutOptions.length > 1;

            return (
              <div
                key={section.key}
                className={`${!section.enabled ? 'bg-gray-50' : ''}`}
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveSection(section.key, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => moveSection(section.key, 'down')}
                        disabled={index === sections.length - 1}
                        className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>

                    {/* Order Number */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                      section.enabled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {section.order}
                    </div>

                    {/* Section Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${section.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                          {section.name}
                        </h3>
                        {!section.enabled && (
                          <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                        {hasMultipleLayouts && section.enabled && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {layoutOptions.find(l => l.value === section.layout)?.label || section.layout}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${section.enabled ? 'text-gray-500' : 'text-gray-400'}`}>
                        {section.description}
                      </p>
                    </div>

                    {/* Layout Button */}
                    {hasMultipleLayouts && section.enabled && (
                      <button
                        onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                        title="Layout options"
                      >
                        <Settings2 className="w-5 h-5" />
                      </button>
                    )}

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleSection(section.key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        section.enabled ? 'bg-blue-800' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          section.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Layout Options (Expandable) */}
                  {hasMultipleLayouts && section.enabled && expandedSection === section.key && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-3">Layout Style</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {layoutOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateLayout(section.key, option.value)}
                            className={`p-3 rounded-lg text-left transition-all cursor-pointer ${
                              section.layout === option.value
                                ? 'bg-blue-800 text-white'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className={`text-xs mt-0.5 ${section.layout === option.value ? 'text-blue-200' : 'text-gray-500'}`}>
                              {option.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Order */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="font-medium text-gray-900 mb-3">Landing Page Order</h4>
        <p className="text-sm text-gray-600 mb-4">
          Your property landing page will display sections in this order:
        </p>
        <div className="flex flex-wrap gap-2">
          {sections
            .filter((s) => s.enabled)
            .map((section, index) => (
              <div
                key={section.key}
                className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg text-sm border border-gray-200"
              >
                <span className="w-5 h-5 bg-blue-800 text-white rounded text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <span>{section.name}</span>
                {LAYOUT_OPTIONS[section.key]?.length > 1 && (
                  <span className="text-xs text-gray-400 ml-1">
                    ({LAYOUT_OPTIONS[section.key]?.find(l => l.value === section.layout)?.label || section.layout})
                  </span>
                )}
              </div>
            ))}
        </div>
        {enabledCount === 0 && (
          <p className="text-amber-600 text-sm mt-3">
            ⚠️ No sections enabled. Enable at least one section to display on the landing page.
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionConfigStep;