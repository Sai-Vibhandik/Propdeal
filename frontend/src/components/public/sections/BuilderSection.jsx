import { motion } from 'framer-motion';
import { Building2, Award, MapPin, Users } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

const BuilderSection = ({ property, layout = 'standard', theme = {}, bgVariant = 'white' }) => {
  const builderName = property.builder || property.branding?.companyName || 'Developer';
  const builderLogo = property.branding?.logo ? getFileUrl(property.branding.logo) : '';
  const branding = property.branding || {};

  const sectionBg = property.sectionBackgrounds?.builderInfo || { image: '', layout: 'background' };
  const bgImage = sectionBg.image ? getFileUrl(sectionBg.image) : '';
  const bgLayout = sectionBg.layout || 'background';

  const { colors, isDark } = getThemeStyles(theme);

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  const stats = [
    { icon: Building2, value: '250+', label: 'Projects Delivered' },
    { icon: Award, value: '30+', label: 'Years of Experience' },
    { icon: MapPin, value: '15+', label: 'Cities Presence' },
    { icon: Users, value: '50,000+', label: 'Happy Customers' },
  ];

  const features = [
    'RERA registered and compliant projects',
    'On-time delivery with quality construction',
    'Transparent pricing with no hidden charges',
    'Excellent after-sales service',
    'Prime location selection',
    'Modern amenities and specifications',
  ];

  // No background image
  if (!bgImage || bgLayout === 'none') {
    return (
      <section className={`py-10 md:py-12 ${sectionBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title - Horizontal Layout */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-10">
            {builderLogo && (
              <div className={`flex-shrink-0 rounded-xl p-4 shadow-sm ${cardBgClass} ${cardBorderClass}`}>
                <img src={builderLogo} alt={builderName} className="h-16 md:h-20 object-contain" />
              </div>
            )}
            <div className="text-center md:text-left">
              <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-1">
                {builderName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl">
                {branding.tagline || `${builderName} is a renowned real estate developer known for delivering quality projects with modern amenities and excellent construction standards.`}
              </p>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`${cardBgClass} ${cardBorderClass} rounded-2xl p-6 shadow-sm`}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Our Track Record</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02, y: -3 }}
                      className={`p-4 rounded-xl cursor-pointer ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                    >
                      <Icon className="w-8 h-8 mb-2" style={{ color: colors.primary }} />
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`${cardBgClass} ${cardBorderClass} rounded-2xl p-6 shadow-sm`}
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Why Choose Us</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${colors.accent}20` }}
                    >
                      <svg className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Full background with overlay
  if (bgLayout === 'background') {
    return (
      <section className="py-10 md:py-12 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 bg-black/70" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Title - Horizontal Layout */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-10">
            {builderLogo && (
              <div className="flex-shrink-0 bg-white rounded-xl p-4">
                <img src={builderLogo} alt={builderName} className="h-16 md:h-20 object-contain" />
              </div>
            )}
            <div className="text-center md:text-left">
              <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>
                About Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-1">
                {builderName}
              </h2>
              <p className="text-gray-200 mt-2 max-w-xl">
                {branding.tagline || `${builderName} is a renowned real estate developer known for delivering quality projects with modern amenities and excellent construction standards.`}
              </p>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Our Track Record</h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="p-4 rounded-xl bg-white/10">
                      <Icon className="w-8 h-8 mb-2" style={{ color: colors.secondary }} />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-300">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Why Choose Us */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Why Choose Us</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white/20">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Split layouts
  const isLeft = bgLayout === 'split-left';

  return (
    <section className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-0">
          <div
            className={`${isLeft ? 'lg:order-1' : 'lg:order-2'} relative bg-cover bg-center h-[250px] lg:h-auto lg:min-h-[500px] rounded-2xl`}
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-2xl" />
          </div>
          <div className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} ${cardBgClass} ${cardBorderClass} p-6 md:p-8 lg:p-12 rounded-2xl`}>
            {/* Section Title - Horizontal Layout */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-6">
              {builderLogo && (
                <div className={`flex-shrink-0 rounded-lg p-3 shadow-sm ${cardBgClass} ${cardBorderClass}`}>
                  <img src={builderLogo} alt={builderName} className="h-12 object-contain" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: colors.secondary }}>
                  About Us
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {builderName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {branding.tagline || `${builderName} is a renowned real estate developer known for delivering quality projects.`}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className={`${cardBgClass} ${cardBorderClass} rounded-xl p-4 shadow-sm`}>
                    <Icon className="w-6 h-6 mb-1" style={{ color: colors.primary }} />
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Why Choose Us */}
            <div className={`${cardBgClass} ${cardBorderClass} rounded-xl p-5 shadow-sm`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Why Choose Us</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuilderSection;