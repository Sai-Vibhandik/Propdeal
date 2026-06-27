import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';

const defaultFAQs = [
  {
    question: 'How do I schedule a property visit?',
    answer: 'You can schedule a property visit by clicking the "Schedule Visit" button on any property page. Fill in your preferred date and time, and our team will coordinate with the builder to arrange the visit. You will receive a confirmation call within 24 hours.',
  },
  {
    question: 'Are all properties RERA registered?',
    answer: 'Yes, all properties listed on PropertyHub are RERA registered. We verify the RERA registration number for every property before listing. You can view the RERA details on each property page, including the registration number and project status.',
  },
  {
    question: 'What documents do I need to buy a property?',
    answer: 'The basic documents required include identity proof (Aadhaar/PAN), address proof, income proof (salary slips/ITR), and bank statements for the last 6 months. For home loans, additional documents may be required. Our team will guide you through the complete documentation process.',
  },
  {
    question: 'Are the property prices negotiable?',
    answer: 'Property prices on PropertyHub are direct builder prices. While some flexibility exists depending on the builder and market conditions, we ensure you get the best possible price without any hidden charges. We negotiate on your behalf to get you the best deal.',
  },
  {
    question: 'How long does the property buying process take?',
    answer: 'The typical property buying process takes 30-60 days from booking to registration, depending on the property type and payment mode. Ready-to-move properties can be faster, while under-construction properties may vary. We assist you at every step to ensure a smooth process.',
  },
  {
    question: 'Do you provide home loan assistance?',
    answer: 'Yes, we have partnerships with leading banks and financial institutions. We can help you compare home loan interest rates, process your loan application, and get the best deals. Our loan assistance is completely free of charge.',
  },
];

const FAQSection = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState(-1);
  const { content } = useSiteContent();

  const displayFaqs = faqs?.length > 0
    ? faqs.filter(f => f.isActive !== false)
    : defaultFAQs;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  // Get contact info from context for the CTA
  const contactInfo = content?.contact || {};

  return (
    <section id="faq" className="py-12 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Everything you need to know about buying a property with us.
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="cursor-pointer"
            >
              <div
                className={`bg-slate-50 rounded-xl overflow-hidden shadow-sm transition-all ${
                  openIndex === index ? 'ring-2 ring-slate-700 shadow-md' : 'hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-slate-100 transition-colors rounded-xl"
                >
                  <h3 className="font-semibold text-slate-800 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 flex-shrink-0`}
                    />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5">
                        <p className="text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-600 mb-4">
            Still have questions? We're here to help.
          </p>
          <motion.a
            href={`tel:${contactInfo.phone || '+919876543210'}`}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 active:bg-slate-900 transition-all cursor-pointer"
          >
            Call us at {contactInfo.phone || '+91 98765 43210'}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;