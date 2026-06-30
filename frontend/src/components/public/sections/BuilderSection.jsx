import { motion } from 'framer-motion';
import { Building2, Award, MapPin, Users, Briefcase, Home, Globe, Star, CheckCircle2, Shield, Clock } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

// Icon mapping for stats
const iconMap = {
  building: Building2,
  award: Award,
  mapPin: MapPin,
  users: Users,
  briefcase: Briefcase,
  home: Home,
  globe: Globe,
  star: Star,
  shield: Shield,
  clock: Clock,
  check: CheckCircle2,
};

// Icon mapping for features (Why Choose Us) - based on keywords
const featureIconMap = {
  'rera': 'shield',
  'compliant': 'shield',
  'registered': 'shield',
  'on-time': 'clock',
  'timely': 'clock',
  'delivery': 'clock',
  'transparent': 'check',
  'pricing': 'check',
  'hidden': 'check',
  'after-sales': 'award',
  'service': 'award',
  'support': 'award',
  'location': 'mapPin',
  'prime': 'mapPin',
  'amenities': 'home',
  'modern': 'home',
  'specifications': 'home',
  'quality': 'award',
  'construction': 'building',
};

// Get icon name for a feature based on keywords
const getFeatureIconName = (text) => {
  const lowerText = (text || '').toLowerCase();
  for (const [keyword, iconName] of Object.entries(featureIconMap)) {
    if (lowerText.includes(keyword)) return iconName;
  }
  return 'check'; // default
};

const BuilderSection = ({ property, layout = 'standard', theme = {}, bgVariant = 'white' }) => {
  const builderName = property.builder || property.branding?.companyName || 'Developer';
  const builderLogo = property.branding?.logo ? getFileUrl(property.branding.logo) : '';
  const branding = property.branding || {};

  // Get AI-generated builder content
  const builderContent = property.generatedContent?.builder || {};

  const sectionBg = property.sectionBackgrounds?.builderInfo || { image: '', layout: 'background' };
  const bgImage = sectionBg.image ? getFileUrl(sectionBg.image) : '';
  const bgLayout = sectionBg.layout || 'background';

  const { colors, isDark } = getThemeStyles(theme);

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  // Use builder stats from AI-generated content, otherwise use defaults
  const defaultStats = [
    { icon: 'building', value: '250+', label: 'Projects Delivered' },
    { icon: 'award', value: '30+', label: 'Years of Experience' },
    { icon: 'mapPin', value: '15+', label: 'Cities Presence' },
    { icon: 'users', value: '50,000+', label: 'Happy Customers' },
  ];

  const stats = (builderContent.stats && builderContent.stats.length > 0
    ? builderContent.stats
    : defaultStats
  ).map(stat => ({
    ...stat,
    Icon: iconMap[stat.icon] || Building2,
  }));

  // Use AI-generated key facts if available, otherwise use defaults
  const defaultKeyFacts = [
    { icon: 'shield', text: 'RERA registered and compliant projects' },
    { icon: 'clock', text: 'On-time delivery with quality construction' },
    { icon: 'check', text: 'Transparent pricing with no hidden charges' },
    { icon: 'award', text: 'Excellent after-sales service' },
    { icon: 'mapPin', text: 'Prime location selection for all projects' },
    { icon: 'home', text: 'Modern amenities and premium specifications' },
  ];

  const keyFacts = (builderContent.keyFacts && builderContent.keyFacts.length > 0
    ? builderContent.keyFacts
    : defaultKeyFacts
  ).map(fact => ({
    ...fact,
    Icon: iconMap[fact.icon] || iconMap[getFeatureIconName(fact.text)] || CheckCircle2,
  }));

  // Render Why Choose Us section
  const renderWhyChooseUs = (isDarkMode = false) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {keyFacts.map((fact, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-default ${
            isDarkMode
              ? 'bg-white/5 hover:bg-white/10'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${colors.primary}15` }}
          >
            <fact.Icon className="w-4 h-4" style={{ color: colors.primary }} />
          </div>
          <span className={`text-sm leading-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {fact.text}
          </span>
        </motion.div>
      ))}
    </div>
  );

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
                {builderContent.aboutBuilder || branding.tagline || `${builderName} is a renowned real estate developer known for delivering quality projects with modern amenities and excellent construction standards.`}
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
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className={`p-4 rounded-xl cursor-pointer ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'} transition-colors`}
                  >
                    <stat.Icon className="w-8 h-8 mb-2" style={{ color: colors.primary }} />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
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
              {renderWhyChooseUs(false)}
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
                {builderContent.aboutBuilder || branding.tagline || `${builderName} is a renowned real estate developer known for delivering quality projects with modern amenities and excellent construction standards.`}
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
                {stats.map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-white/10">
                    <stat.Icon className="w-8 h-8 mb-2" style={{ color: colors.secondary }} />
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-300">{stat.label}</p>
                  </div>
                ))}
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
              {renderWhyChooseUs(true)}
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
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
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
                  {builderContent.aboutBuilder || branding.tagline || `${builderName} is a renowned real estate developer known for delivering quality projects.`}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {stats.map((stat, index) => (
                <div key={index} className={`${cardBgClass} ${cardBorderClass} rounded-xl p-4 shadow-sm`}>
                  <stat.Icon className="w-6 h-6 mb-1" style={{ color: colors.primary }} />
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Why Choose Us */}
            <div className={`${cardBgClass} ${cardBorderClass} rounded-xl p-5 shadow-sm`}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Why Choose Us</h3>
              {renderWhyChooseUs(false)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuilderSection;