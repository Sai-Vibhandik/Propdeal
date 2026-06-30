import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Image, Star, MapPin, MessageSquare, HelpCircle, Phone, Globe, Search,
  Plus, Trash2, ChevronUp, ChevronDown, Save, RefreshCw, Loader2, Upload, X, Layout,
  Facebook, Twitter, Instagram, Linkedin, Youtube, FileText, Palette, Building2
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import { siteContentAPI, mediaAPI, propertiesAPI, getFileUrl } from '../../services/api.js';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'hero', label: 'Hero Slides', icon: Image },
  { id: 'whyUs', label: 'Why Us', icon: Star },
  { id: 'cities', label: 'Cities', icon: MapPin },
  { id: 'builders', label: 'Builders', icon: Building2 },
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
  { value: '/discover', label: 'Hero Section' },
  { value: '/discover#why-us', label: 'Why Us Section' },
  { value: '/discover#featured', label: 'Featured Properties' },
  { value: '/discover#cities', label: 'Popular Cities' },
  { value: '/discover#latest', label: 'Latest Properties' },
  { value: '/discover#testimonials', label: 'Testimonials' },
  { value: '/discover#faq', label: 'FAQ Section' },
  { value: '/discover#contact', label: 'Contact Section' },
  { value: '/properties', label: 'Properties Listing' },
  { value: '/', label: 'Developers Page' },
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
  const [heroSlideErrors, setHeroSlideErrors] = useState({});
  const [whyUsErrors, setWhyUsErrors] = useState({});
  const [citiesErrors, setCitiesErrors] = useState({});
  const [buildersErrors, setBuildersErrors] = useState({});
  const [testimonialsErrors, setTestimonialsErrors] = useState({});
  const [faqsErrors, setFaqsErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});
  const [seoErrors, setSeoErrors] = useState({});
  const [footerErrors, setFooterErrors] = useState({});
  const [footerLinksErrors, setFooterLinksErrors] = useState({});
  const [footerSocialLinksErrors, setFooterSocialLinksErrors] = useState({});
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

  // Featured Builders state
  const [featuredBuilders, setFeaturedBuilders] = useState([]);
  const [allBuilders, setAllBuilders] = useState([]);
  const [loadingBuilders, setLoadingBuilders] = useState(false);

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
      setFeaturedBuilders(data.featuredBuilders || []);
      setTestimonials(data.testimonials || []);
      setFaqs(data.faqs || []);
      setContact(data.contact || {});
      setSeo(data.seo || {});
      setBranding(data.branding || { logo: '', logoAlt: '', siteName: '', showSiteNameWithLogo: true, navbarLogoHeight: 40, footerLogoHeight: 32, sidebarLogoHeight: 40 });
      setFooter(data.footer || { description: '', copyrightText: '' });
      setFooterLinks(data.footerLinks || []);
      setFooterSocialLinks(data.footerSocialLinks || []);
      setPrivacyPolicy(data.privacyPolicy || '');
      setTermsOfService(data.termsOfService || '');

      // Fetch all available builders from properties
      fetchAllBuilders();
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

  // Fetch all builders from properties
  const fetchAllBuilders = async () => {
    try {
      setLoadingBuilders(true);
      const response = await propertiesAPI.getBuilders();
      setAllBuilders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching builders:', error);
    } finally {
      setLoadingBuilders(false);
    }
  };

  // Add builder to featured list
  const addFeaturedBuilder = (builderName) => {
    if (featuredBuilders.length >= 10) {
      toast.error('Maximum 10 builders allowed');
      return;
    }
    if (featuredBuilders.some(b => b.name === builderName)) {
      toast.error('Builder already added');
      return;
    }
    setFeaturedBuilders([...featuredBuilders, { name: builderName, logo: '', order: featuredBuilders.length }]);
    toast.success('Builder added');
  };

  // Remove builder from featured list
  const removeFeaturedBuilder = (index) => {
    setFeaturedBuilders(featuredBuilders.filter((_, i) => i !== index));
    toast.success('Builder removed');
  };

  // Move builder up/down in order
  const moveBuilderOrder = (index, direction) => {
    const newBuilders = [...featuredBuilders];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newBuilders.length) return;
    [newBuilders[index], newBuilders[newIndex]] = [newBuilders[newIndex], newBuilders[index]];
    setFeaturedBuilders(newBuilders);
  };

  // Update builder logo
  const updateBuilderLogo = (index, logoUrl) => {
    const newBuilders = [...featuredBuilders];
    newBuilders[index] = { ...newBuilders[index], logo: logoUrl };
    setFeaturedBuilders(newBuilders);
  };

  // Handle builder logo upload
  const handleBuilderLogoUpload = async (file, index) => {
    try {
      setUploading(prev => ({ ...prev, [`builder-${index}`]: true }));
      const response = await mediaAPI.uploadImage(file);
      const logoUrl = response.data.data.url;
      updateBuilderLogo(index, logoUrl);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(prev => ({ ...prev, [`builder-${index}`]: false }));
    }
  };

  // Save featured builders
  const saveFeaturedBuilders = async () => {
    // Clear previous errors
    setBuildersErrors({});

    // Validate builders - logo is required for each builder
    const errors = {};
    featuredBuilders.forEach((builder, index) => {
      if (!builder.logo) {
        errors[index] = { logo: 'Logo is required' };
      }
    });

    if (Object.keys(errors).length > 0) {
      setBuildersErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateFeaturedBuilders(featuredBuilders);
      toast.success('Featured builders saved successfully');
      refetchSiteContent();
      setBuildersErrors({});
    } catch (error) {
      console.error('Error saving featured builders:', error);
      let message = error.response?.data?.message || 'Failed to save featured builders';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
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
    toast.success('New slide added');
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
    toast.success('Slide removed');
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
    toast.success('Feature added');
  };

  const updateFeature = (index, field, value) => {
    const updated = [...whyUs.features];
    updated[index] = { ...updated[index], [field]: value };
    setWhyUs({ ...whyUs, features: updated });
  };

  const removeFeature = (index) => {
    setWhyUs({ ...whyUs, features: whyUs.features.filter((_, i) => i !== index) });
    toast.success('Feature removed');
  };

  const addStat = () => {
    setWhyUs({
      ...whyUs,
      stats: [...whyUs.stats, { value: '', label: '', order: whyUs.stats.length }],
    });
    toast.success('Stat added');
  };

  const updateStat = (index, field, value) => {
    const updated = [...whyUs.stats];
    updated[index] = { ...updated[index], [field]: value };
    setWhyUs({ ...whyUs, stats: updated });
  };

  const removeStat = (index) => {
    setWhyUs({ ...whyUs, stats: whyUs.stats.filter((_, i) => i !== index) });
    toast.success('Stat removed');
  };

  // Cities Functions
  const addCity = () => {
    setCities([
      ...cities,
      { name: '', image: '', description: '', order: cities.length, isActive: true },
    ]);
    toast.success('City added');
  };

  const updateCity = (index, field, value) => {
    const updated = [...cities];
    updated[index] = { ...updated[index], [field]: value };
    setCities(updated);
  };

  const removeCity = (index) => {
    setCities(cities.filter((_, i) => i !== index));
    toast.success('City removed');
  };

  // Testimonials Functions
  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      { name: '', location: '', rating: 5, property: '', text: '', order: testimonials.length, isActive: true },
    ]);
    toast.success('Testimonial added');
  };

  const updateTestimonial = (index, field, value) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setTestimonials(updated);
  };

  const removeTestimonial = (index) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
    toast.success('Testimonial removed');
  };

  // FAQs Functions
  const addFaq = () => {
    setFaqs([...faqs, { question: '', answer: '', order: faqs.length, isActive: true }]);
    toast.success('FAQ added');
  };

  const updateFaq = (index, field, value) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    toast.success('FAQ removed');
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
    // Clear previous errors
    setHeroSlideErrors({});

    // Validate slides
    const errors = {};
    for (let i = 0; i < heroSlides.length; i++) {
      const slide = heroSlides[i];
      const slideErrors = {};
      if (!slide.image) {
        slideErrors.image = 'Hero image is required';
      }
      if (!slide.title?.trim()) {
        slideErrors.title = 'Title is required';
      }
      if (!slide.subtitle?.trim()) {
        slideErrors.subtitle = 'Subtitle is required';
      }
      if (Object.keys(slideErrors).length > 0) {
        errors[i] = slideErrors;
      }
    }

    if (Object.keys(errors).length > 0) {
      setHeroSlideErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateHeroSlides(heroSlides);
      toast.success('Hero slides saved successfully');
      setHeroSlideErrors({});
    } catch (error) {
      console.error('Error saving hero slides:', error);
      let message = error.response?.data?.message || 'Failed to save hero slides';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveWhyUs = async () => {
    // Clear previous errors
    setWhyUsErrors({});

    // Validate section title
    const errors = {};
    if (!whyUs.sectionTitle?.trim()) {
      errors.sectionTitle = 'Section title is required';
    }

    // Validate features
    const featureErrors = {};
    whyUs.features.forEach((feature, index) => {
      const fe = {};
      if (!feature.title?.trim()) {
        fe.title = 'Title is required';
      }
      if (!feature.description?.trim()) {
        fe.description = 'Description is required';
      }
      if (Object.keys(fe).length > 0) {
        featureErrors[index] = fe;
      }
    });
    if (Object.keys(featureErrors).length > 0) {
      errors.features = featureErrors;
    }

    // Validate stats
    const statErrors = {};
    whyUs.stats.forEach((stat, index) => {
      const se = {};
      if (!stat.value?.trim()) {
        se.value = 'Value is required';
      }
      if (!stat.label?.trim()) {
        se.label = 'Label is required';
      }
      if (Object.keys(se).length > 0) {
        statErrors[index] = se;
      }
    });
    if (Object.keys(statErrors).length > 0) {
      errors.stats = statErrors;
    }

    if (Object.keys(errors).length > 0) {
      setWhyUsErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateWhyUs(whyUs);
      toast.success('Why Us section saved successfully');
      setWhyUsErrors({});
    } catch (error) {
      console.error('Error saving why us:', error);
      let message = error.response?.data?.message || 'Failed to save Why Us section';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveCities = async () => {
    // Clear previous errors
    setCitiesErrors({});

    // Validate cities
    const errors = {};
    cities.forEach((city, index) => {
      const cityErrors = {};
      if (!city.name?.trim()) {
        cityErrors.name = 'City name is required';
      }
      if (!city.image) {
        cityErrors.image = 'City image is required';
      }
      if (Object.keys(cityErrors).length > 0) {
        errors[index] = cityErrors;
      }
    });

    if (Object.keys(errors).length > 0) {
      setCitiesErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateCities(cities);
      toast.success('Cities saved successfully');
      setCitiesErrors({});
    } catch (error) {
      console.error('Error saving cities:', error);
      let message = error.response?.data?.message || 'Failed to save cities';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveTestimonials = async () => {
    // Clear previous errors
    setTestimonialsErrors({});

    // Validate testimonials
    const errors = {};
    testimonials.forEach((testimonial, index) => {
      const tErrors = {};
      if (!testimonial.name?.trim()) {
        tErrors.name = 'Name is required';
      }
      if (!testimonial.location?.trim()) {
        tErrors.location = 'Location is required';
      }
      if (!testimonial.text?.trim()) {
        tErrors.text = 'Testimonial text is required';
      }
      if (Object.keys(tErrors).length > 0) {
        errors[index] = tErrors;
      }
    });

    if (Object.keys(errors).length > 0) {
      setTestimonialsErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateTestimonials(testimonials);
      toast.success('Testimonials saved successfully');
      setTestimonialsErrors({});
    } catch (error) {
      console.error('Error saving testimonials:', error);
      let message = error.response?.data?.message || 'Failed to save testimonials';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveFaqs = async () => {
    // Clear previous errors
    setFaqsErrors({});

    // Validate FAQs
    const errors = {};
    faqs.forEach((faq, index) => {
      const fErrors = {};
      if (!faq.question?.trim()) {
        fErrors.question = 'Question is required';
      }
      if (!faq.answer?.trim()) {
        fErrors.answer = 'Answer is required';
      }
      if (Object.keys(fErrors).length > 0) {
        errors[index] = fErrors;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFaqsErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateFAQs(faqs);
      toast.success('FAQs saved successfully');
      setFaqsErrors({});
    } catch (error) {
      console.error('Error saving FAQs:', error);
      let message = error.response?.data?.message || 'Failed to save FAQs';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveContact = async () => {
    // Clear previous errors
    setContactErrors({});

    // Validate contact
    const errors = {};
    if (!contact.phone?.trim()) {
      errors.phone = 'Phone number is required';
    }
    if (!contact.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!contact.address?.trim()) {
      errors.address = 'Address is required';
    }
    if (!contact.city?.trim()) {
      errors.city = 'City is required';
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateContact(contact);
      toast.success('Contact info saved successfully');
      setContactErrors({});
    } catch (error) {
      console.error('Error saving contact:', error);
      let message = error.response?.data?.message || 'Failed to save contact info';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveSeo = async () => {
    // Clear previous errors
    setSeoErrors({});

    // Validate SEO
    const errors = {};
    if (!seo.siteName?.trim()) {
      errors.siteName = 'Site name is required';
    }

    if (Object.keys(errors).length > 0) {
      setSeoErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateSEO(seo);
      toast.success('SEO settings saved successfully');
      setSeoErrors({});
    } catch (error) {
      console.error('Error saving SEO:', error);
      let message = error.response?.data?.message || 'Failed to save SEO settings';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
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
      let message = error.response?.data?.message || 'Failed to save branding settings';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const saveFooter = async () => {
    // Clear previous errors
    setFooterErrors({});

    // Validate Footer
    const errors = {};
    if (!footer.description?.trim()) {
      errors.description = 'Footer description is required';
    }
    if (!footer.copyrightText?.trim()) {
      errors.copyrightText = 'Copyright text is required';
    }

    if (Object.keys(errors).length > 0) {
      setFooterErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateFooter(footer);
      toast.success('Footer settings saved successfully');
      setFooterErrors({});
    } catch (error) {
      console.error('Error saving footer:', error);
      let message = error.response?.data?.message || 'Failed to save footer settings';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
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
    toast.success('Link added');
  };

  const updateFooterLink = (index, field, value) => {
    const updated = [...footerLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFooterLinks(updated);
  };

  const removeFooterLink = (index) => {
    setFooterLinks(footerLinks.filter((_, i) => i !== index));
    toast.success('Link removed');
  };

  const saveFooterLinks = async () => {
    // Clear previous errors
    setFooterLinksErrors({});

    // Validate footer links
    const errors = {};
    footerLinks.forEach((link, index) => {
      if (!link.label?.trim()) {
        errors[index] = { ...(errors[index] || {}), label: 'Label is required' };
      }
    });

    if (Object.keys(errors).length > 0) {
      setFooterLinksErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateFooterLinks(footerLinks);
      toast.success('Footer links saved successfully');
      setFooterLinksErrors({});
    } catch (error) {
      console.error('Error saving footer links:', error);
      let message = error.response?.data?.message || 'Failed to save footer links';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Footer Social Links Functions
  const addFooterSocialLink = () => {
    setFooterSocialLinks([
      ...footerSocialLinks,
      { platform: '', url: '', isActive: true },
    ]);
    toast.success('Social link added');
  };

  const updateFooterSocialLink = (index, field, value) => {
    const updated = [...footerSocialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setFooterSocialLinks(updated);
  };

  const removeFooterSocialLink = (index) => {
    setFooterSocialLinks(footerSocialLinks.filter((_, i) => i !== index));
    toast.success('Social link removed');
  };

  const saveFooterSocialLinks = async () => {
    // Clear previous errors
    setFooterSocialLinksErrors({});

    // Validate social links
    const errors = {};
    footerSocialLinks.forEach((social, index) => {
      if (!social.url?.trim()) {
        errors[index] = { ...(errors[index] || {}), url: 'URL is required' };
      }
    });

    if (Object.keys(errors).length > 0) {
      setFooterSocialLinksErrors(errors);
      return;
    }

    try {
      setSaving(true);
      await siteContentAPI.updateFooterSocialLinks(footerSocialLinks);
      toast.success('Footer social links saved successfully');
      setFooterSocialLinksErrors({});
    } catch (error) {
      console.error('Error saving footer social links:', error);
      let message = error.response?.data?.message || 'Failed to save footer social links';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
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
      toast.success('Keyword added');
    }
  };

  const removeKeyword = (index) => {
    setSeo({ ...seo, metaKeywords: seo.metaKeywords.filter((_, i) => i !== index) });
    toast.success('Keyword removed');
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Content</h1>
            <p className="text-gray-500">Manage your website's dynamic content</p>
          </div>
          <button
            onClick={fetchContent}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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
                      className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap transition-colors cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-800 border-b-2 border-blue-800'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-800 border-l-4 border-blue-800'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                  <h2 className="text-lg font-semibold text-gray-900">Hero Carousel Slides</h2>

                  {heroSlides.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No hero slides yet. Click "Add Slide" to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {heroSlides.map((slide, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${heroSlideErrors[index] ? 'border-red-400' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-gray-900">Slide {index + 1}</h3>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveHeroSlide(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveHeroSlide(index, 'down')}
                                disabled={index === heroSlides.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeHeroSlide(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Image Upload */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Hero Image<sup className="text-red-500">*</sup>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={slide.image}
                                  onChange={(e) => {
                                    updateHeroSlide(index, 'image', e.target.value);
                                    if (heroSlideErrors[index]?.image) {
                                      setHeroSlideErrors(prev => ({
                                        ...prev,
                                        [index]: { ...prev[index], image: null }
                                      }));
                                    }
                                  }}
                                  placeholder="https://example.com/image.jpg"
                                  maxLength={500}
                                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${heroSlideErrors[index]?.image ? 'border-red-400' : 'border-gray-300'}`}
                                />
                                {heroSlideErrors[index]?.image && (
                                  <p className="text-red-500 text-sm mt-1">{heroSlideErrors[index].image}</p>
                                )}
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
                                        if (heroSlideErrors[index]?.image) {
                                          setHeroSlideErrors(prev => ({
                                            ...prev,
                                            [index]: { ...prev[index], image: null }
                                          }));
                                        }
                                      });
                                    }
                                  }}
                                  className="hidden"
                                />
                                <button
                                  onClick={() => fileInputRefs.current[`hero-${index}`]?.click()}
                                  disabled={uploading[`hero-${index}`]}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title<sup className="text-red-500">*</sup>
                              </label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => {
                                  updateHeroSlide(index, 'title', e.target.value);
                                  if (heroSlideErrors[index]?.title) {
                                    setHeroSlideErrors(prev => ({
                                      ...prev,
                                      [index]: { ...prev[index], title: null }
                                    }));
                                  }
                                }}
                                placeholder="Find Your Perfect Home"
                                maxLength={100}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${heroSlideErrors[index]?.title ? 'border-red-400' : 'border-gray-300'}`}
                              />
                              {heroSlideErrors[index]?.title && (
                                <p className="text-red-500 text-sm mt-1">{heroSlideErrors[index].title}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle<sup className="text-red-500">*</sup>
                              </label>
                              <input
                                type="text"
                                value={slide.subtitle}
                                onChange={(e) => {
                                  updateHeroSlide(index, 'subtitle', e.target.value);
                                  if (heroSlideErrors[index]?.subtitle) {
                                    setHeroSlideErrors(prev => ({
                                      ...prev,
                                      [index]: { ...prev[index], subtitle: null }
                                    }));
                                  }
                                }}
                                placeholder="Premium Properties in Prime Locations"
                                maxLength={200}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${heroSlideErrors[index]?.subtitle ? 'border-red-400' : 'border-gray-300'}`}
                              />
                              {heroSlideErrors[index]?.subtitle && (
                                <p className="text-red-500 text-sm mt-1">{heroSlideErrors[index].subtitle}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Location Badge</label>
                              <input
                                type="text"
                                value={slide.location}
                                onChange={(e) => updateHeroSlide(index, 'location', e.target.value)}
                                placeholder="Bangalore"
                                maxLength={50}
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
                                maxLength={20}
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
                                    maxLength={30}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <select
                                    value={slide.primaryCta?.link || '/properties'}
                                    onChange={(e) => updateHeroSlide(index, 'primaryCta.link', e.target.value)}
                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
                                    maxLength={30}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <select
                                    value={slide.secondaryCta?.type || 'phone'}
                                    onChange={(e) => updateHeroSlide(index, 'secondaryCta.type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={slide.isActive}
                                onChange={(e) => updateHeroSlide(index, 'isActive', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">Active</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={addHeroSlide}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Slide
                    </button>

                    <button
                      onClick={saveHeroSlides}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        value={whyUs.sectionTitle}
                        onChange={(e) => {
                          setWhyUs({ ...whyUs, sectionTitle: e.target.value });
                          if (whyUsErrors.sectionTitle) {
                            setWhyUsErrors({ ...whyUsErrors, sectionTitle: '' });
                          }
                        }}
                        placeholder="Your Trusted Property Partner"
                        maxLength={100}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${whyUsErrors.sectionTitle ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {whyUsErrors.sectionTitle && (
                        <p className="text-sm text-red-500 mt-1">{whyUsErrors.sectionTitle}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                      <input
                        type="text"
                        value={whyUs.sectionSubtitle}
                        onChange={(e) => setWhyUs({ ...whyUs, sectionSubtitle: e.target.value })}
                        placeholder="We combine technology with expertise..."
                        maxLength={200}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="font-medium text-gray-900">Features</h3>
                      <button
                        onClick={addFeature}
                        className="self-start sm:self-auto flex items-center gap-1 px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Feature
                      </button>
                    </div>
                    <div className="space-y-3">
                      {whyUs.features.map((feature, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start p-3 bg-gray-50 rounded-lg">
                          <select
                            value={feature.icon}
                            onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer"
                          >
                            {ICON_OPTIONS.map((icon) => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => {
                                updateFeature(index, 'title', e.target.value);
                                if (whyUsErrors.features?.[index]?.title) {
                                  const newErrors = { ...whyUsErrors };
                                  if (newErrors.features?.[index]) {
                                    delete newErrors.features[index].title;
                                    if (Object.keys(newErrors.features[index]).length === 0) {
                                      delete newErrors.features[index];
                                    }
                                  }
                                  if (Object.keys(newErrors.features || {}).length === 0) {
                                    delete newErrors.features;
                                  }
                                  setWhyUsErrors(newErrors);
                                }
                              }}
                              placeholder="Title"
                              maxLength={50}
                              className={`w-full px-3 py-1 border rounded ${whyUsErrors.features?.[index]?.title ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {whyUsErrors.features?.[index]?.title && (
                              <p className="text-sm text-red-500 mt-1">{whyUsErrors.features[index].title}</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={feature.description}
                              onChange={(e) => {
                                updateFeature(index, 'description', e.target.value);
                                if (whyUsErrors.features?.[index]?.description) {
                                  const newErrors = { ...whyUsErrors };
                                  if (newErrors.features?.[index]) {
                                    delete newErrors.features[index].description;
                                    if (Object.keys(newErrors.features[index]).length === 0) {
                                      delete newErrors.features[index];
                                    }
                                  }
                                  if (Object.keys(newErrors.features || {}).length === 0) {
                                    delete newErrors.features;
                                  }
                                  setWhyUsErrors(newErrors);
                                }
                              }}
                              placeholder="Description"
                              maxLength={100}
                              className={`w-full px-3 py-1 border rounded ${whyUsErrors.features?.[index]?.description ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {whyUsErrors.features?.[index]?.description && (
                              <p className="text-sm text-red-500 mt-1">{whyUsErrors.features[index].description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFeature(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="font-medium text-gray-900">Stats</h3>
                      <button
                        onClick={addStat}
                        className="self-start sm:self-auto flex items-center gap-1 px-3 py-1 text-sm text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Stat
                      </button>
                    </div>
                    <div className="space-y-3">
                      {whyUs.stats.map((stat, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-3 items-start p-3 bg-gray-50 rounded-lg">
                          <div>
                            <input
                              type="text"
                              value={stat.value}
                              onKeyDown={(e) => {
                                // Prevent typing letters
                                if (/^[a-zA-Z]$/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                // Only allow numbers, decimals, and special characters (no letters)
                                const filteredValue = e.target.value.replace(/[a-zA-Z]/g, '');
                                updateStat(index, 'value', filteredValue);
                                if (whyUsErrors.stats?.[index]?.value) {
                                  const newErrors = { ...whyUsErrors };
                                  if (newErrors.stats?.[index]) {
                                    delete newErrors.stats[index].value;
                                    if (Object.keys(newErrors.stats[index]).length === 0) {
                                      delete newErrors.stats[index];
                                    }
                                  }
                                  if (Object.keys(newErrors.stats || {}).length === 0) {
                                    delete newErrors.stats;
                                  }
                                  setWhyUsErrors(newErrors);
                                }
                              }}
                              placeholder="98%"
                              maxLength={20}
                              className={`w-24 px-3 py-1 border rounded ${whyUsErrors.stats?.[index]?.value ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {whyUsErrors.stats?.[index]?.value && (
                              <p className="text-sm text-red-500 mt-1">{whyUsErrors.stats[index].value}</p>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                updateStat(index, 'label', e.target.value);
                                if (whyUsErrors.stats?.[index]?.label) {
                                  const newErrors = { ...whyUsErrors };
                                  if (newErrors.stats?.[index]) {
                                    delete newErrors.stats[index].label;
                                    if (Object.keys(newErrors.stats[index]).length === 0) {
                                      delete newErrors.stats[index];
                                    }
                                  }
                                  if (Object.keys(newErrors.stats || {}).length === 0) {
                                    delete newErrors.stats;
                                  }
                                  setWhyUsErrors(newErrors);
                                }
                              }}
                              placeholder="Customer Satisfaction"
                              maxLength={50}
                              className={`w-full px-3 py-1 border rounded ${whyUsErrors.stats?.[index]?.label ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {whyUsErrors.stats?.[index]?.label && (
                              <p className="text-sm text-red-500 mt-1">{whyUsErrors.stats[index].label}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeStat(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
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
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  <h2 className="text-lg font-semibold text-gray-900">Popular Cities</h2>

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
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City Name<sup className="text-red-500">*</sup>
                              </label>
                              <input
                                type="text"
                                value={city.name}
                                onChange={(e) => {
                                  updateCity(index, 'name', e.target.value);
                                  if (citiesErrors[index]?.name) {
                                    const newErrors = { ...citiesErrors };
                                    if (newErrors[index]) {
                                      delete newErrors[index].name;
                                      if (Object.keys(newErrors[index]).length === 0) {
                                        delete newErrors[index];
                                      }
                                    }
                                    setCitiesErrors(newErrors);
                                  }
                                }}
                                placeholder="Bangalore"
                                maxLength={50}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${citiesErrors[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              {citiesErrors[index]?.name && (
                                <p className="text-sm text-red-500 mt-1">{citiesErrors[index].name}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image<sup className="text-red-500">*</sup>
                              </label>
                              <div className="flex flex-col sm:flex-row gap-2 items-center">
                                <input
                                  type="text"
                                  value={city.image || ''}
                                  onChange={(e) => {
                                    updateCity(index, 'image', e.target.value);
                                    if (citiesErrors[index]?.image) {
                                      const newErrors = { ...citiesErrors };
                                      if (newErrors[index]) {
                                        delete newErrors[index].image;
                                        if (Object.keys(newErrors[index]).length === 0) {
                                          delete newErrors[index];
                                        }
                                      }
                                      setCitiesErrors(newErrors);
                                    }
                                  }}
                                  placeholder="https://example.com/city.jpg"
                                  maxLength={500}
                                  className={`w-full sm:flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${citiesErrors[index]?.image ? 'border-red-500' : 'border-gray-300'}`}
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
                                        if (citiesErrors[index]?.image) {
                                          const newErrors = { ...citiesErrors };
                                          if (newErrors[index]) {
                                            delete newErrors[index].image;
                                            if (Object.keys(newErrors[index]).length === 0) {
                                              delete newErrors[index];
                                            }
                                          }
                                          setCitiesErrors(newErrors);
                                        }
                                      });
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => fileInputRefs.current[`city-${index}`]?.click()}
                                  disabled={uploading[`city-${index}`]}
                                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                  {uploading[`city-${index}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                </button>
                              </div>
                              {citiesErrors[index]?.image && (
                                <p className="text-sm text-red-500 mt-1">{citiesErrors[index].image}</p>
                              )}
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                              <input
                                type="text"
                                value={city.description || ''}
                                onChange={(e) => updateCity(index, 'description', e.target.value)}
                                placeholder="Premium properties in Bangalore"
                                maxLength={200}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={city.isActive}
                                  onChange={(e) => updateCity(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 cursor-pointer"
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

                  <div className="pt-4 border-t flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={addCity}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add City
                    </button>
                    <button
                      onClick={saveCities}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Cities'}
                    </button>
                  </div>
                </div>
              )}

              {/* Builders Tab */}
              {activeTab === 'builders' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Featured Builders</h2>
                      <p className="text-sm text-gray-500 mt-1">Select up to 10 builders to display on the homepage</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {featuredBuilders.length}/10 builders selected
                    </span>
                  </div>

                  {/* Available Builders */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Available Builders</h3>
                    {loadingBuilders ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                      </div>
                    ) : allBuilders.length === 0 ? (
                      <p className="text-gray-500 text-sm">No builders found. Create properties with builder names first.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {allBuilders.map((builder) => {
                          const isSelected = featuredBuilders.some(b => b.name === builder.name);
                          return (
                            <button
                              key={builder.name}
                              onClick={() => !isSelected && addFeaturedBuilder(builder.name)}
                              disabled={isSelected || featuredBuilders.length >= 10}
                              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                  : featuredBuilders.length >= 10
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                              }`}
                            >
                              {builder.name} ({builder.count})
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Featured Builders List */}
                  {featuredBuilders.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">Selected Builders (in display order)</h3>
                      {featuredBuilders.map((builder, index) => (
                        <div key={builder.name} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <button
                                  onClick={() => moveBuilderOrder(index, 'up')}
                                  disabled={index === 0}
                                  className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => moveBuilderOrder(index, 'down')}
                                  disabled={index === featuredBuilders.length - 1}
                                  className="p-0.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              </div>
                              <h3 className="font-medium text-gray-900">{builder.name}</h3>
                            </div>
                            <button
                              onClick={() => removeFeaturedBuilder(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Builder Name</label>
                              <input
                                type="text"
                                value={builder.name}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Logo<sup className="text-red-500">*</sup>
                              </label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                  type="text"
                                  value={builder.logo || ''}
                                  onChange={(e) => {
                                    updateBuilderLogo(index, e.target.value);
                                    if (buildersErrors[index]?.logo) {
                                      const newErrors = { ...buildersErrors };
                                      if (newErrors[index]) {
                                        delete newErrors[index].logo;
                                        if (Object.keys(newErrors[index]).length === 0) {
                                          delete newErrors[index];
                                        }
                                      }
                                      setBuildersErrors(newErrors);
                                    }
                                  }}
                                  placeholder="https://example.com/logo.png"
                                  maxLength={500}
                                  className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${buildersErrors[index]?.logo ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  id={`builder-logo-${index}`}
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      handleBuilderLogoUpload(file, index);
                                      if (buildersErrors[index]?.logo) {
                                        const newErrors = { ...buildersErrors };
                                        if (newErrors[index]) {
                                          delete newErrors[index].logo;
                                          if (Object.keys(newErrors[index]).length === 0) {
                                            delete newErrors[index];
                                          }
                                        }
                                        setBuildersErrors(newErrors);
                                      }
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => document.getElementById(`builder-logo-${index}`).click()}
                                  disabled={uploading[`builder-${index}`]}
                                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                  {uploading[`builder-${index}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                </button>
                              </div>
                              {buildersErrors[index]?.logo && (
                                <p className="text-sm text-red-500 mt-1">{buildersErrors[index].logo}</p>
                              )}
                            </div>
                          </div>
                          {builder.logo && (
                            <div className="mt-3">
                              <div className="w-32 h-20 bg-gray-50 rounded-lg p-2 flex items-center justify-center">
                                <img
                                  src={getFileUrl(builder.logo)}
                                  alt={builder.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {featuredBuilders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No builders selected. Click on builders above to add them.</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveFeaturedBuilders}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save Builders'}
                    </button>
                  </div>
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">Customer Testimonials</h2>

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
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name<sup className="text-red-500">*</sup>
                              </label>
                              <input
                                type="text"
                                value={testimonial.name}
                                onChange={(e) => {
                                  updateTestimonial(index, 'name', e.target.value);
                                  if (testimonialsErrors[index]?.name) {
                                    const newErrors = { ...testimonialsErrors };
                                    if (newErrors[index]) {
                                      delete newErrors[index].name;
                                      if (Object.keys(newErrors[index]).length === 0) {
                                        delete newErrors[index];
                                      }
                                    }
                                    setTestimonialsErrors(newErrors);
                                  }
                                }}
                                placeholder="John Doe"
                                maxLength={50}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${testimonialsErrors[index]?.name ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              {testimonialsErrors[index]?.name && (
                                <p className="text-sm text-red-500 mt-1">{testimonialsErrors[index].name}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location<sup className="text-red-500">*</sup>
                              </label>
                              <input
                                type="text"
                                value={testimonial.location}
                                onChange={(e) => {
                                  updateTestimonial(index, 'location', e.target.value);
                                  if (testimonialsErrors[index]?.location) {
                                    const newErrors = { ...testimonialsErrors };
                                    if (newErrors[index]) {
                                      delete newErrors[index].location;
                                      if (Object.keys(newErrors[index]).length === 0) {
                                        delete newErrors[index];
                                      }
                                    }
                                    setTestimonialsErrors(newErrors);
                                  }
                                }}
                                placeholder="Bangalore"
                                maxLength={50}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${testimonialsErrors[index]?.location ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              {testimonialsErrors[index]?.location && (
                                <p className="text-sm text-red-500 mt-1">{testimonialsErrors[index].location}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                              <input
                                type="number"
                                min="1"
                                max="5"
                                value={testimonial.rating}
                                onChange={(e) => {
                                  let value = parseInt(e.target.value);
                                  if (isNaN(value)) {
                                    value = 1;
                                  } else if (value < 1) {
                                    value = 1;
                                  } else if (value > 5) {
                                    value = 5;
                                  }
                                  updateTestimonial(index, 'rating', value);
                                }}
                                onBlur={(e) => {
                                  let value = parseInt(e.target.value);
                                  if (isNaN(value) || value < 1) {
                                    updateTestimonial(index, 'rating', 1);
                                  } else if (value > 5) {
                                    updateTestimonial(index, 'rating', 5);
                                  }
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                              <input
                                type="text"
                                value={testimonial.property}
                                onChange={(e) => updateTestimonial(index, 'property', e.target.value)}
                                placeholder="Prestige Lakeside"
                                maxLength={100}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={testimonial.isActive}
                                  onChange={(e) => updateTestimonial(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Testimonial Text<sup className="text-red-500">*</sup>
                            </label>
                            <textarea
                              value={testimonial.text}
                              onChange={(e) => {
                                updateTestimonial(index, 'text', e.target.value);
                                if (testimonialsErrors[index]?.text) {
                                  const newErrors = { ...testimonialsErrors };
                                  if (newErrors[index]) {
                                    delete newErrors[index].text;
                                    if (Object.keys(newErrors[index]).length === 0) {
                                      delete newErrors[index];
                                    }
                                  }
                                  setTestimonialsErrors(newErrors);
                                }
                              }}
                              rows={3}
                              placeholder="Share their experience..."
                              maxLength={500}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${testimonialsErrors[index]?.text ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {testimonialsErrors[index]?.text && (
                              <p className="text-sm text-red-500 mt-1">{testimonialsErrors[index].text}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={addTestimonial}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Testimonial
                    </button>
                    <button
                      onClick={saveTestimonials}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                  <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>

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
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => moveFaq(index, 'down')}
                                disabled={index === faqs.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removeFaq(index)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question<sup className="text-red-500">*</sup>
                              </label>
                              <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => {
                                  updateFaq(index, 'question', e.target.value);
                                  if (faqsErrors[index]?.question) {
                                    const newErrors = { ...faqsErrors };
                                    if (newErrors[index]) {
                                      delete newErrors[index].question;
                                      if (Object.keys(newErrors[index]).length === 0) {
                                        delete newErrors[index];
                                      }
                                    }
                                    setFaqsErrors(newErrors);
                                  }
                                }}
                                placeholder="How do I schedule a property visit?"
                                maxLength={200}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${faqsErrors[index]?.question ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              {faqsErrors[index]?.question && (
                                <p className="text-sm text-red-500 mt-1">{faqsErrors[index].question}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Answer<sup className="text-red-500">*</sup>
                              </label>
                              <textarea
                                value={faq.answer}
                                onChange={(e) => {
                                  updateFaq(index, 'answer', e.target.value);
                                  if (faqsErrors[index]?.answer) {
                                    const newErrors = { ...faqsErrors };
                                    if (newErrors[index]) {
                                      delete newErrors[index].answer;
                                      if (Object.keys(newErrors[index]).length === 0) {
                                        delete newErrors[index];
                                      }
                                    }
                                    setFaqsErrors(newErrors);
                                  }
                                }}
                                rows={3}
                                placeholder="You can schedule a property visit by..."
                                maxLength={1000}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${faqsErrors[index]?.answer ? 'border-red-500' : 'border-gray-300'}`}
                              />
                              {faqsErrors[index]?.answer && (
                                <p className="text-sm text-red-500 mt-1">{faqsErrors[index].answer}</p>
                              )}
                            </div>
                            <div className="flex items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={faq.isActive}
                                  onChange={(e) => updateFaq(index, 'isActive', e.target.checked)}
                                  className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm text-gray-700">Active</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t flex flex-wrap items-center gap-3 sm:gap-4">
                    <button
                      onClick={addFaq}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add FAQ
                    </button>
                    <button
                      onClick={saveFaqs}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => {
                          setContact({ ...contact, phone: e.target.value });
                          if (contactErrors.phone) {
                            setContactErrors({ ...contactErrors, phone: '' });
                          }
                        }}
                        placeholder="+91 98765 43210"
                        maxLength={20}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${contactErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {contactErrors.phone && (
                        <p className="text-sm text-red-500 mt-1">{contactErrors.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          setContact({ ...contact, email: e.target.value });
                          if (contactErrors.email) {
                            setContactErrors({ ...contactErrors, email: '' });
                          }
                        }}
                        placeholder="info@propdeal.com"
                        maxLength={100}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${contactErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {contactErrors.email && (
                        <p className="text-sm text-red-500 mt-1">{contactErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        value={contact.address}
                        onChange={(e) => {
                          setContact({ ...contact, address: e.target.value });
                          if (contactErrors.address) {
                            setContactErrors({ ...contactErrors, address: '' });
                          }
                        }}
                        placeholder="123 Real Estate Tower, MG Road"
                        maxLength={200}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${contactErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {contactErrors.address && (
                        <p className="text-sm text-red-500 mt-1">{contactErrors.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        value={contact.city}
                        onChange={(e) => {
                          setContact({ ...contact, city: e.target.value });
                          if (contactErrors.city) {
                            setContactErrors({ ...contactErrors, city: '' });
                          }
                        }}
                        placeholder="Bangalore"
                        maxLength={50}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${contactErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {contactErrors.city && (
                        <p className="text-sm text-red-500 mt-1">{contactErrors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={contact.state}
                        onChange={(e) => setContact({ ...contact, state: e.target.value })}
                        placeholder="Karnataka"
                        maxLength={50}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={contact.pincode}
                        onChange={(e) => setContact({ ...contact, pincode: e.target.value })}
                        placeholder="560001"
                        maxLength={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                      <input
                        type="text"
                        value={contact.workingHours}
                        onChange={(e) => setContact({ ...contact, workingHours: e.target.value })}
                        placeholder="Mon - Sat, 9:00 AM - 7:00 PM"
                        maxLength={100}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveContact}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site Name<sup className="text-red-500">*</sup>
                      </label>
                      <input
                        type="text"
                        value={seo.siteName}
                        onChange={(e) => {
                          setSeo({ ...seo, siteName: e.target.value });
                          if (seoErrors.siteName) {
                            setSeoErrors({ ...seoErrors, siteName: '' });
                          }
                        }}
                        placeholder="PropDeal"
                        maxLength={50}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${seoErrors.siteName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {seoErrors.siteName && (
                        <p className="text-sm text-red-500 mt-1">{seoErrors.siteName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site Tagline</label>
                      <input
                        type="text"
                        value={seo.siteTagline}
                        onChange={(e) => setSeo({ ...seo, siteTagline: e.target.value })}
                        placeholder="Find Your Perfect Home"
                        maxLength={100}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                      <textarea
                        value={seo.metaDescription}
                        onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                        rows={2}
                        placeholder="Find your dream property with verified listings..."
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                              className="hover:text-blue-900 cursor-pointer"
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
                          maxLength={30}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={addKeyword}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
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
                        maxLength={500}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      onClick={saveSeo}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                                    {branding.siteName || content?.seo?.siteName || 'PropDeal'}
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
                                    {branding.siteName || content?.seo?.siteName || 'PropDeal'}
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
                                    {branding.siteName || content?.seo?.siteName || 'PropDeal'}
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
                            maxLength={500}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          maxLength={50}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                              placeholder={content?.seo?.siteName || 'PropDeal'}
                              maxLength={50}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">Leave empty to use the default site name from SEO settings</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id="showSiteNameWithLogo"
                              checked={branding.showSiteNameWithLogo !== false}
                              onChange={(e) => setBranding({ ...branding, showSiteNameWithLogo: e.target.checked })}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="showSiteNameWithLogo" className="text-sm text-gray-700 cursor-pointer">
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
                      className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Footer Description<sup className="text-red-500">*</sup>
                        </label>
                        <textarea
                          value={footer.description}
                          onChange={(e) => {
                            setFooter({ ...footer, description: e.target.value });
                            if (footerErrors.description) {
                              setFooterErrors({ ...footerErrors, description: '' });
                            }
                          }}
                          rows={2}
                          placeholder="Discover your dream property with our platform..."
                          maxLength={300}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${footerErrors.description ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {footerErrors.description && (
                          <p className="text-sm text-red-500 mt-1">{footerErrors.description}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Short description shown below the logo</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Copyright Text<sup className="text-red-500">*</sup>
                        </label>
                        <input
                          type="text"
                          value={footer.copyrightText}
                          onChange={(e) => {
                            setFooter({ ...footer, copyrightText: e.target.value });
                            if (footerErrors.copyrightText) {
                              setFooterErrors({ ...footerErrors, copyrightText: '' });
                            }
                          }}
                          placeholder="© 2024 PropDeal. All rights reserved."
                          maxLength={100}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${footerErrors.copyrightText ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {footerErrors.copyrightText && (
                          <p className="text-sm text-red-500 mt-1">{footerErrors.copyrightText}</p>
                        )}
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={saveFooter}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Basic Settings
                      </button>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Quick Links Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
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
                                <label className="block text-xs text-gray-500 mb-1">
                                  Label<sup className="text-red-500">*</sup>
                                </label>
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(e) => {
                                    updateFooterLink(index, 'label', e.target.value);
                                    if (footerLinksErrors[index]?.label) {
                                      const newErrors = { ...footerLinksErrors };
                                      if (newErrors[index]) {
                                        delete newErrors[index].label;
                                        if (Object.keys(newErrors[index]).length === 0) {
                                          delete newErrors[index];
                                        }
                                      }
                                      setFooterLinksErrors(newErrors);
                                    }
                                  }}
                                  placeholder="Home"
                                  maxLength={30}
                                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${footerLinksErrors[index]?.label ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {footerLinksErrors[index]?.label && (
                                  <p className="text-xs text-red-500 mt-1">{footerLinksErrors[index].label}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Page</label>
                                <select
                                  value={link.url}
                                  onChange={(e) => updateFooterLink(index, 'url', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                                >
                                  {PAGE_OPTIONS.map((page) => (
                                    <option key={page.value} value={page.value}>{page.label}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-2 flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={link.isActive}
                                    onChange={(e) => updateFooterLink(index, 'isActive', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700">Active</span>
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFooterLink(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t flex flex-wrap items-center gap-3 sm:gap-4">
                      <button
                        onClick={addFooterLink}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Link
                      </button>
                      <button
                        onClick={saveFooterLinks}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Quick Links
                      </button>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Social Links Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Social Links</h3>
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
                                <label className="block text-xs text-gray-500 mb-1">
                                  Platform<sup className="text-red-500">*</sup>
                                </label>
                                <select
                                  value={social.platform}
                                  onChange={(e) => updateFooterSocialLink(index, 'platform', e.target.value)}
                                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer ${!social.platform ? 'text-gray-400' : 'text-gray-900'}`}
                                >
                                  <option value="">Select platform</option>
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
                                <label className="block text-xs text-gray-500 mb-1">
                                  URL<sup className="text-red-500">*</sup>
                                </label>
                                <input
                                  type="url"
                                  value={social.url}
                                  onChange={(e) => {
                                    updateFooterSocialLink(index, 'url', e.target.value);
                                    if (footerSocialLinksErrors[index]?.url) {
                                      const newErrors = { ...footerSocialLinksErrors };
                                      if (newErrors[index]) {
                                        delete newErrors[index].url;
                                        if (Object.keys(newErrors[index]).length === 0) {
                                          delete newErrors[index];
                                        }
                                      }
                                      setFooterSocialLinksErrors(newErrors);
                                    }
                                  }}
                                  placeholder="https://facebook.com/yourpage"
                                  maxLength={200}
                                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${footerSocialLinksErrors[index]?.url ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {footerSocialLinksErrors[index]?.url && (
                                  <p className="text-xs text-red-500 mt-1">{footerSocialLinksErrors[index].url}</p>
                                )}
                              </div>
                              <div className="col-span-2 flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={social.isActive}
                                    onChange={(e) => updateFooterSocialLink(index, 'isActive', e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-800 focus:ring-blue-500 cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-700">Active</span>
                                </label>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFooterSocialLink(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-4 border-t flex flex-wrap items-center gap-3 sm:gap-4">
                      <button
                        onClick={addFooterSocialLink}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Social
                      </button>
                      <button
                        onClick={saveFooterSocialLinks}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Social Links
                      </button>
                    </div>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="pt-2">
                      <button
                        onClick={savePrivacyPolicy}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="pt-2">
                      <button
                        onClick={saveTermsOfService}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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