import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Ruler, IndianRupee, FileText, X, ZoomIn } from 'lucide-react';
import { useLead } from '../../../context/LeadContext.jsx';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

const UNIT_PLANS_VIEW_SOURCE = 'cta-unit-plans-view';

const PricingSection = ({ property, layout = 'cards', theme = {}, bgVariant = 'white' }) => {
  // Use pricingPlans (new) or fall back to floorPlans (legacy)
  const pricingPlans = property.pricingPlans?.length > 0
    ? property.pricingPlans
    : property.floorPlans || [];

  // Price includes - from property data or defaults
  const priceIncludes = property.priceIncludes?.length > 0
    ? property.priceIncludes
    : ['Car Parking', 'Clubhouse Membership', 'Power Backup Setup', 'Maintenance (1 Year)', 'All Statutory Charges', 'Registration Support', 'Interior Consultation', 'Home Loan Assistance'];

  const { openModal } = useLead();
  const { colors, isDark } = getThemeStyles(theme);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);

  // Check if user has already submitted lead for viewing unit plans
  const hasSubmittedUnitPlansLead = () => {
    if (!property?._id) return false;
    const key = `lead_submitted_${property._id}_${UNIT_PLANS_VIEW_SOURCE}`;
    return sessionStorage.getItem(key) === 'true';
  };

  // Open lightbox with image - requires lead form first
  const openLightbox = (imageUrl, configuration) => {
    // Check if user has submitted lead for viewing unit plans
    if (hasSubmittedUnitPlansLead()) {
      setSelectedImage(imageUrl);
      setSelectedConfig(configuration);
      setLightboxOpen(true);
    } else {
      // Open lead form first, then show lightbox after successful submission
      openModal(property, UNIT_PLANS_VIEW_SOURCE, () => {
        setSelectedImage(imageUrl);
        setSelectedConfig(configuration);
        setLightboxOpen(true);
      });
    }
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    setSelectedConfig(null);
  };

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  return (
    <section id="pricing" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            Price List & Configuration
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            Transparent pricing with no hidden charges. Choose the perfect home for your budget.
          </p>
        </motion.div>

        {layout === 'table' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${cardBgClass} ${cardBorderClass} rounded-2xl shadow-lg overflow-hidden`}
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: colors.primary }}>
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-white whitespace-nowrap">Configuration</th>
                    <th className="px-6 py-4 text-left font-semibold text-white whitespace-nowrap">Size</th>
                    <th className="px-6 py-4 text-left font-semibold text-white whitespace-nowrap">Price Range</th>
                    <th className="px-6 py-4 text-center font-semibold text-white whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingPlans.map((plan, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <td className="px-6 py-5 font-semibold text-gray-900 dark:text-white">{plan.configuration}</td>
                      <td className="px-6 py-5 text-gray-600 dark:text-gray-300">{plan.size}</td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-lg" style={{ color: colors.primary }}>{plan.price}</span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05, x: 3 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(property, 'cta-pricing-table')}
                          className="inline-flex items-center gap-1 font-medium hover:opacity-80 cursor-pointer"
                          style={{ color: colors.primary }}
                        >
                          Get Details
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {layout === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => {
              const hasImage = plan.unitPlan?.url || plan.image;
              const imageUrl = hasImage ? getFileUrl(plan.unitPlan?.url || plan.image) : null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${cardBgClass} ${cardBorderClass} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group`}
                >
                  {/* Unit Plan Image */}
                  <div
                    className={`relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden ${hasImage ? 'cursor-pointer' : ''}`}
                    onClick={() => hasImage && openLightbox(imageUrl, plan.configuration)}
                  >
                    {hasImage ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={plan.configuration}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Zoom Icon Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.primary}15` }}>
                            <Ruler className="w-8 h-8" style={{ color: colors.primary }} />
                          </div>
                          <p className="text-sm text-gray-400 dark:text-gray-500">Unit Plan</p>
                        </div>
                      </div>
                    )}
                    {/* Configuration Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 rounded-full text-sm font-semibold text-white shadow-md" style={{ backgroundColor: colors.primary }}>
                        {plan.configuration}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Typology Name */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                      {plan.configuration}
                    </h3>

                    {/* Carpet Area */}
                    <div className="flex items-center gap-2 mb-2">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Carpet Area</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{plan.size}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-4">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                      <span className="text-xl font-bold" style={{ color: colors.primary }}>{plan.price}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openModal(property, 'cta-pricing-sheet')}
                        className="flex-1 py-2.5 px-4 text-white font-semibold rounded-xl hover:opacity-90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <FileText className="w-4 h-4" />
                        Price Sheet
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openModal(property, 'cta-pricing-card')}
                        className="flex-1 py-2.5 px-4 border-2 font-semibold rounded-xl hover:opacity-80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        style={{ borderColor: colors.primary, color: colors.primary }}
                      >
                        Get Details
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Image Lightbox */}
        {lightboxOpen && selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity z-10 cursor-pointer"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </motion.button>

            {/* Image Container */}
            <div className="max-w-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt={selectedConfig}
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>

            {/* Configuration Badge */}
            {selectedConfig && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 px-6 py-3 rounded-full shadow-lg">
                <span className="font-semibold text-gray-900 dark:text-white">{selectedConfig}</span>
              </div>
            )}
          </div>
        )}

        {/* Price Includes */}
        {priceIncludes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mt-8 ${cardBgClass} ${cardBorderClass} rounded-2xl p-6 shadow-sm`}
          >
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Price Includes:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {priceIncludes.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: colors.accent }} />
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Need a custom payment plan? We offer flexible payment options.</p>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal(property, 'cta-callback')}
            className="cta-bounce-shine inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            style={{ backgroundColor: colors.primary }}
          >
            Talk to Our Expert
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;