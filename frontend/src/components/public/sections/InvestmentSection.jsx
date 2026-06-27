import { motion } from 'framer-motion';
import { TrendingUp, Percent, Building2, MapPin, CheckCircle, ArrowUpRight, Shield, Clock, Wallet, ArrowRight } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { useLead } from '../../../context/LeadContext.jsx';

const InvestmentSection = ({ property, layout = 'cards', theme = {}, bgVariant = 'white' }) => {
  const content = property.generatedContent?.investment || {};
  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  // Default benefits if AI content is missing or empty
  const defaultBenefits = [
    'High rental yield due to prime location',
    'Strong appreciation potential',
    'Excellent social infrastructure',
    'Growing demand in the area',
    'Well-connected to major hubs',
  ];

  // Ensure benefits is always an array with multiple items
  const benefits = Array.isArray(content.benefits) && content.benefits.length > 0
    ? content.benefits
    : defaultBenefits;

  // If benefits array has only 1-2 items, supplement with defaults
  const displayBenefits = benefits.length < 3
    ? [...benefits, ...defaultBenefits.slice(0, 5 - benefits.length)]
    : benefits;

  const investmentMetrics = [
    { icon: TrendingUp, label: 'Capital Growth', value: '15-20%', color: 'emerald' },
    { icon: Percent, label: 'Rental Yield', value: '3.5-4%', color: 'blue' },
    { icon: Building2, label: 'Demand Score', value: 'High', color: 'amber' },
    { icon: MapPin, label: 'Location Rating', value: '9.2/10', color: 'purple' },
  ];

  return (
    <section id="investment" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>
            Investment
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            Why Invest in {property.name}?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            A smart investment opportunity with excellent returns and growth potential
          </p>
        </motion.div>

        {/* Investment Metrics - Full Width */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {investmentMetrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                className={`${cardBgClass} ${cardBorderClass} rounded-2xl p-5 md:p-6 text-center shadow-sm hover:shadow-lg transition-all cursor-pointer`}
              >
                <div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: colors.primary }} />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-1">{item.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{item.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Key Benefits - Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${cardBgClass} ${cardBorderClass} rounded-2xl p-6 md:p-8 shadow-sm mb-6`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <CheckCircle className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Key Benefits</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {displayBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01, x: 5 }}
                className={`flex items-start gap-3 p-3 md:p-4 rounded-xl cursor-pointer ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${colors.accent}20` }}
                >
                  <svg className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Future Growth & Rental Potential - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Future Growth */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${cardBgClass} ${cardBorderClass} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${colors.secondary}20` }}
              >
                <ArrowUpRight className="w-5 h-5" style={{ color: colors.secondary }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Future Growth</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
              {content.futureGrowth || 'Expected 15-20% appreciation over the next 3-5 years due to infrastructure growth and connectivity.'}
            </p>
          </motion.div>

          {/* Rental Potential */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${cardBgClass} ${cardBorderClass} rounded-2xl p-6 shadow-sm`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${colors.primary}15` }}
              >
                <Wallet className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Rental Potential</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
              {content.rentalPotential || '3-4% rental yield with strong demand from professionals and families.'}
            </p>
          </motion.div>
        </div>

        {/* Quick Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className={`${cardBgClass} ${cardBorderClass} rounded-xl p-4 shadow-sm text-center`}>
            <Clock className="w-5 h-5 mx-auto mb-2 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Possession</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {property.possessionDate
                ? new Date(property.possessionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                : property.category?.replace(/-/g, ' ') || 'On Schedule'}
            </p>
          </div>
          <div className={`${cardBgClass} ${cardBorderClass} rounded-xl p-4 shadow-sm text-center`}>
            <MapPin className="w-5 h-5 mx-auto mb-2 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {property.address?.locality || property.address?.city || 'Prime Location'}
            </p>
          </div>
          <div className={`${cardBgClass} ${cardBorderClass} rounded-xl p-4 shadow-sm text-center`}>
            <Shield className="w-5 h-5 mx-auto mb-2 text-gray-400" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">RERA</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {property.reraNumber || 'Registered'}
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Want to know more about investment potential?
          </p>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openModal(property, 'cta-investment')}
            className="cta-bounce-shine inline-flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            style={{ backgroundColor: colors.primary }}
          >
            Get Investment Analysis
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentSection;