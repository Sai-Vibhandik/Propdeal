import { useState } from 'react';
import { Palette, Type, Image, Upload, X, Layers, Sun, Moon, Eye } from 'lucide-react';
import { mediaAPI, getFileUrl } from '../../../services/api.js';
import { getThemeStyles, suggestDarkMode } from '../../../utils/theme.js';

const THEME_PRESETS = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    primaryColor: '#1e40af',
    secondaryColor: '#d4af37',
    isDark: false,
    description: 'Professional and trustworthy',
    preview: 'bg-gradient-to-br from-blue-800 to-blue-600',
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    primaryColor: '#c9a227',
    secondaryColor: '#fbbf24',
    isDark: true,
    description: 'Premium and elegant (Dark)',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-800',
  },
  {
    id: 'modern-green',
    name: 'Modern Green',
    primaryColor: '#059669',
    secondaryColor: '#fbbf24',
    isDark: false,
    description: 'Fresh and eco-friendly',
    preview: 'bg-gradient-to-br from-emerald-600 to-emerald-500',
  },
  {
    id: 'bold-red',
    name: 'Bold Red',
    primaryColor: '#dc2626',
    secondaryColor: '#f59e0b',
    isDark: false,
    description: 'Bold and energetic',
    preview: 'bg-gradient-to-br from-red-600 to-red-500',
  },
  {
    id: 'minimal-white',
    name: 'Minimal White',
    primaryColor: '#374151',
    secondaryColor: '#3b82f6',
    isDark: false,
    description: 'Clean and contemporary',
    preview: 'bg-gradient-to-br from-gray-100 to-white',
  },
  {
    id: 'elegant-purple',
    name: 'Elegant Purple',
    primaryColor: '#7c3aed',
    secondaryColor: '#c084fc',
    isDark: false,
    description: 'Sophisticated and modern',
    preview: 'bg-gradient-to-br from-purple-600 to-purple-500',
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth',
    primaryColor: '#b45309',
    secondaryColor: '#d97706',
    isDark: false,
    description: 'Natural and inviting',
    preview: 'bg-gradient-to-br from-amber-700 to-amber-600',
  },
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    primaryColor: '#c9a227',
    secondaryColor: '#e5e5e5',
    isDark: true,
    description: 'Dark premium theme',
    preview: 'bg-gradient-to-br from-gray-900 to-gray-700',
  },
];

const FONT_STYLES = [
  { id: 'modern', name: 'Modern', font: 'Inter, sans-serif', description: 'Clean and contemporary' },
  { id: 'classic', name: 'Classic', font: 'Georgia, serif', description: 'Traditional and elegant' },
  { id: 'luxury', name: 'Luxury', font: 'Playfair Display, serif', description: 'Premium and sophisticated' },
];

const LOGO_POSITIONS = [
  { id: 'left', name: 'Left' },
  { id: 'center', name: 'Center' },
  { id: 'right', name: 'Right' },
];

const SECTION_BACKGROUNDS = [
  { key: 'overview', label: 'Overview', description: 'About the property' },
  { key: 'highlights', label: 'Highlights', description: 'Key features' },
  { key: 'builderInfo', label: 'Builder', description: 'Developer profile' },
];

const LAYOUT_OPTIONS = [
  { value: 'background', label: 'Full Background', description: 'Image covers entire section with dark overlay', icon: '🖼️' },
  { value: 'split-left', label: 'Split Left', description: 'Image on left half, content on right', icon: '⬅️' },
  { value: 'split-right', label: 'Split Right', description: 'Content on left, image on right half', icon: '➡️' },
];

const ThemeStep = ({ propertyData, updatePropertyData }) => {
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('theme');

  const theme = propertyData.theme || {};
  const branding = propertyData.branding || {};

  // Get live theme styles for preview
  const liveStyles = getThemeStyles(theme);

  const handlePresetSelect = (preset) => {
    updatePropertyData('theme', {
      ...theme,
      preset: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      darkMode: preset.isDark,
    });
  };

  const handleThemeChange = (field, value) => {
    updatePropertyData('theme', { ...theme, [field]: value });
  };

  const handleBrandingChange = (field, value) => {
    updatePropertyData('branding', { ...branding, [field]: value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await mediaAPI.uploadImage(file);
      if (response.data.success) {
        updatePropertyData('branding', {
          ...branding,
          logo: response.data.data.url,
        });
      }
    } catch (error) {
      console.error('Logo upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await mediaAPI.uploadImage(file);
      if (response.data.success) {
        updatePropertyData('branding', {
          ...branding,
          favicon: response.data.data.url,
        });
      }
    } catch (error) {
      console.error('Favicon upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleBackgroundUpload = async (section, file) => {
    if (!file) return;

    setUploading(true);
    try {
      const response = await mediaAPI.uploadImage(file);
      if (response.data.success) {
        const backgrounds = propertyData.sectionBackgrounds || {};
        const currentSection = backgrounds[section] || { image: '', layout: 'background' };
        updatePropertyData('sectionBackgrounds', {
          ...backgrounds,
          [section]: {
            ...currentSection,
            image: response.data.data.url,
          },
        });
      }
    } catch (error) {
      console.error('Background upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeBackground = (section) => {
    const backgrounds = { ...(propertyData.sectionBackgrounds || {}) };
    backgrounds[section] = { image: '', layout: 'background' };
    updatePropertyData('sectionBackgrounds', backgrounds);
  };

  const handleLayoutChange = (section, layout) => {
    const backgrounds = { ...(propertyData.sectionBackgrounds || {}) };
    const currentSection = backgrounds[section] || { image: '', layout: 'background' };
    updatePropertyData('sectionBackgrounds', {
      ...backgrounds,
      [section]: {
        ...currentSection,
        layout,
      },
    });
  };

  // Auto-suggest dark mode when customizing colors
  const handleColorChange = (field, value) => {
    const newTheme = { ...theme, [field]: value };

    // If custom preset, auto-suggest dark mode based on primary color
    if (theme.preset === 'custom' || !theme.preset) {
      const suggestedDarkMode = suggestDarkMode(newTheme.primaryColor || '#1e40af');
      // Only auto-switch if user hasn't manually set dark mode
      newTheme.darkMode = suggestedDarkMode;
    }

    updatePropertyData('theme', newTheme);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Branding & Theme</h2>
        <p className="text-gray-600 mt-1">Customize the look and feel of your landing page</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200">
        <button
          onClick={() => setActiveTab('theme')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'theme'
              ? 'border-blue-800 text-blue-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 inline mr-2" />
          Theme
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'branding'
              ? 'border-blue-800 text-blue-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Image className="w-4 h-4 inline mr-2" />
          Branding
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'layout'
              ? 'border-blue-800 text-blue-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Type className="w-4 h-4 inline mr-2" />
          Font & Mode
        </button>
        <button
          onClick={() => setActiveTab('backgrounds')}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'backgrounds'
              ? 'border-blue-800 text-blue-800'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layers className="w-4 h-4 inline mr-2" />
          Section Backgrounds
        </button>
      </div>

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="space-y-8">
          {/* Presets */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme Presets</h3>
            <p className="text-sm text-gray-500 mb-4">Choose a predefined color scheme or customize your own</p>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                    theme.preset === preset.id
                      ? 'border-blue-800 ring-2 ring-blue-800 ring-offset-2'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`h-24 ${preset.preview}`}>
                    {preset.isDark && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full flex items-center gap-1">
                        <Moon className="w-3 h-3" />
                        Dark
                      </span>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <p className="font-medium text-gray-900 text-sm">{preset.name}</p>
                    <p className="text-xs text-gray-500">{preset.description}</p>
                  </div>
                  {theme.preset === preset.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Custom Colors</h4>
              {theme.preset !== 'custom' && (
                <button
                  onClick={() => handleThemeChange('preset', 'custom')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Use custom colors
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.primaryColor || '#1e40af'}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor || '#1e40af'}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="#1e40af"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Main brand color for buttons, links, headings</p>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.secondaryColor || '#d4af37'}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor || '#d4af37'}
                    onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="#d4af37"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Accent color for highlights, badges</p>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.accentColor || '#059669'}
                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.accentColor || '#059669'}
                    onChange={(e) => handleThemeChange('accentColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    placeholder="#059669"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Success states, secondary CTAs</p>
              </div>
            </div>
          </div>

          {/* Dark/Light Mode Toggle */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Mode</h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose between light and dark theme for your landing page. Dark mode uses darker backgrounds for better visibility in low-light conditions.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleThemeChange('darkMode', false)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  !theme.darkMode
                    ? 'border-blue-800 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sun className={`w-6 h-6 ${!theme.darkMode ? 'text-blue-800' : 'text-gray-400'}`} />
                  <span className={`font-medium ${!theme.darkMode ? 'text-blue-800' : 'text-gray-700'}`}>
                    Light Mode
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Clean, bright appearance. Best for most websites.
                </p>
              </button>

              <button
                onClick={() => handleThemeChange('darkMode', true)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  theme.darkMode
                    ? 'border-blue-800 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Moon className={`w-6 h-6 ${theme.darkMode ? 'text-blue-800' : 'text-gray-400'}`} />
                  <span className={`font-medium ${theme.darkMode ? 'text-blue-800' : 'text-gray-700'}`}>
                    Dark Mode
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Darker appearance. Reduces eye strain in low light.
                </p>
              </button>
            </div>

            {/* Auto-suggestion notice */}
            {theme.preset === 'custom' && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> For custom colors, choose a display mode that provides good contrast. Light primary colors work better with dark mode, dark primary colors work better with light mode.
                </p>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Live Preview
            </h4>
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: liveStyles.colors.background,
                color: liveStyles.colors.text,
              }}
            >
              <div
                className="p-8"
                style={{ backgroundColor: liveStyles.colors.primary }}
              >
                <h3
                  className="text-2xl font-bold mb-2"
                  style={{ fontFamily: liveStyles.fonts.heading, color: '#fff' }}
                >
                  {propertyData.name || 'Property Name'}
                </h3>
                <p className="opacity-90 mb-4" style={{ color: '#fff' }}>
                  Experience luxury living in a prime location
                </p>
                <div className="flex gap-3">
                  <button
                    className="px-6 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: liveStyles.colors.secondary,
                      color: '#fff',
                    }}
                  >
                    Schedule Visit
                  </button>
                  <button
                    className="px-6 py-2 rounded-lg font-medium border-2"
                    style={{
                      borderColor: '#fff',
                      color: '#fff',
                    }}
                  >
                    Get Details
                  </button>
                </div>
              </div>
              <div
                className="p-6"
                style={{ backgroundColor: liveStyles.colors.cardBg }}
              >
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: liveStyles.isDark ? '#374151' : '#f3f4f6',
                      }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg mb-2"
                        style={{ backgroundColor: liveStyles.colors.primary }}
                      />
                      <div
                        className="h-4 rounded mb-1"
                        style={{
                          backgroundColor: liveStyles.colors.primary,
                          width: '60%',
                        }}
                      />
                      <div
                        className="h-3 rounded"
                        style={{
                          backgroundColor: liveStyles.colors.textMuted,
                          width: '80%',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Preview shows how your theme will look on the landing page
            </p>
          </div>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div className="space-y-8">
          {/* Logo Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Branding</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project/Company Logo</label>
                {branding.logo ? (
                  <div className="relative group">
                    <img
                      src={getFileUrl(branding.logo)}
                      alt="Logo"
                      className="h-20 object-contain bg-gray-50 rounded-lg p-2"
                    />
                    <button
                      onClick={() => handleBrandingChange('logo', '')}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="w-8 h-8 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Upload logo</p>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* Logo Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Position</label>
                <div className="flex gap-2">
                  {LOGO_POSITIONS.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => handleBrandingChange('logoPosition', pos.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        branding.logoPosition === pos.id
                          ? 'bg-blue-800 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pos.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favicon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                <p className="text-xs text-gray-500 mb-2">Icon displayed in browser tab (32x32 or 16x16 pixels recommended)</p>
                {branding.favicon ? (
                  <div className="relative group inline-block">
                    <img
                      src={getFileUrl(branding.favicon)}
                      alt="Favicon"
                      className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-2 border"
                    />
                    <button
                      onClick={() => handleBrandingChange('favicon', '')}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFaviconUpload}
                      disabled={uploading}
                    />
                    {uploading ? (
                      <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Upload favicon</p>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company/Builder Name</label>
                <input
                  type="text"
                  value={branding.companyName || ''}
                  onChange={(e) => handleBrandingChange('companyName', e.target.value)}
                  placeholder="e.g., ABC Builders Pvt Ltd"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline/Slogan</label>
                <input
                  type="text"
                  value={branding.tagline || ''}
                  onChange={(e) => handleBrandingChange('tagline', e.target.value)}
                  placeholder="e.g., Building Dreams Since 1990"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="text"
                  value={branding.phoneNumber || ''}
                  onChange={(e) => handleBrandingChange('phoneNumber', e.target.value)}
                  placeholder="e.g., +91 9876543210"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={branding.email || ''}
                  onChange={(e) => handleBrandingChange('email', e.target.value)}
                  placeholder="e.g., info@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Custom CTA Button Text</label>
                <input
                  type="text"
                  value={branding.customCtaText || ''}
                  onChange={(e) => handleBrandingChange('customCtaText', e.target.value)}
                  placeholder="e.g., Schedule a Site Visit"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default</p>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Options</h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={branding.showBuilderLogo !== false}
                  onChange={(e) => handleBrandingChange('showBuilderLogo', e.target.checked)}
                  className="w-5 h-5 text-blue-800 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">Show builder logo in footer</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={branding.showReraBadge !== false}
                  onChange={(e) => handleBrandingChange('showReraBadge', e.target.checked)}
                  className="w-5 h-5 text-blue-800 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">Show RERA badge on page</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Font & Mode Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-8">
          {/* Font Style */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Type className="w-5 h-5 inline mr-2" />
              Font Style
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {FONT_STYLES.map((font) => (
                <button
                  key={font.id}
                  onClick={() => handleThemeChange('fontStyle', font.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    theme.fontStyle === font.id
                      ? 'border-blue-800 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 mb-1" style={{ fontFamily: font.font }}>
                    {font.name}
                  </div>
                  <div className="text-sm text-gray-500">{font.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Backgrounds Tab */}
      {activeTab === 'backgrounds' && (
        <div className="space-y-8">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-medium text-blue-900 mb-2">About Section Backgrounds</h4>
            <p className="text-sm text-blue-800">
              Add background images to sections for a more visual look. Choose from different layout styles to display images alongside content.
              Upload images here and select how they should appear.
            </p>
          </div>

          {/* Layout Options Legend */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Available Layout Styles</h4>
            <div className="grid md:grid-cols-3 gap-3">
              {LAYOUT_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-start gap-2 text-sm text-gray-600 bg-white p-3 rounded-lg">
                  <span className="text-base">{option.icon}</span>
                  <div>
                    <strong className="text-gray-900">{option.label}</strong>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Backgrounds List */}
          <div className="space-y-6">
            {SECTION_BACKGROUNDS.map((section) => {
              const sectionData = propertyData.sectionBackgrounds?.[section.key] || { image: '', layout: 'background' };
              const bgImage = sectionData.image;

              return (
                <div key={section.key} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.label} Section</h3>
                      <p className="text-sm text-gray-500">{section.description}</p>
                    </div>
                    {bgImage && (
                      <button
                        onClick={() => removeBackground(section.key)}
                        className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove Image
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Image
                      </label>
                      {bgImage ? (
                        <div className="relative group">
                          <img
                            src={getFileUrl(bgImage)}
                            alt={section.label}
                            className="w-full h-40 object-cover rounded-xl"
                          />
                          <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) handleBackgroundUpload(section.key, file);
                              }}
                              disabled={uploading}
                            />
                            <span className="text-white font-medium">Replace Image</span>
                          </label>
                        </div>
                      ) : (
                        <label className="block border-2 border-dashed border-gray-300 rounded-xl h-40 cursor-pointer hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) handleBackgroundUpload(section.key, file);
                            }}
                            disabled={uploading}
                          />
                          <div className="h-full flex flex-col items-center justify-center">
                            <Upload className="w-10 h-10 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">Upload image</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 1920x600px</p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Layout Selector */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Layout Style
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {LAYOUT_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleLayoutChange(section.key, option.value)}
                            disabled={!bgImage}
                            className={`px-4 py-3 rounded-lg text-left transition-all ${
                              sectionData.layout === option.value
                                ? 'bg-blue-800 text-white'
                                : bgImage
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            <span className="mr-2">{option.icon}</span>
                            {option.label}
                            <p className={`text-xs mt-0.5 ${sectionData.layout === option.value ? 'text-blue-200' : 'text-gray-500'}`}>
                              {option.description}
                            </p>
                          </button>
                        ))}
                      </div>
                      {!bgImage && (
                        <p className="text-xs text-gray-400 mt-2">
                          Upload an image to enable layout options
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {uploading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-700">Uploading image...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeStep;