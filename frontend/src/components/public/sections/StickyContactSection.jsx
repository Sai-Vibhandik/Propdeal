import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { useLead } from '../../../context/LeadContext.jsx';
import { getThemeStyles } from '../../../utils/theme.js';

const StickyContactSection = ({ property, theme = {} }) => {
  const { openModal } = useLead();
  const { colors, isDark } = getThemeStyles(theme);

  const handleGetDetails = () => openModal(property, 'cta-price');

  return (
    <>
      {/* Sticky Bottom Bar - Mobile Only */}
      <div className={`fixed bottom-0 left-0 right-0 border-t shadow-2xl z-40 md:hidden ${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            {property.priceRange?.max && property.priceRange?.max !== property.priceRange?.min ? (
              <>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Price Range
                </p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{property.priceRange?.min} {property.priceRange?.minUnit === 'cr' ? 'Cr' : 'Lac'} - ₹{property.priceRange.max} {property.priceRange?.maxUnit === 'cr' ? 'Cr' : 'Lac'}
                </p>
              </>
            ) : (
              <>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Starting from
                </p>
                <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ₹{property.priceRange?.min} {property.priceRange?.minUnit === 'cr' ? 'Cr' : 'Lac'}
                </p>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {property.branding?.phoneNumber && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${property.branding.phoneNumber}`}
                className={`px-4 py-2 font-semibold rounded-lg hover:opacity-90 cursor-pointer ${
                  isDark
                    ? 'bg-gray-700 text-gray-200'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Phone className="w-5 h-5" />
              </motion.a>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetDetails}
              className="px-4 py-2 text-white font-semibold rounded-lg hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: colors.primary }}
            >
              Get Details
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StickyContactSection;