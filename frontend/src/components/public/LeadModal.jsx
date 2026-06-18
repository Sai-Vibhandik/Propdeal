import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, CheckCircle } from 'lucide-react';
import { useLead } from '../../context/LeadContext.jsx';
import { leadsAPI } from '../../services/api.js';
import { getThemeStyles } from '../../utils/theme.js';
import toast from 'react-hot-toast';

const LeadModal = () => {
  const { isOpen, property, source, closeModal } = useLead();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get theme colors
  const { colors } = getThemeStyles(property?.theme);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error('Please fill in your name and phone number');
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

      // Reset form after a delay
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '' });
        setIsSuccess(false);
        closeModal();
      }, 2000);
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', phone: '' });
    setIsSuccess(false);
    closeModal();
  };

  // Simple consistent heading for all CTAs since form is the same
  const modalTitle = 'Get in Touch';
  const modalSubtitle = 'Fill in your details and we\'ll get back to you';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5" style={{ backgroundColor: colors.primary }}>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
                  <p className="text-white/80 text-sm mt-1">{modalSubtitle}</p>
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
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-gray-300"
                      style={{ '--tw-ring-color': colors.primary }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-gray-300"
                      style={{ '--tw-ring-color': colors.primary }}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email (optional)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all hover:border-gray-300"
                      style={{ '--tw-ring-color': colors.primary }}
                    />
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
                        Submit Request
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