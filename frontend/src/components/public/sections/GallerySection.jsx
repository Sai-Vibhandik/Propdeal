import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Play, ArrowRight } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';
import { useLead } from '../../../context/LeadContext.jsx';

const GallerySection = ({ property, layout = 'grid', theme = {}, bgVariant = 'white' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const gallery = property.gallery || [];
  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  if (!gallery.length) return null;

  const nextImage = () => setSelectedIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setSelectedIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <section id="gallery" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>Gallery</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Visual Tour of {property.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">Explore the property through high-quality images</p>
        </motion.div>

        {layout === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => { setSelectedIndex(index); setShowLightbox(true); }}
                className={`cursor-pointer group relative overflow-hidden rounded-xl ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img src={getFileUrl(item.url)} alt={item.title} className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${index === 0 ? 'h-full min-h-[300px]' : 'h-48'}`} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-medium">{item.title}</p>
                </div>
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 ml-1 text-gray-900" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {layout === 'carousel' && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.img key={selectedIndex} src={getFileUrl(gallery[selectedIndex].url)} alt={gallery[selectedIndex].title} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.3 }} className="w-full h-[400px] md:h-[500px] object-cover" />
              </AnimatePresence>
            </div>
            {gallery.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 shadow-lg rounded-full flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </motion.button>
              </>
            )}
            <div className="flex justify-center gap-2 mt-4">
              {gallery.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all cursor-pointer ${index === selectedIndex ? 'w-8' : ''}`}
                  style={index === selectedIndex ? { backgroundColor: colors.primary } : { backgroundColor: '#9ca3af' }}
                />
              ))}
            </div>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLightbox(true)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 font-semibold rounded-xl hover:opacity-80 transition-all cursor-pointer"
              style={{ borderColor: colors.primary, color: colors.primary }}
            >
              View All {gallery.length} Images
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openModal(property, 'cta-visit')}
              className="cta-bounce-shine inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
              style={{ backgroundColor: colors.primary }}
            >
              Book Your Visit
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center z-10 cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </motion.button>
          <AnimatePresence mode="wait">
            <motion.img key={selectedIndex} src={getFileUrl(gallery[selectedIndex].url)} alt={gallery[selectedIndex].title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[90vw] max-h-[90vh] object-contain" />
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </motion.button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
            <p className="font-medium">{gallery[selectedIndex].title}</p>
            <p className="text-sm text-gray-400">{selectedIndex + 1} / {gallery.length}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;