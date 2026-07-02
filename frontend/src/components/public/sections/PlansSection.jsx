import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Layers, Maximize, Home, ZoomIn, X, ArrowRight, FileText } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';
import { useLead } from '../../../context/LeadContext.jsx';

const PLANS_VIEW_SOURCE = 'cta-plans-view';

const PlansSection = ({ property, theme = {}, bgVariant = 'white' }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Check if user has already submitted lead for viewing plans
  const hasSubmittedPlansLead = () => {
    if (!property?._id) return false;
    const key = `lead_submitted_${property._id}_${PLANS_VIEW_SOURCE}`;
    return sessionStorage.getItem(key) === 'true';
  };

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  // Collect all plans from different sources
  const plans = [];

  // 1. Master Plan
  if (property.plans?.masterPlan?.url) {
    plans.push({
      type: 'master',
      title: property.plans.masterPlan.title || 'Master Plan',
      subtitle: 'Project Layout',
      url: getFileUrl(property.plans.masterPlan.url),
      publicId: property.plans.masterPlan.publicId,
      icon: Map,
    });
  }

  // 2. Floor Plans (project-level)
  if (property.plans?.floorPlans?.length > 0) {
    property.plans.floorPlans.forEach((fp, index) => {
      if (fp.url) {
        plans.push({
          type: 'floor',
          title: fp.title || `Floor Plan ${index + 1}`,
          subtitle: fp.floorNumber || `Level ${index + 1}`,
          url: getFileUrl(fp.url),
          publicId: fp.publicId,
          icon: Layers,
        });
      }
    });
  }

  // 3. Dimension Plans
  if (property.plans?.dimensionPlans?.length > 0) {
    property.plans.dimensionPlans.forEach((dp, index) => {
      if (dp.url) {
        plans.push({
          type: 'dimension',
          title: dp.title || `Dimension Plan ${index + 1}`,
          subtitle: dp.dimensions || '',
          url: getFileUrl(dp.url),
          publicId: dp.publicId,
          icon: Maximize,
        });
      }
    });
  }

  // Note: Unit Plans are shown in PricingSection, not here

  // Don't render if no plans available
  if (plans.length === 0) return null;

  const openLightbox = (plan) => {
    // Check if user has submitted lead for viewing plans
    if (hasSubmittedPlansLead()) {
      setSelectedPlan(plan);
      setShowLightbox(true);
    } else {
      // Open lead form first, then show lightbox after successful submission
      openModal(property, PLANS_VIEW_SOURCE, () => {
        setSelectedPlan(plan);
        setShowLightbox(true);
      });
    }
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPlan(null);
  };

  const navigatePlan = (direction) => {
    if (!selectedPlan) return;
    const currentIndex = plans.findIndex(p => p.url === selectedPlan.url);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % plans.length;
    } else {
      newIndex = (currentIndex - 1 + plans.length) % plans.length;
    }
    setSelectedPlan(plans[newIndex]);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go next
        navigatePlan('next');
      } else {
        // Swiped right - go previous
        navigatePlan('prev');
      }
    }
    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>
            Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            Project Layouts & Plans
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            Explore the detailed plans including master layout, floor plans, and dimensions
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <motion.div
                key={`${plan.type}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${cardBgClass} ${cardBorderClass} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group cursor-pointer`}
                onClick={() => openLightbox(plan)}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={plan.url}
                    alt={plan.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-md flex items-center gap-1"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <IconComponent className="w-3 h-3" />
                      {plan.type === 'master' ? 'Master' : plan.type === 'floor' ? 'Floor' : plan.type === 'unit' ? 'Unit' : 'Dimension'}
                    </span>
                  </div>
                  {/* Zoom Icon */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                      <ZoomIn className="w-5 h-5 text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                    {plan.title}
                  </h3>
                  {plan.subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {plan.subtitle}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">Want detailed floor plans and layout options?</p>
          <button
            onClick={() => openModal(property, 'cta-plans')}
            className="cta-bounce-shine inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: colors.primary }}
          >
            <FileText className="w-5 h-5" />
            Get Complete Plans
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      {showLightbox && selectedPlan && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity z-10"
          >
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Navigation Arrows - Hidden on mobile */}
          {plans.length > 1 && (
            <>
              <button
                onClick={() => navigatePlan('prev')}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full items-center justify-center hover:opacity-80 transition-opacity z-10"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigatePlan('next')}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full items-center justify-center hover:opacity-80 transition-opacity z-10"
              >
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Swipe indicator on mobile */}
          {plans.length > 1 && (
            <div className="absolute bottom-24 md:hidden left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              <span>Swipe to navigate</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )}

          {/* Image */}
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedPlan.url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              src={selectedPlan.url}
              alt={selectedPlan.title}
              className="max-w-full max-h-[85vh] object-contain"
            />
          </AnimatePresence>

          {/* Image Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-gray-800/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg max-w-[90%] sm:max-w-none">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <selectedPlan.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: colors.primary }} />
              <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{selectedPlan.title}</span>
              {selectedPlan.subtitle && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{selectedPlan.subtitle}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PlansSection;