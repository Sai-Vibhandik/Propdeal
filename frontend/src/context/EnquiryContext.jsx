import { createContext, useContext, useState } from 'react';

const EnquiryContext = createContext(null);

export const EnquiryProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState('general');

  const openModal = (sourceType = 'general') => {
    setSource(sourceType);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSource('general');
  };

  return (
    <EnquiryContext.Provider value={{ isOpen, source, openModal, closeModal }}>
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