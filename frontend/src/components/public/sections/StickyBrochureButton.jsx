import { motion } from 'framer-motion';
import { FileDown, ArrowDownToLine } from 'lucide-react';
import { getThemeStyles } from '../../../utils/theme.js';
import { getFileUrl, analyticsAPI } from '../../../services/api.js';

const StickyBrochureButton = ({ property, theme = {} }) => {
  const { colors } = getThemeStyles(theme);
  const brochure = property.brochure;
  const brochureUrl = brochure?.url ? getFileUrl(brochure.url) : null;

  // Track brochure download click
  const handleBrochureClick = () => {
    if (property?._id) {
      analyticsAPI.trackCTA({
        propertyId: property._id,
        cta: 'downloadBrochure',
      }).catch(err => console.error('Analytics error:', err));
    }
  };

  // Don't render if no brochure
  if (!brochureUrl) return null;

  return (
    <>
      {/* CSS for animations */}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 5px ${colors.primary}40, 0 0 10px ${colors.primary}20; }
          50% { box-shadow: 0 0 15px ${colors.primary}60, 0 0 25px ${colors.primary}40; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          50% { background-position: 200% 0; }
          100% { background-position: 200% 0; }
        }
        .brochure-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        .shimmer-bg {
          background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%);
          background-size: 200% 200%;
          animation: shimmer 3s linear infinite;
        }
      `}</style>

      {/* Desktop - Compact Floating Button at Bottom Right */}
      <motion.a
        href={brochureUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBrochureClick}
        className="fixed bottom-8 right-6 z-40 hidden lg:flex items-center gap-2 group"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 1 }}
      >
        {/* Subtle pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: `2px solid ${colors.primary}` }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Button body */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white shadow-lg brochure-glow cursor-pointer shimmer-bg"
        >
          <ArrowDownToLine className="w-4 h-4" strokeWidth={2.5} />
          <span className="text-sm font-semibold whitespace-nowrap">Download Brochure</span>
        </motion.div>
      </motion.a>

      {/* Mobile - Floating Action Button */}
      <motion.a
        href={brochure.url}
        download
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBrochureClick}
        className="fixed bottom-20 right-4 z-40 lg:hidden flex flex-col items-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
      >
        {/* Label - on top, centered */}
        <motion.div
          className="mb-2 whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div
            className="text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              color: 'white',
            }}
          >
            <FileDown className="w-3 h-3" />
            Brochure
          </div>
        </motion.div>

        <motion.div className="relative">
          {/* Animated Rings */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `3px solid ${colors.primary}` }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${colors.secondary}` }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.6, 0, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.3,
            }}
          />

          {/* Main Button */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl relative"
            style={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            }}
          >
            {/* Glow Effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  `0 0 8px ${colors.primary}50`,
                  `0 0 20px ${colors.primary}70`,
                  `0 0 8px ${colors.primary}50`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Icon */}
            <ArrowDownToLine className="w-6 h-6" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </motion.a>
    </>
  );
};

export default StickyBrochureButton;