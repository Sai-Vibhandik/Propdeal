import { motion } from 'framer-motion';
import { CheckCircle, Building2, MapPin, Calendar, Layers, Ruler, Compass, Warehouse, ArrowRight } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { formatDate } from '../../../utils/formatters.js';
import { getFileUrl } from '../../../services/api.js';
import { useLead } from '../../../context/LeadContext.jsx';

const defaultOverview = {
  description: 'Experience exceptional living at this premium property. Thoughtfully designed with modern amenities and quality construction.',
  keyPoints: [
    'Strategic location with excellent connectivity',
    'Modern amenities for contemporary lifestyle',
    'Quality construction with premium materials',
    'Spacious and well-ventilated units',
    'Landscaped gardens and green spaces',
    '24/7 security with CCTV surveillance',
  ],
};

const OverviewSection = ({ property, layout = 'standard', theme = {}, bgVariant = 'white' }) => {
  const aiContent = property.generatedContent?.overview || {};
  const content = {
    description: aiContent.description || defaultOverview.description,
    keyPoints: aiContent.keyPoints?.length > 0 ? aiContent.keyPoints : defaultOverview.keyPoints,
  };

  const sectionBg = property.sectionBackgrounds?.overview || { image: '', layout: 'background' };
  const bgImage = sectionBg.image ? getFileUrl(sectionBg.image) : '';
  const bgLayout = sectionBg.layout || 'background';

  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  const quickFacts = [
    { icon: Building2, label: 'Property Type', value: property.propertyType ? property.propertyType.charAt(0).toUpperCase() + property.propertyType.slice(1).replace(/-/g, ' ') : 'Apartment' },
  ];

  if (property.unitAreaRange?.min && property.unitAreaRange?.max) {
    quickFacts.push({
      icon: Ruler,
      label: 'Unit Size',
      value: `${property.unitAreaRange.min.toLocaleString()} - ${property.unitAreaRange.max.toLocaleString()} ${property.unitAreaRange?.unit || 'sq.ft.'}`,
    });
  }

  if (property.configurations?.length > 0) {
    quickFacts.push({ icon: Layers, label: 'Configurations', value: property.configurations.join(', ') });
  }

  quickFacts.push({ icon: Calendar, label: 'Possession Date', value: property.possessionDate ? formatDate(property.possessionDate, { year: 'numeric', month: 'long' }) : property.category?.replace(/-/g, ' ') || 'Under Construction' });

  // Additional facts based on property type
  const additionalFacts = [];

  if (property.plotFacing) {
    additionalFacts.push({ icon: Compass, label: 'Plot Facing', value: property.plotFacing.charAt(0).toUpperCase() + property.plotFacing.slice(1) });
  }

  if (property.builtUpArea) {
    additionalFacts.push({ icon: Warehouse, label: 'Built-up Area', value: property.builtUpArea });
  }

  // Custom fields
  const customFields = property.customFields || [];

  const renderContent = (isWhiteText = false) => (
    <>
      <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: isWhiteText ? '#fff' : colors.secondary }}>
        About the Property
      </span>
      <h2 className={`text-3xl md:text-4xl font-bold mt-2 mb-6 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        {property.name}
      </h2>
      <p className={`text-lg leading-relaxed mb-6 text-justify ${isWhiteText ? 'text-gray-200' : 'text-gray-600 dark:text-gray-300'}`}>
        {content.description}
      </p>
      {content.keyPoints && content.keyPoints.length > 0 && (
        <div className="space-y-3">
          {content.keyPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: isWhiteText ? colors.accent : colors.accent }} />
              <span className={isWhiteText ? 'text-gray-200' : 'text-gray-700 dark:text-gray-300'}>{point}</span>
            </motion.div>
          ))}
        </div>
      )}
    </>
  );

  const renderQuickFacts = (isWhiteText = false) => (
    <div className={`rounded-2xl p-4 md:p-6 lg:p-8 ${isWhiteText ? 'bg-white/10 backdrop-blur-sm' : `${cardBgClass} ${cardBorderClass}`}`}>
      <h3 className={`text-lg md:text-xl font-bold mb-4 md:mb-6 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>Quick Facts</h3>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {quickFacts.map((fact, index) => {
          const Icon = fact.icon;
          return (
            <motion.div
              key={fact.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-3 md:p-4 shadow-sm ${isWhiteText ? 'bg-white/10' : `${cardBgClass} ${cardBorderClass}`}`}
            >
              <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: isWhiteText ? colors.secondary : colors.primary }} />
                <p className={`text-xs md:text-sm font-medium ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{fact.label}</p>
              </div>
              <p className={`font-semibold text-sm md:text-base break-words pl-6 md:pl-7 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{fact.value}</p>
            </motion.div>
          );
        })}

        {/* Learn More CTA as 4th card */}
        <motion.button
          key="learn-more-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: quickFacts.length * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openModal(property, 'cta-overview')}
          className={`col-span-2 md:col-span-1 rounded-xl p-2 md:p-4 shadow-sm flex flex-row md:flex-col items-center justify-center gap-1.5 md:gap-2 text-white font-medium md:font-semibold cursor-pointer hover:opacity-90 transition-opacity`}
          style={{ backgroundColor: colors.primary, minHeight: '48px' }}
        >
          <span className="text-xs md:text-base">Learn More</span>
          <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </motion.button>
      </div>

      {/* Additional Facts (Facing, Built-up Area) */}
      {additionalFacts.length > 0 && (
        <div className={`grid grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4`}>
          {additionalFacts.map((fact, index) => {
            const Icon = fact.icon;
            return (
              <motion.div
                key={fact.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (quickFacts.length + index) * 0.1 }}
                className={`rounded-xl p-3 md:p-4 shadow-sm ${isWhiteText ? 'bg-white/10' : `${cardBgClass} ${cardBorderClass}`}`}
              >
                <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: isWhiteText ? colors.secondary : colors.primary }} />
                  <p className={`text-xs md:text-sm font-medium ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{fact.label}</p>
                </div>
                <p className={`font-semibold text-sm md:text-base break-words pl-6 md:pl-7 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{fact.value}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className={`mt-4 md:mt-6 pt-4 md:pt-6 ${isWhiteText ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'} border-t`}>
        <div className={`flex justify-between mb-2 md:mb-3 ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
          <span className="text-sm md:text-base">Total Land Area</span>
          <span className={`font-semibold text-sm md:text-base ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{property.totalArea || '-'}</span>
        </div>
        {property.totalUnits && (
          <div className={`flex justify-between mb-2 md:mb-3 ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="text-sm md:text-base">Number of Units</span>
            <span className={`font-semibold text-sm md:text-base ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{property.totalUnits}</span>
          </div>
        )}
        {property.totalFloors && (
          <div className={`flex justify-between mb-2 md:mb-3 ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="text-sm md:text-base">Number of Floors</span>
            <span className={`font-semibold text-sm md:text-base ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{property.totalFloors}</span>
          </div>
        )}
        {property.reraNumber && (
          <div className={`flex justify-between mb-2 md:mb-3 ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
            <span className="text-sm md:text-base">RERA Number</span>
            <span className={`font-semibold text-xs md:text-sm ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'} break-all text-right`}>{property.reraNumber}</span>
          </div>
        )}

        {/* Custom Fields */}
        {customFields.length > 0 && (
          <div className={`mt-4 pt-4 ${isWhiteText ? 'border-white/20' : 'border-gray-200 dark:border-gray-700'} border-t`}>
            {customFields.map((field, index) => (
              <div key={index} className={`flex justify-between mb-2 md:mb-3 ${isWhiteText ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                <span className="text-sm md:text-base">{field.label}</span>
                <span className={`font-semibold text-sm md:text-base ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{field.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (!bgImage || bgLayout === 'none') {
    return (
      <section id="overview" className={`py-10 md:py-12 ${sectionBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {renderContent()}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {renderQuickFacts()}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (bgLayout === 'background') {
    return (
      <section id="overview" className="py-10 md:py-12 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {renderContent(true)}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {renderQuickFacts(true)}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Split layouts
  const isLeft = bgLayout === 'split-left';

  return (
    <section id="overview" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <div
            className={`${isLeft ? 'lg:order-1' : 'lg:order-2'} relative bg-cover bg-center h-[250px] lg:h-auto lg:min-h-[500px] rounded-2xl`}
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-2xl" />
          </div>
          <div className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} ${cardBgClass} ${cardBorderClass} p-6 md:p-8 lg:p-12 rounded-2xl`}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {renderContent()}
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mt-8">
              {renderQuickFacts()}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;