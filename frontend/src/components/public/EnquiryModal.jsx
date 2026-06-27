import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle } from 'lucide-react';
import { useEnquiry } from '../../context/EnquiryContext.jsx';
import toast from 'react-hot-toast';
import { enquiriesAPI } from '../../services/api.js';

// EnquiryModal - handles general enquiries from main website
const EnquiryModal = () => {
  const { isOpen, source, closeModal } = useEnquiry();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
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

  // Dynamic content based on source
  const getModalContent = () => {
    const modals = {
      'home-loan': { title: 'Home Loan Assistance', subtitle: 'Get the best loan deals', button: 'Get Assistance' },
      'partner-with-us': { title: 'Partner With Us', subtitle: 'Let\'s discuss how we can help market your properties', button: 'Get Started' },
      'developer-contact': { title: 'Contact Us', subtitle: 'We\'ll get back to you within 24 hours', button: 'Send Message' },
      'developer-cta': { title: 'Get Started Today', subtitle: 'Join leading developers who trust us', button: 'Submit' },
      'general': { title: 'Enquire Now', subtitle: 'We\'ll get back to you soon', button: 'Submit' },
    };
    return modals[source] || modals['general'];
  };

  const modalContent = getModalContent();

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.length > 50) return 'Name must be less than 50 characters';
        return '';
      case 'phone':
        if (!value.trim()) return 'Contact number is required';
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length < 10 || digitsOnly.length > 15) {
          return 'Please enter a valid contact number';
        }
        return '';
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        return '';
      case 'message':
        if (value.length > 500) return 'Message must be less than 500 characters';
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.name = validateField('name', formData.name);
    newErrors.phone = validateField('phone', formData.phone);
    newErrors.email = validateField('email', formData.email);
    newErrors.message = validateField('message', formData.message);

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await enquiriesAPI.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        source: source,
      });

      setIsSuccess(true);
      toast.success('Thank you! We will contact you soon.');

      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setIsSuccess(false);
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      let message = error.response?.data?.message || 'Failed to submit. Please try again.';
      message = message.replace(/<[^>]*>/g, '');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '', message: '' });
    setErrors({});
    setIsSuccess(false);
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto overscroll-contain">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden overscroll-contain flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{modalContent.title}</h2>
                  <p className="text-slate-300 text-sm mt-1">{modalContent.subtitle}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {isSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name<sup className="text-red-500">*</sup>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Your name"
                      maxLength={50}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all hover:border-gray-400 ${errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-amber-500'}`}
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
                      onBlur={handleBlur}
                      placeholder="+91 98765 43210"
                      maxLength={15}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all hover:border-gray-400 ${errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-amber-500'}`}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email ID <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="your@email.com"
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all hover:border-gray-400 ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-amber-500'}`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Any specific requirements..."
                      rows={3}
                      maxLength={500}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-all resize-none hover:border-gray-400 ${errors.message ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-amber-500'}`}
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      modalContent.button
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-3">
                    By submitting, you agree to our Privacy Policy
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;