import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { useLead } from '../../../context/LeadContext.jsx';

const defaultFAQs = [
  { question: 'What is the possession date?', answer: 'The possession date varies by configuration. Please contact our sales team for specific timelines.' },
  { question: 'What configurations are available?', answer: 'We offer various configurations to suit different family sizes. Contact us for detailed floor plans and pricing.' },
  { question: 'Is the property RERA registered?', answer: 'Yes, the property is RERA registered. All legal documents are verified.' },
  { question: 'What amenities are included?', answer: 'The property features premium amenities including clubhouse, swimming pool, gymnasium, landscaped gardens, and 24/7 security.' },
  { question: 'Are home loans available?', answer: 'Yes, we have tie-ups with leading banks for home loans at competitive interest rates. Our team can assist you with the process.' },
];

const PropertyFAQSection = ({ property, layout = 'accordion', theme = {}, bgVariant = 'white' }) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const faqs = property.generatedContent?.faq?.length > 0 ? property.generatedContent.faq : defaultFAQs;
  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? -1 : index);

  return (
    <section id="faq" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3">Everything you need to know about {property.name}</p>
        </motion.div>

        {layout === 'accordion' && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className={`${cardBgClass} ${cardBorderClass} rounded-xl overflow-hidden transition-all cursor-pointer`} style={openIndex === index ? { boxShadow: `0 0 0 2px ${colors.primary}` } : {}}>
                  <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between p-5 text-left cursor-pointer">
                    <h3 className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</h3>
                    <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <div className="px-5 pb-5">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {layout === 'grid' && (
          <div className="grid md:grid-cols-2 gap-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -3 }}
                className={`${cardBgClass} ${cardBorderClass} rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all`}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions? We're here to help.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {property.branding?.phoneNumber && (
              <motion.a
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={`tel:${property.branding.phoneNumber}`}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 font-semibold rounded-xl hover:opacity-80 transition-all cursor-pointer"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                <Phone className="w-4 h-4" />
                {property.branding.phoneNumber}
              </motion.a>
            )}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal(property, 'cta-faq')}
              className="cta-bounce-shine inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              style={{ backgroundColor: colors.primary }}
            >
              Schedule a Call
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyFAQSection;