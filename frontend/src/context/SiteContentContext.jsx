import { createContext, useContext, useState, useEffect } from 'react';
import { siteContentAPI } from '../services/api.js';

const SiteContentContext = createContext(null);

export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await siteContentAPI.getContent();
      setContent(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching site content:', err);
      setError(err);
      // Set default content on error
      setContent(getDefaultContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultContent = () => ({
    heroSlides: [
      {
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop',
        title: 'Find Your Perfect Home',
        subtitle: 'Premium Properties in Prime Locations',
        location: 'Bangalore',
        properties: '234+ Properties',
        isActive: true,
      },
      {
        image: 'https://images.unsplash.com/photo-1600585154340-be9168c6a96a?w=1920&h=1080&fit=crop',
        title: 'Luxury Living Redefined',
        subtitle: 'Exclusive Villas & Apartments',
        location: 'Mumbai',
        properties: '150+ Properties',
        isActive: true,
      },
      {
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop',
        title: 'Smart Investment Choices',
        subtitle: 'High Returns, Premium Locations',
        location: 'Gurgaon',
        properties: '180+ Properties',
        isActive: true,
      },
    ],
    whyUs: {
      sectionTitle: 'Your Trusted Property Partner',
      sectionSubtitle: 'We combine technology with expertise to deliver exceptional property solutions tailored to your needs.',
      features: [
        { icon: 'CheckCircle', title: 'RERA Verified', description: 'All properties are RERA registered with verified documentation for your peace of mind.' },
        { icon: 'Shield', title: 'Real Photos Only', description: 'What you see is what you get. No stock images or misleading photos on our platform.' },
        { icon: 'Award', title: 'Direct Builder Price', description: 'No middlemen or brokers. Get the best prices directly from developers.' },
        { icon: 'Clock', title: 'Transparent Pricing', description: 'All costs clearly mentioned upfront. No hidden charges or surprise fees.' },
      ],
      stats: [
        { value: '98%', label: 'Customer Satisfaction' },
        { value: '500+', label: 'Properties Sold' },
        { value: '50+', label: 'Cities Covered' },
        { value: '4.8', label: 'Average Rating' },
      ],
    },
    cities: [
      { name: 'Bangalore', description: 'Silicon Valley of India', isActive: true },
      { name: 'Mumbai', description: 'Financial Capital of India', isActive: true },
      { name: 'Gurgaon', description: 'Corporate Hub of NCR', isActive: true },
      { name: 'Pune', description: 'Oxford of the East', isActive: true },
    ],
    testimonials: [
      {
        name: 'Rahul Sharma',
        location: 'Bangalore',
        rating: 5,
        property: 'Prestige Lakeside Habitat',
        text: 'Found my dream home through PropDeal. The team was incredibly helpful and guided me through every step.',
        isActive: true,
      },
    ],
    faqs: [
      {
        question: 'How do I schedule a property visit?',
        answer: 'You can schedule a property visit by clicking the "Schedule Visit" button on any property page. Fill in your preferred date and time, and our team will coordinate with the builder to arrange the visit.',
        isActive: true,
      },
    ],
    contact: {
      phone: '+91 98765 43210',
      email: 'info@propdeal.com',
      address: '123 Real Estate Tower, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      workingHours: 'Mon - Sat, 9:00 AM - 7:00 PM',
    },
    social: {},
    seo: {
      siteName: 'PropDeal',
      siteTagline: 'Find Your Perfect Home',
    },
    branding: {
      logo: '',
      logoAlt: 'Logo',
      siteName: '',
      showSiteNameWithLogo: true,
      navbarLogoHeight: 40,
      footerLogoHeight: 32,
      sidebarLogoHeight: 40,
    },
    footer: {
      description: 'Discover your dream property with our platform. We help you find the perfect home with detailed insights.',
      copyrightText: '© 2024 PropDeal. All rights reserved.',
    },
    footerLinks: [
      { label: 'Home', url: '/', order: 0, isActive: true },
      { label: 'Properties', url: '/properties', order: 1, isActive: true },
      { label: 'About Us', url: '/about', order: 2, isActive: true },
      { label: 'Contact', url: '/contact', order: 3, isActive: true },
    ],
    footerSocialLinks: [],
    privacyPolicy: '',
    termsOfService: '',
  });

  return (
    <SiteContentContext.Provider value={{ content, loading, error, refetch: fetchContent }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export default SiteContentContext;