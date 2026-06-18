import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { leadsAPI } from '../../services/api.js';

const defaultContact = {
  phone: '+91 98765 43210',
  email: 'info@propertyhub.com',
  address: '123 Real Estate Tower, MG Road',
  city: 'Bangalore',
  state: 'Karnataka',
  pincode: '560001',
  workingHours: 'Mon - Sat, 9:00 AM - 7:00 PM',
};

const ContactSection = ({ contact }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = { ...defaultContact, ...(contact || {}) };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Contact Number is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit lead to backend with source 'contact-section'
      await leadsAPI.submit({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        message: formData.message || '',
        source: 'contact-section',
      });

      toast.success('Thank you! We will contact you shortly.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting lead:', error);
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 md:py-16 bg-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Side - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2 mb-6">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-slate-600 mb-8 max-w-lg">
              Tell us your requirements and our property experts will help you find the perfect home. We'll get back to you within 24 hours.
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Phone className="w-5 h-5 text-slate-700" />
                </motion.div>
                <div>
                  <h3 className="text-slate-800 font-semibold mb-1">Call Us</h3>
                  <p className="text-slate-500 text-sm">{contactInfo.workingHours}</p>
                  <a href={`tel:${contactInfo.phone?.replace(/\s/g, '')}`} className="text-slate-700 hover:text-amber-500 transition-colors font-medium">
                    {contactInfo.phone}
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Mail className="w-5 h-5 text-slate-700" />
                </motion.div>
                <div>
                  <h3 className="text-slate-800 font-semibold mb-1">Email Us</h3>
                  <p className="text-slate-500 text-sm">We reply within 24 hours</p>
                  <a href={`mailto:${contactInfo.email}`} className="text-slate-700 hover:text-amber-500 transition-colors font-medium">
                    {contactInfo.email}
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 cursor-default"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <MapPin className="w-5 h-5 text-slate-700" />
                </motion.div>
                <div>
                  <h3 className="text-slate-800 font-semibold mb-1">Visit Us</h3>
                  <p className="text-slate-500 text-sm">Our Office</p>
                  <p className="text-slate-800">
                    {contactInfo.address}
                    {contactInfo.city && <><br />{contactInfo.city}{contactInfo.state && `, ${contactInfo.state}`}{contactInfo.pincode && ` ${contactInfo.pincode}`}</>}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Contact Form (Dark) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-300/50"
          >
            <h3 className="text-xl font-bold text-white mb-6">
              Tell Us Your Requirements
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your Contact Number"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell us about your requirements..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full px-6 py-4 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Expert Help
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-slate-400 text-sm">
                By submitting, you agree to our{' '}
                <a href="/privacy-policy" className="text-amber-400 hover:text-amber-300 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;