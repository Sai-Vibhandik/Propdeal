import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Image, Star, MapPin, MessageSquare, HelpCircle, Phone, Globe, Search,
  Plus, Trash2, ChevronUp, ChevronDown, Save, RefreshCw, Loader2, Upload, X, Layout,
  Facebook, Twitter, Instagram, Linkedin, Youtube, FileText, Palette
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { siteContentAPI, mediaAPI, getFileUrl } from '../../services/api.js';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'hero', label: 'Hero Slides', icon: Image },
  { id: 'whyUs', label: 'Why Us', icon: Star },
  { id: 'cities', label: 'Cities', icon: MapPin },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'footer', label: 'Footer', icon: Layout },
  { id: 'legal', label: 'Legal', icon: FileText },
];

const ICON_OPTIONS = [
  'CheckCircle', 'Shield', 'Award', 'Clock', 'Users', 'Building2',
  'Home', 'MapPin', 'Phone', 'Mail', 'Star', 'TrendingUp'
];

// Available pages for link dropdowns
const PAGE_OPTIONS = [
  { value: '/', label: 'Homepage' },
  { value: '/#why-us', label: 'Why Us Section' },
  { value: '/#featured', label: 'Featured Properties' },
  { value: '/#cities', label: 'Popular Cities' },
  { value: '/#latest', label: 'Latest Properties' },
  { value: '/#testimonials', label: 'Testimonials' },
  { value: '/#faq', label: 'FAQ Section' },
  { value: '/#contact', label: 'Contact Section' },
  { value: '/properties', label: 'Properties Listing' },
];

// Social platform options
const SOCIAL_PLATFORMS = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
];

// Secondary CTA type options
const CTA_TYPE_OPTIONS = [
  { value: 'phone', label: 'Phone Call' },
  { value: 'link', label: 'Internal Link' },
];

const SiteContentPage = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});
  const { refetch: refetchSiteContent } = useSiteContent();

  // Hero slides state
  const [heroSlides, setHeroSlides] = useState([]);

  // Why Us state
  const [whyUs, setWhyUs] = useState({
    sectionTitle: '',
    sectionSubtitle: '',
    features: [],
    stats: [],
  });

  // Cities state
  const [cities, setCities] = useState([]);

  // Testimonials state
  const [testimonials, setTestimonials] = useState([]);

  // FAQs state
  const [faqs, setFaqs] = useState([]);

  // Contact state
  const [contact, setContact] = useState({
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    workingHours: '',
  });

  // SEO state
  const [seo, setSeo] = useState({
    siteName: '',
    siteTagline: '',
    metaDescription: '',
    metaKeywords: [],
    ogImage: '',
  });

  // Branding state
  const [branding, setBranding] = useState({
    logo: '',
    logoAlt: '',
    siteName: '',
    showSiteNameWithLogo: true,
    navbarLogoHeight: 40,
    footerLogoHeight: 32,
    sidebarLogoHeight: 40,
  });

  // Footer state
  const [footer, setFooter] = useState({
    description: '',
    copyrightText: '',
    showNewsletter: true,
  });

  // Footer Links state
  const [footerLinks, setFooterLinks] = useState([]);

  // Footer Social Links state
  const [footerSocialLinks, setFooterSocialLinks] = useState([]);

  // Legal Pages state
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsOfService, setTermsOfService] = useState('');

  // New keyword input
  const [newKeyword, setNewKeyword] = useState('');

  // File input refs for image uploads
  const fileInputRefs = useRef({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await siteContentAPI.getAdminContent();
      const data = response.data.data;

      setContent(data);
      setHeroSlides(data.heroSlides || []);
      setWhyUs(data.whyUs || { sectionTitle: '', sectionSubtitle: '', features: [], stats: [] });
      setCities(data.cities || []);
      setTestimonials(data.testimonials || []);
      setFaqs(data.faqs || []);
      setContact(data.contact || {});
      setSeo(data.seo || {});
      setBranding(data.branding || { logo: '', logoAlt: '', siteName: '', showSiteNameWithLogo: true, navbarLogoHeight: 40, footerLogoHeight: 32, sidebarLogoHeight: 40 });
      setFooter(data.footer || { description: '', copyrightText: '', showNewsletter: true });
      setFooterLinks(data.footerLinks || []);
      setFooterSocialLinks(data.footerSocialLinks || []);
      setPrivacyPolicy(data.privacyPolicy || '');
      setTermsOfService(data.termsOfService || '');
    } catch (error) {
      console.error('Error fetching site content:', error);
      toast.error('Failed to load site content');
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (file, uploadKey, onSuccess) => {
    try {
      setUploading(prev => ({ ...prev, [uploadKey]: true }));
      const response = await mediaAPI.uploadImage(file);
      const imageUrl = response.data.data.url; // Fixed: access data.data.url
      onSuccess(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(prev => ({ ...prev, [uploadKey]: false }));
    }
  };

  // Hero Slides Functions
  const addHeroSlide = () => {
    setHeroSlides([
      ...heroSlides,
      {
        image: '',
        title: '',
        subtitle: '',
        location: '',
        properties: '',
        primaryCta: { text: 'Browse Properties', link: '/properties' },
        secondaryCta: { text: 'Call Us', type: 'phone' },
        order: heroSlides.length,
        isActive: true,
      },
    ]);
  };

  const updateHeroSlide = (index, field, value) => {
    const updated = [...heroSlides];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      updated[index] = {
        ...updated[index],
        [parent]: { ...updated[index][parent], [child]: value }
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setHeroSlides(updated);
  };

  const removeHeroSlide = (index) => {
    setHeroSlides(heroSlides.filter((_, i) => i !== index));
  };

  const moveHeroSlide = (index, direction) => {
    const updated = [...heroSlides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updated.length) return;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setHeroSlides(updated);
  };

  // Why Us Functions
  const addFeature = () => {
    setWhyUs({
      ...whyUs,
      features: [...whyUs.features, { icon: 'CheckCircle', title: '', description: '', order: whyUs.features.length }],
    });
  };

  const updateFeature = (index, field, value) => {
    const updated = [...whyUs.features];
    updated[index] = { ...updated[index], [field]: value };
    setWhyUs({ ...whyUs, features: updated });
  };

  const removeFeature = (index) => {
    setWhyUs({ ...whyUs, features: whyUs.features.filter((_, i) => i !== index) });
  };

  const addStat = () => {
    setWhyUs({
      ...whyUs,
      stats: [...whyUs.stats, { value: '', label: '', order: whyUs.stats.length }],
    });
  };

  const updateStat = (index, field, value) => {
    const updated = [...whyUs.stats];
    updated[index] = { ...updated[index], [field]: value };
    setWhyUs({ ...whyUs, stats: updated });
  };

  const removeStat = (index) => {
    setWhyUs({ ...whyUs, stats: whyUs.stats.filter((_, i) => i !== index) });
  };

  // Cities Functions
  const addCity = () => {
    setCities([
      ...cities,
      { name: '', image: '', description: '', order: cities.length, isActive: true },
    ]);
  };

  const updateCity = (index, field, value) => {
    const updated = [...cities];
    updated[index] = { ...updated[index], [field]: value };
    setCities(updated);
  };

  const removeCity = (index) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  // Testimonials Functions
  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      { name: '', location: '', rating: 5, property: '', text: '', order: testimonials.length, isActive: true },
    ]);
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const removeTestimonial = (index) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  // FAQs Functions
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '', order: faqs.length, isActive: true }]);
  };

  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const moveFaq = (index, direction) => {
    const updated = [...faqs];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= updated.length) return;
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setFaqs(updated);
  };

  // Save handlers
  const saveHeroSlides = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateHeroSlides(heroSlides);
      toast.success('Hero slides saved successfully');
    } catch (error) {
      console.error('Error saving hero slides:', error);
      toast.error('Failed to save hero slides');
    } finally {
      setSaving(false);
    }
  };

  const saveWhyUs = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateWhyUs(whyUs);
      toast.success('Why Us section saved successfully');
    } catch (error) {
      console.error('Error saving why us:', error);
      toast.error('Failed to save Why Us section');
    } finally {
      setSaving(false);
    }
  };

  const saveCities = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateCities(cities);
      toast.success('Cities saved successfully');
    } catch (error) {
      console.error('Error saving cities:', error);
      toast.error('Failed to save cities');
    } finally {
      setSaving(false);
    }
  };

  const saveTestimonials = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateTestimonials(testimonials);
      toast.success('Testimonials saved successfully');
    } catch (error) {
      console.error('Error saving testimonials:', error);
      toast.error('Failed to save testimonials');
    } finally {
      setSaving(false);
    }
  };

  const saveFaqs = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateFAQs(faqs);
      toast.success('FAQs saved successfully');
    } catch (error) {
      console.error('Error saving FAQs:', error);
      toast.error('Failed to save FAQs');
    } finally {
      setSaving(false);
    }
  };

  const saveContact = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateContact(contact);
      toast.success('Contact info saved successfully');
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact info');
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateSEO(seo);
      toast.success('SEO settings saved successfully');
    } catch (error) {
      console.error('Error saving SEO:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const saveBranding = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateBranding(branding);
      // Refresh the global site content context so navbar, footer, and sidebar update
      await refetchSiteContent();
      toast.success('Branding settings saved successfully');
    } catch (error) {
      console.error('Error saving branding:', error);
      toast.error('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateFooter(footer);
      toast.success('Footer settings saved successfully');
    } catch (error) {
      console.error('Error saving footer:', error);
      toast.error('Failed to save footer settings');
    } finally {
      setSaving(false);
    }
  };

  // Footer Links Functions
  const addFooterLink = () => {
    setFooterLinks([
      ...footerLinks,
      { label: '', url: '/', order: footerLinks.length, isActive: true },
    ]);
  };

  const updateFooterLink = (index, field, value) => {
    const updated = [...footerLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFooterLinks(updated);
  };

  const removeFooterLink = (index) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
  };

  const saveFooterLinks = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateFooterLinks(footerLinks);
      toast.success('Footer links saved successfully');
    } catch (error) {
      console.error('Error saving footer links:', error);
      toast.error('Failed to save footer links');
    } finally {
      setSaving(false);
    }
  };

  // Footer Social Links Functions
  const addFooterSocialLink = () => {
    setFooterSocialLinks([
      ...footerSocialLinks,
      { platform: 'facebook', url: '', isActive: true },
    ]);
  };

  const updateFooterSocialLink = (index, field, value) => {
    const updated = [...footerSocialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFooterSocialLinks(updated);
  };

  const removeFooterSocialLink = (index) => {
    setFooterSocialLinks(footerSocialLinks.filter((_, i) => i !== index));
  };

  const saveFooterSocialLinks = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateFooterSocialLinks(footerSocialLinks);
      toast.success('Footer social links saved successfully');
    } catch (error) {
      console.error('Error saving footer social links:', error);
      toast.error('Failed to save footer social links');
    } finally {
      setSaving(false);
    }
  };

  // Legal Pages Functions
  const savePrivacyPolicy = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updatePrivacyPolicy(privacyPolicy);
      toast.success('Privacy Policy saved successfully');
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      toast.error('Failed to save privacy policy');
    } finally {
      setSaving(false);
    }
  };

  const saveTermsOfService = async () => {
    try {
      setSaving(true);
      await siteContentAPI.updateTermsOfService(termsOfService);
      toast.success('Terms of Service saved successfully');
    } catch (error) {
      console.error('Error saving terms of service:', error);
      toast.error('Failed to save terms of service');
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setSeo({ ...seo, metaKeywords: [...(seo.metaKeywords || []), newKeyword.trim()] });
      setNewKeyword('');
    }
  };

  const removeKeyword = (index) => {
    setSeo({ ...seo, metaKeywords: seo.metaKeywords.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-800" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
            <p className="text-gray-500">Manage your website's dynamic content</p>
          </div>
          <button
            onClick={fetchContent}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile: Horizontal scrollable tabs */}
            <div className="lg:hidden bg-white rounded-xl shadow-sm overflow-x-auto">
              <div className="flex">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-800'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Desktop: Vertical tabs */}
            <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden sticky top-4">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Hero Slides Tab */}
              {activeTab === 'hero' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Hero Carousel Slides</h2>
                    <button
                      onClick={addHeroSlide}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slide
                    </button>
                  </div>

                  {heroSlides.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No hero slides yet. Click "Add Slide" to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {heroSlides.map((slide, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Slide {index + 1}</h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveHeroSlide(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveHeroSlide(index, 'down')}
                                disabled={index === heroSlides.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeHeroSlide(index)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Image Upload */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={slide.image}
                                  onChange={(e) => updateHeroSlide(index, 'image', e.target.value)}
                                  placeholder="https://example.com/image.jpg"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>
                              <div className="flex-shrink-0">
                                <input
                                  type="file"
                                  ref={el => fileInputRefs.current[`hero-${index}`] = el}
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      handleImageUpload(file, `hero-${index}`, (url) => {
                                        updateHeroSlide(index, 'image', url);
                                      });
                                    }
                                  }}
                                  className="hidden"
                                />
                                <button
                                  onClick={() => fileInputRefs.current[`hero-${index}`]?.click()}
                                  disabled={uploading[`hero-${index}`]}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                  {uploading[`hero-${index}`] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Upload className="w-4 h-4" />
                                  )}
                                  Upload
                                </button>
                              </div>
                            </div>
                            {slide.image && (
                              <div className="mt-2">
                                <img
                                  src={getFileUrl(slide.image)}
                                  alt="Preview"
                                  className="h-32 w-64 object-cover rounded-lg border"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" viewBox="0 0 200 100"><rect fill="%23f3f4f6" width="200" height="100"/><text fill="%239ca3af" font-family="sans-serif" font-size="12" x="50%" y="50%" text-anchor="middle" dy=".3em">Image Preview</text></svg>';
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => updateHeroSlide(index, 'title', e.target.value)}
                                placeholder="Find Your Perfect Home"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                              <input
                                type="text"
                                value={slide.subtitle}
                                onChange={(e) => updateHeroSlide(index, 'subtitle', e.target.value)}
                                placeholder="Premium Properties in Prime Locations"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location Badge</label>
                              <input
                                type="text"
                                value={slide.location}
                                onChange={(e) => updateHeroSlide(index, 'location', e.target.value)}
                                placeholder="Bangalore"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Properties Count</label>
                              <input
                                type="text"
                                value={slide.properties}
                                onChange={(e) => updateHeroSlide(index, 'properties', e.target.value)}
                                placeholder="234+ Properties"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>

                          {/* CTA Buttons */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-3">Call-to-Action Buttons</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Primary CTA */}
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <label className="block text-sm font-medium text-blue-800 mb-2">Primary Button</label>
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={slide.primaryCta?.text || ''}
                                    onChange={(e) => updateHeroSlide(index, 'primaryCta.text', e.target.value)}
                                    placeholder="Browse Properties"
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <select
                                    value={slide.primaryCta?.link || '/properties'}
                                    onChange={(e) => updateHeroSlide(index, 'primaryCta.link', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                  >
                                    {PAGE_OPTIONS.map((page) => (
                                      <option key={page.value} value={page.value}>
                                        {page.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              {/* Secondary CTA */}
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button</label>
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={slide.secondaryCta?.text || ''}
                                    onChange={(e) => updateHeroSlide(index, 'secondaryCta.text', e.target.value)}
                                    placeholder="Call Us"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <select
                                    value={slide.secondaryCta?.type || 'phone'}
                                    onChange={(e) => updateHeroSlide(index, 'secondaryCta.type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                  >
                                    {CTA_TYPE_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  {slide.secondaryCta?.type === 'phone' ? (
                                    <p className="text-sm text-gray-500 italic">
                                      Uses global contact phone from Contact Settings
                                    </p>
                                  ) : (
                                    <select
                                      value={slide.secondaryCta?.link || '/'}
                                      onChange={(e) => updateHeroSlide(index, 'secondaryCta.link', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                      {PAGE_OPTIONS.map((page) => (
                                        <option key={page.value} value={page.value}>
                                          {page.label}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Active Toggle */}
                          <div className="mt-4 flex items-center">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={slide.isActive}
                                onChange={(e) => updateHeroSlide(index, 'isActive', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Active</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveHeroSlides}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Hero Slides'}
                    </button>
                  </div>
                </div>
              )}

              {/* Why Us Tab */}
              {activeTab === 'whyUs' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Why Choose Us Section</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                      <input
                        type="text"
                        value={whyUs.sectionTitle}
                        onChange={(e) => setWhyUs({ ...whyUs, sectionTitle: e.target.value })}
                        placeholder="Your Trusted Property Partner"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        value={whyUs.sectionSubtitle}
                        onChange={(e) => setWhyUs({ ...whyUs, sectionSubtitle: e.target.value })}
                        placeholder="We combine technology with expertise..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Features</h3>
                      <button
                        onClick={addFeature}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-3">
                      {whyUs.features.map((feature, index) => (
                        <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {ICON_OPTIONS.map((icon) => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => updateFeature(index, 'title', e.target.value)}
                            placeholder="Title"
                            className="flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={feature.description}
                            onChange={(e) => updateFeature(index, 'description', e.target.value)}
                            placeholder="Description"
                            className="flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => removeFeature(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Stats</h3>
                      <button
                        onClick={addStat}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Stat
                      </button>
                    </div>
                    <div className="space-y-3">
                      {whyUs.stats.map((stat, index) => (
                        <div key={index} className="flex gap-3 items-center p-3 bg-gray-50 rounded-lg">
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => updateStat(index, 'value', e.target.value)}
                            placeholder="98%"
                            className="w-24 px-3 py-1 border border-gray-300 rounded"
                          />
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => updateStat(index, 'label', e.target.value)}
                            placeholder="Customer Satisfaction"
                            className="flex-1 px-3 py-1 border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => removeStat(index)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveWhyUs}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Why Us Section'}
                    </button>
                  </div>
                </div>
              )}

              {/* Cities Tab */}
              {activeTab === 'cities' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Popular Cities</h2>
                    <button
                      onClick={addCity}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add City
                    </button>
                  </div>

                  {cities.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No cities yet. Click "Add City" to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cities.map((city, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">{city.name || 'New City'}</h3>
                            <button
                              onClick={() => removeCity(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                              <input
                                type="text"
                                value={city.name}
                                onChange={(e) => updateCity(index, 'name', e.target.value)}
                                placeholder="Bangalore"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={city.image || ''}
                                  onChange={(e) => updateCity(index, 'image', e.target.value)}
                                  placeholder="https://example.com/city.jpg"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  ref={el => fileInputRefs.current[`city-${index}`] = el}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      handleImageUpload(file, `city-${index}`, (url) => {
                                        updateCity(index, 'image', url);
                                      });
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => fileInputRefs.current[`city-${index}`]?.click()}
                                  disabled={uploading[`city-${index}`]}
                                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                                >
                                  {uploading[`city-${index}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                              <input
                                type="text"
                                value={city.description || ''}
                                onChange={(e) => updateCity(index, 'description', e.target.value)}
                                placeholder="Premium properties in Bangalore"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={city.isActive}
                                  onChange={(e) => updateCity(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                          {city.image && (
                            <div className="mt-3">
                              <img
                                src={getFileUrl(city.image)}
                                alt={city.name}
                                className="w-32 h-20 object-cover rounded-lg"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveCities}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Cities'}
                    </button>
                  </div>
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Customer Testimonials</h2>
                    <button
                      onClick={addTestimonial}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Testimonial
                    </button>
                  </div>

                  {testimonials.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No testimonials yet. Click "Add Testimonial" to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testimonials.map((testimonial, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">{testimonial.name || 'New Testimonial'}</h3>
                            <button
                              onClick={() => removeTestimonial(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                              <input
                                type="text"
                                value={testimonial.location}
                                onChange={(e) => updateTestimonial(index, 'location', e.target.value)}
                                placeholder="Bangalore"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={testimonial.rating}
                                onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value) || 5)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                              <input
                                type="text"
                                value={testimonial.property}
                                onChange={(e) => updateTestimonial(index, 'property', e.target.value)}
                                placeholder="Prestige Lakeside"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={testimonial.isActive}
                                  onChange={(e) => updateTestimonial(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Text</label>
                            <textarea
                              value={testimonial.text}
                              onChange={(e) => updateTestimonial(index, 'text', e.target.value)}
                              rows={3}
                              placeholder="Share their experience..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveTestimonials}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Testimonials'}
                    </button>
                  </div>
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
                    <button
                      onClick={addFaq}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add FAQ
                    </button>
                  </div>

                  {faqs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No FAQs yet. Click "Add FAQ" to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveFaq(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveFaq(index, 'down')}
                                disabled={index === faqs.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeFaq(index)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaq(index, 'question', e.target.value)}
                                placeholder="How do I schedule a property visit?"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                                rows={3}
                                placeholder="You can schedule a property visit by..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={faq.isActive}
                                  onChange={(e) => updateFaq(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveFaqs}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save FAQs'}
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="info@propertyhub.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={contact.address}
                        onChange={(e) => setContact({ ...contact, address: e.target.value })}
                        placeholder="123 Real Estate Tower, MG Road"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        value={contact.city}
                        onChange={(e) => setContact({ ...contact, city: e.target.value })}
                        placeholder="Bangalore"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={contact.state}
                        onChange={(e) => setContact({ ...contact, state: e.target.value })}
                        placeholder="Karnataka"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={contact.pincode}
                        onChange={(e) => setContact({ ...contact, pincode: e.target.value })}
                        placeholder="560001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                      <input
                        type="text"
                        value={contact.workingHours}
                        onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
                        placeholder="Mon - Sat, 9:00 AM - 7:00 PM"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveContact}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Contact Info'}
                    </button>
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">SEO Settings</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                      <input
                        type="text"
                        value={seo.siteName}
                        onChange={(e) => setSeo({ ...seo, siteName: e.target.value })}
                        placeholder="PropertyHub"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site Tagline</label>
                      <input
                        type="text"
                        value={seo.siteTagline}
                        onChange={(e) => setSeo({ ...seo, siteTagline: e.target.value })}
                        placeholder="Find Your Perfect Home"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={seo.metaDescription}
                        onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                        rows={2}
                        placeholder="Find your dream property with verified listings..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keywords</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(seo.metaKeywords || []).map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {keyword}
                            <button
                              onClick={() => removeKeyword(index)}
                              className="hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                          placeholder="Add keyword..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          onClick={addKeyword}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">OG Image URL</label>
                      <input
                        type="text"
                        value={seo.ogImage}
                        onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })}
                        placeholder="https://example.com/og-image.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveSeo}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save SEO Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Branding Tab */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Branding Settings</h2>
                  <p className="text-sm text-gray-500">Upload your logo and customize how it appears across the site.</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Logo Upload */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        <p className="text-xs text-gray-500 mb-2">
                          Recommended: PNG or SVG with transparent background
                        </p>

                        {/* Logo Preview */}
                        {branding.logo && (
                          <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg space-y-3">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Navbar Preview:</p>
                              <div className="h-14 flex items-center bg-gray-50 rounded px-3 gap-2">
                                <img
                                  src={getFileUrl(branding.logo)}
                                  alt={branding.logoAlt || 'Logo'}
                                  style={{ maxHeight: branding.navbarLogoHeight || 40 }}
                                  className="object-contain"
                                />
                                {branding.showSiteNameWithLogo !== false && (
                                  <span className="font-bold text-gray-900">
                                    {branding.siteName || content?.seo?.siteName || 'PropertyHub'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Footer Preview:</p>
                              <div className="h-12 flex items-center bg-gray-800 rounded px-3 gap-2">
                                <img
                                  src={getFileUrl(branding.logo)}
                                  alt={branding.logoAlt || 'Logo'}
                                  style={{ maxHeight: branding.footerLogoHeight || 32 }}
                                  className="object-contain"
                                />
                                {branding.showSiteNameWithLogo !== false && (
                                  <span className="font-bold text-white">
                                    {branding.siteName || content?.seo?.siteName || 'PropertyHub'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Sidebar Preview:</p>
                              <div className="h-14 flex items-center bg-gray-100 rounded px-3 gap-2">
                                <img
                                  src={getFileUrl(branding.logo)}
                                  alt={branding.logoAlt || 'Logo'}
                                  style={{ maxHeight: branding.sidebarLogoHeight || 40 }}
                                  className="object-contain"
                                />
                                {branding.showSiteNameWithLogo !== false && (
                                  <span className="font-bold text-gray-900">
                                    {branding.siteName || content?.seo?.siteName || 'PropertyHub'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* URL Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={branding.logo}
                            onChange={(e) => setBranding({ ...branding, logo: e.target.value })}
                            placeholder="https://example.com/logo.png"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                          <label className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  try {
                                    setUploading({ ...uploading, logo: true });
                                    const response = await mediaAPI.uploadImage(file);
                                    setBranding({ ...branding, logo: response.data.data.url });
                                    toast.success('Logo uploaded successfully');
                                    // Reset file input
                                    e.target.value = '';
                                  } catch (error) {
                                    console.error('Error uploading logo:', error);
                                    toast.error('Failed to upload logo');
                                  } finally {
                                    setUploading({ ...uploading, logo: false });
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                        {uploading.logo && (
                          <p className="text-xs text-blue-600 mt-1">Uploading...</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo Alt Text</label>
                        <input
                          type="text"
                          value={branding.logoAlt}
                          onChange={(e) => setBranding({ ...branding, logoAlt: e.target.value })}
                          placeholder="Company Logo"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Alternative text for accessibility</p>
                      </div>

                      {/* Site Name Settings */}
                      <div className="pt-4 border-t">
                        <h3 className="font-medium text-gray-900 mb-3">Site Name Display</h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Site Name <span className="text-gray-400 text-xs">(optional override)</span>
                            </label>
                            <input
                              type="text"
                              value={branding.siteName || ''}
                              onChange={(e) => setBranding({ ...branding, siteName: e.target.value })}
                              placeholder={content?.seo?.siteName || 'PropertyHub'}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to use the default site name from SEO settings</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="showSiteNameWithLogo"
                              checked={branding.showSiteNameWithLogo !== false}
                              onChange={(e) => setBranding({ ...branding, showSiteNameWithLogo: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="showSiteNameWithLogo" className="text-sm text-gray-700">
                              Show site name alongside logo
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Logo Size Controls */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Logo Sizes</h3>
                      <p className="text-sm text-gray-500 mb-2">Adjust the logo height (in pixels) for each location.</p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Navbar Logo Height: <span className="text-blue-600">{branding.navbarLogoHeight || 40}px</span>
                          </label>
                          <input
                            type="range"
                            min="20"
                            max="80"
                            value={branding.navbarLogoHeight || 40}
                            onChange={(e) => setBranding({ ...branding, navbarLogoHeight: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>20px</span>
                            <span>80px</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Footer Logo Height: <span className="text-blue-600">{branding.footerLogoHeight || 32}px</span>
                          </label>
                          <input
                            type="range"
                            min="16"
                            max="60"
                            value={branding.footerLogoHeight || 32}
                            onChange={(e) => setBranding({ ...branding, footerLogoHeight: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>16px</span>
                            <span>60px</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sidebar Logo Height: <span className="text-blue-600">{branding.sidebarLogoHeight || 40}px</span>
                          </label>
                          <input
                            type="range"
                            min="20"
                            max="80"
                            value={branding.sidebarLogoHeight || 40}
                            onChange={(e) => setBranding({ ...branding, sidebarLogoHeight: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>20px</span>
                            <span>80px</span>
                          </div>
                        </div>
                      </div>

                      {/* Info Panel */}
                      <div className="bg-blue-50 rounded-lg p-4 mt-4">
                        <h4 className="font-medium text-blue-900 mb-2">Tips</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Upload a logo and enable "Show site name"</li>
                          <li>• Site name can be customized above</li>
                          <li>• Use sliders to adjust logo sizes</li>
                          <li>• Preview updates in real-time</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveBranding}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Branding Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Tab */}
              {activeTab === 'footer' && (
                <div className="space-y-8">
                  {/* Basic Settings */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Footer Settings</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
                        <textarea
                          value={footer.description}
                          onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                          rows={2}
                          placeholder="Discover your dream property with our platform..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Short description shown below the logo</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                        <input
                          type="text"
                          value={footer.copyrightText}
                          onChange={(e) => setFooter({ ...footer, copyrightText: e.target.value })}
                          placeholder="© 2024 PropertyHub. All rights reserved."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={footer.showNewsletter}
                            onChange={(e) => setFooter({ ...footer, showNewsletter: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Show Newsletter Signup</span>
                        </label>
                        <p className="text-xs text-gray-500 ml-6">Display newsletter subscription form in footer</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={saveFooter}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Basic Settings
                      </button>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Quick Links Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
                      <button
                        onClick={addFooterLink}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Add links to your main pages (shown in footer's Quick Links column)</p>

                    {footerLinks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        No quick links added yet
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {footerLinks.map((link, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(e) => updateFooterLink(index, 'label', e.target.value)}
                                  placeholder="Home"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Page</label>
                                <select
                                  value={link.url}
                                  onChange={(e) => updateFooterLink(index, 'url', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                  {PAGE_OPTIONS.map((page) => (
                                    <option key={page.value} value={page.value}>{page.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-2 flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={link.isActive}
                                    onChange={(e) => updateFooterLink(index, 'isActive', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Active</span>
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFooterLink(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {footerLinks.length > 0 && (
                      <button
                        onClick={saveFooterLinks}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Quick Links
                      </button>
                    )}
                  </div>

                  <hr className="border-gray-200" />

                  {/* Social Links Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
                      <button
                        onClick={addFooterSocialLink}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Add Social
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Add social media links (shown in footer with platform icons)</p>

                    {footerSocialLinks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        No social links added yet
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {footerSocialLinks.map((social, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Platform</label>
                                <select
                                  value={social.platform}
                                  onChange={(e) => updateFooterSocialLink(index, 'platform', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                  {SOCIAL_PLATFORMS.map((platform) => {
                                    const Icon = platform.icon;
                                    return (
                                      <option key={platform.value} value={platform.value}>
                                        {platform.label}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">URL</label>
                                <input
                                  type="url"
                                  value={social.url}
                                  onChange={(e) => updateFooterSocialLink(index, 'url', e.target.value)}
                                  placeholder="https://facebook.com/yourpage"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                />
                              </div>
                              <div className="col-span-2 flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={social.isActive}
                                    onChange={(e) => updateFooterSocialLink(index, 'isActive', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Active</span>
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFooterSocialLink(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {footerSocialLinks.length > 0 && (
                      <button
                        onClick={saveFooterSocialLinks}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Social Links
                      </button>
                    )}
                  </div>

                  <hr className="border-gray-200" />

                  {/* Contact Info Note */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Contact information (address, phone, email, working hours) is managed in the <strong>Contact</strong> tab and will automatically appear in the footer.
                    </p>
                  </div>
                </div>
              )}

              {/* Legal Tab */}
              {activeTab === 'legal' && (
                <div className="space-y-8">
                  {/* Privacy Policy */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Privacy Policy</h2>
                    <p className="text-sm text-gray-500">This content will appear on the Privacy Policy page.</p>
                    <textarea
                      value={privacyPolicy}
                      onChange={(e) => setPrivacyPolicy(e.target.value)}
                      rows={10}
                      placeholder="Enter your privacy policy content here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                    <div className="pt-2">
                      <button
                        onClick={savePrivacyPolicy}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Privacy Policy
                      </button>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Terms of Service */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900">Terms of Service</h2>
                    <p className="text-sm text-gray-500">This content will appear on the Terms of Service page.</p>
                    <textarea
                      value={termsOfService}
                      onChange={(e) => setTermsOfService(e.target.value)}
                      rows={10}
                      placeholder="Enter your terms of service content here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    />
                    <div className="pt-2">
                      <button
                        onClick={saveTermsOfService}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Terms of Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SiteContentPage;