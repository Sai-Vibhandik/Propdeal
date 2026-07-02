import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, CheckCircle } from 'lucide-react';
import { useLead } from '../../context/LeadContext.jsx';
import { leadsAPI } from '../../services/api.js';
import { getThemeStyles } from '../../utils/theme.js';
import toast from 'react-hot-toast';

const LeadModal = () => {
  const { isOpen, property, source, closeModal, onSuccess } = useLead();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Get theme colors
  const { colors } = getThemeStyles(property?.theme);

  // Generate scrollbar thumb color style based on theme
  const scrollbarStyle = `
    .lead-modal-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .lead-modal-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .lead-modal-scroll::-webkit-scrollbar-thumb {
      background: ${colors.primary}40;
      border-radius: 4px;
    }
    .lead-modal-scroll::-webkit-scrollbar-thumb:hover {
      background: ${colors.primary}60;
    }
  `;

  // Dynamic content based on CTA source
  // Group sources by modal content for consistent UX while tracking exact source
  const getModalContent = () => {
    // Book Site Visit - All visit-related buttons
    const visitSources = ['cta-hero-visit', 'cta-gallery-visit', 'cta-footer-visit', 'cta-video-visit', 'cta-visit'];
    if (visitSources.includes(source)) {
      return { title: 'Book Site Visit', subtitle: 'Schedule your visit', button: 'Book Visit' };
    }

    // Get Details - General enquiry buttons
    const detailsSources = ['cta-hero', 'cta-highlights', 'cta-overview', 'cta-investment', 'cta-navbar', 'cta-sticky'];
    if (detailsSources.includes(source)) {
      return { title: 'Get Details', subtitle: 'We\'ll contact you soon', button: 'Get Details' };
    }

    // Get Price Details - Pricing-related buttons
    const priceSources = ['cta-pricing-table', 'cta-pricing-sheet', 'cta-pricing-card', 'cta-price'];
    if (priceSources.includes(source)) {
      return { title: 'Get Price Details', subtitle: 'Complete price breakdown', button: 'Get Price' };
    }

    // Other unique sources
    const uniqueModals = {
      'cta-plans': { title: 'Get Floor Plans', subtitle: 'Detailed layout options', button: 'Get Plans' },
      'cta-plans-view': { title: 'View Floor Plans', subtitle: 'Enter details to view plans', button: 'View Plans' },
      'cta-unit-plans-view': { title: 'View Unit Plans', subtitle: 'Enter details to view unit plans', button: 'View Plans' },
      'cta-callback': { title: 'Request Callback', subtitle: 'Expert will call you soon', button: 'Request Callback' },
      'cta-faq': { title: 'Schedule a Call', subtitle: 'Expert will call you soon', button: 'Schedule Call' },
      'cta-amenities': { title: 'Get Amenities Info', subtitle: 'Learn about amenities', button: 'Get Info' },
      'cta-homeloan': { title: 'Home Loan Assistance', subtitle: 'Get best loan offers', button: 'Get Assistance' },
      'contact-section': { title: 'Contact Us', subtitle: 'We\'re here to help', button: 'Send Message' },
    };

    return uniqueModals[source] || { title: 'Get Details', subtitle: 'We\'ll contact you soon', button: 'Submit' };
  };

  const modalContent = getModalContent();

  // Validation function
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Contact Number is required';
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) return 'Please enter a valid contact number';
        return '';
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For phone field, only allow digits and common formatting characters
    let filteredValue = value;
    if (name === 'phone') {
      filteredValue = value.replace(/[^0-9+\-\s]/g, '');
    }
    setFormData((prev) => ({ ...prev, [name]: filteredValue }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    const nameError = validateField('name', formData.name);
    const phoneError = validateField('phone', formData.phone);
    const emailError = validateField('email', formData.email);

    if (nameError) newErrors.name = nameError;
    if (phoneError) newErrors.phone = phoneError;
    if (emailError) newErrors.email = emailError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await leadsAPI.submit({
        propertyId: property?._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: source,
      });

      setIsSuccess(true);
      toast.success('Thank you! We will contact you soon.');

      // Mark this source as submitted in sessionStorage
      if (property?._id && source) {
        const submittedKey = `lead_submitted_${property._id}_${source}`;
        sessionStorage.setItem(submittedKey, 'true');
      }

      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' });
        setErrors({});
        setIsSuccess(false);
        closeModal();
        onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      let message = error.response?.data?.message || 'Failed to submit. Please try again.';
      // Strip HTML tags from error message
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
    setIsSuccess(false);
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto overscroll-contain lead-modal-scroll"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: `${colors.primary}40 transparent`,
              overscrollBehavior: 'contain',
            }}
          >
            <style>{scrollbarStyle}</style>
            {/* Header */}
            <div className="px-6 py-5" style={{ backgroundColor: colors.primary }}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{modalContent.title}</h2>
                  <p className="text-white/80 text-sm mt-1">{modalContent.subtitle}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              {property && (
                <div className="mt-3 pt-3 border-t border-white/20">
                  <p className="text-white font-medium">{property.name}</p>
                  <p className="text-white/70 text-sm">{property.address?.locality}, {property.address?.city}</p>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="p-6">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.primary}20` }}>
                    <CheckCircle className="w-8 h-8" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">We've received your request and will contact you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      maxLength={50}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-gray-300 ${
                        errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      style={{ '--tw-ring-color': errors.name ? undefined : colors.primary }}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your contact number"
                      maxLength={15}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-gray-300 ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      style={{ '--tw-ring-color': errors.phone ? undefined : colors.primary }}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email (optional)"
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-gray-300 ${
                        errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      style={{ '--tw-ring-color': errors.email ? undefined : colors.primary }}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {modalContent.button}
                      </>
                    )}
                  </motion.button>
                </form>
              )}

              {/* Phone Call Option */}
              {!isSuccess && property?.branding?.phoneNumber && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-center text-gray-500 text-sm mb-2">Or call us directly</p>
                  <motion.a
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${property.branding.phoneNumber}`}
                    className="flex items-center justify-center gap-2 font-medium transition-colors cursor-pointer"
                    style={{ color: colors.primary }}
                  >
                    <Phone className="w-5 h-5" />
                    <span>{property.branding.phoneNumber}</span>
                  </motion.a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;