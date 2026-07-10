import { createContext, useContext, useState } from 'react';

const EnquiryContext = createContext(null);

export const EnquiryProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('general');
  const [location, setLocation] = useState('');

  const openModal = (sourceType = 'general', buttonLocation = '') => {
    setSource(sourceType);
    setLocation(buttonLocation);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSource('general');
    setLocation('');
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, source, location, openModal, closeModal }}>
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiry must be used within an EnquiryProvider');
  }
  return context;
};