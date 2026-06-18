import { createContext, useContext, useState } from 'react';
import { analyticsAPI } from '../services/api.js';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [property, setProperty] = useState(null);
  const [source, setSource] = useState('cta-price');

  const openModal = (propertyData, sourceType = 'cta-price') => {
    setProperty(propertyData);
    setSource(sourceType);
    setIsOpen(true);

    // Track CTA click (fire and forget)
    if (propertyData?._id) {
      // Map source type to CTA names expected by backend
      const ctaMap = {
        'cta-price': 'getPriceDetails',
        'cta-visit': 'bookSiteVisit',
        'cta-brochure': 'downloadBrochure',
        'cta-callback': 'requestCallback',
        'contact-section': 'contactUs',
      };

      const cta = ctaMap[sourceType] || sourceType;

      analyticsAPI.trackCTA({
        propertyId: propertyData._id,
        cta,
      }).catch(err => console.error('Analytics error:', err));
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setProperty(null);
    setSource('cta-price');
  };

  return (
    <LeadContext.Provider value={{ isOpen, property, source, openModal, closeModal }}>
      {children}
    </LeadContext.Provider>
  );
};

export const useLead = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLead must be used within a LeadProvider');
  }
  return context;
};