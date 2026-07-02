import { createContext, useContext, useState, useRef } from 'react';
import { analyticsAPI } from '../services/api.js';

const LeadContext = createContext(null);

export const LeadProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [property, setProperty] = useState(null);
  const [source, setSource] = useState('cta-price');
  const onSuccessCallback = useRef(null);

  const openModal = (propertyData, sourceType = 'cta-price', onSuccess = null) => {
    setProperty(propertyData);
    setSource(sourceType);
    setIsOpen(true);
    onSuccessCallback.current = onSuccess;

    // Track CTA click (fire and forget)
    if (propertyData?._id) {
      // Map source type to CTA names expected by backend
      const ctaMap = {
        // Get Details buttons
        'cta-hero': 'heroEnquiry',
        'cta-highlights': 'highlightsEnquiry',
        'cta-overview': 'overviewEnquiry',
        'cta-investment': 'investmentEnquiry',
        'cta-navbar': 'navbarEnquiry',
        'cta-sticky': 'stickyEnquiry',
        // Book Site Visit buttons
        'cta-hero-visit': 'heroSiteVisit',
        'cta-gallery-visit': 'gallerySiteVisit',
        'cta-footer-visit': 'footerSiteVisit',
        'cta-video-visit': 'videoSiteVisit',
        'cta-visit': 'siteVisit',
        // Get Price Details buttons
        'cta-pricing-table': 'pricingTableEnquiry',
        'cta-pricing-sheet': 'pricingSheetEnquiry',
        'cta-pricing-card': 'pricingCardEnquiry',
        'cta-price': 'priceDetails',
        // Other buttons
        'cta-plans': 'getFloorPlans',
        'cta-plans-view': 'viewFloorPlans',
        'cta-unit-plans-view': 'viewUnitPlans',
        'cta-callback': 'requestCallback',
        'cta-faq': 'faqScheduleCall',
        'cta-amenities': 'amenitiesInfo',
        'cta-homeloan': 'homeLoanAssistance',
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

  const onSuccess = () => {
    if (onSuccessCallback.current) {
      onSuccessCallback.current();
      onSuccessCallback.current = null;
    }
  };

  return (
    <LeadContext.Provider value={{ isOpen, property, source, openModal, closeModal, onSuccess }}>
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