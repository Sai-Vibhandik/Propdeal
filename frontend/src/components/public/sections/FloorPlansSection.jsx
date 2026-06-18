import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';

const FloorPlansSection = ({ property, layout = 'carousel', theme = {}, bgVariant = 'white' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Get floor plans from multiple sources
  // 1. New: property.plans.floorPlans (project-level floor plans)
  // 2. Unit plans from pricingPlans
  // 3. Legacy: property.floorPlans
  const projectFloorPlans = property.plans?.floorPlans?.filter(fp => fp.url) || [];

  // Get unit plans from pricingPlans
  const unitPlans = (property.pricingPlans || [])
    .filter(p => p.unitPlan?.url)
    .map(p => ({
      url: p.unitPlan.url,
      publicId: p.unitPlan.publicId,
      configuration: p.configuration,
      size: p.size,
      price: p.price,
    }));

  // Legacy floor plans
  const legacyFloorPlans = (property.floorPlans || []).filter(fp => fp.image);

  // Combine all available plans
  const allFloorPlans = [...projectFloorPlans, ...unitPlans, ...legacyFloorPlans];

  // Remove duplicates based on URL
  const floorPlans = allFloorPlans.filter((plan, index, self) =>
    index === self.findIndex(p => p.url === plan.url)
  );

  const { colors, isDark } = getThemeStyles(theme);

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  if (!floorPlans.length) return null;

  const nextPlan = () => setCurrentIndex((prev) => (prev + 1) % floorPlans.length);
  const prevPlan = () => setCurrentIndex((prev) => (prev - 1 + floorPlans.length) % floorPlans.length);

  return (
    <section id="floorPlans" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>Floor Plans</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">Spacious & Well-Designed Layouts</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">Explore the thoughtfully designed floor plans for each configuration</p>
        </motion.div>

        {layout === 'carousel' && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={currentIndex} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.3 }} className="relative">
                  <img src={floorPlans[currentIndex].url} alt={floorPlans[currentIndex].configuration || floorPlans[currentIndex].title} className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                  {/* Navigation arrows - positioned higher on mobile to avoid overlap */}
                  {floorPlans.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={prevPlan}
                        className="absolute left-2 top-4 md:left-4 md:top-1/2 md:-translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:opacity-90 z-10 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={nextPlan}
                        className="absolute right-2 top-4 md:right-4 md:top-1/2 md:-translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:opacity-90 z-10 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </motion.button>
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8">
                    <div className="flex flex-wrap items-end justify-between gap-3 md:gap-4">
                      <div>
                        {floorPlans[currentIndex].configuration && (
                          <span className="text-white px-3 py-1 md:px-4 rounded-full text-sm font-medium" style={{ backgroundColor: colors.primary }}>{floorPlans[currentIndex].configuration}</span>
                        )}
                        {floorPlans[currentIndex].title && (
                          <span className="text-white px-3 py-1 md:px-4 rounded-full text-sm font-medium" style={{ backgroundColor: colors.primary }}>{floorPlans[currentIndex].title}</span>
                        )}
                        <div className="mt-2">
                          {floorPlans[currentIndex].size && <p className="text-white/80 text-sm">{floorPlans[currentIndex].size}</p>}
                          {floorPlans[currentIndex].price && <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mt-1">{floorPlans[currentIndex].price}</p>}
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowLightbox(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl hover:opacity-90 text-sm md:text-base cursor-pointer"
                      >
                        <ZoomIn className="w-4 h-4 md:w-5 md:h-5" /> View Full Size
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6">
              {floorPlans.map((plan, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentIndex(index)}
                  className="px-3 py-2 md:px-4 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={index === currentIndex ? { backgroundColor: colors.primary, color: '#fff' } : { backgroundColor: 'transparent', color: colors.primary }}
                >
                  {plan.configuration || plan.title || `Plan ${index + 1}`}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {layout === 'grid' && (
          <div className="flex flex-wrap justify-center gap-6">
            {floorPlans.map((plan, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`${cardBgClass} ${cardBorderClass} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] max-w-md`}>
                <div className="relative h-48">
                  <img src={plan.url} alt={plan.configuration || plan.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setCurrentIndex(index); setShowLightbox(true); }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </motion.button>
                </div>
                <div className="p-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>{plan.configuration || plan.title}</span>
                  <div className="mt-2 flex justify-between items-end">
                    <div>
                      {plan.size && <p className="text-sm text-gray-500 dark:text-gray-400">{plan.size}</p>}
                      {plan.price && <p className="text-xl font-bold text-gray-900 dark:text-white">{plan.price}</p>}
                    </div>
                    <motion.button
                      whileHover={{ x: 3 }}
                      className="font-medium text-sm hover:opacity-80 cursor-pointer"
                      style={{ color: colors.primary }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>
          <img src={floorPlans[currentIndex].url} alt={floorPlans[currentIndex].configuration || floorPlans[currentIndex].title} className="max-w-full max-h-[90vh] object-contain" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevPlan}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextPlan}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </motion.button>
        </div>
      )}
    </section>
  );
};

export default FloorPlansSection;