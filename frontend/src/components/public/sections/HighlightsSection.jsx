import { motion } from 'framer-motion';
import { Home, Waves, TreePine, Car, Shield, Star, MapPin, Building2, Sparkles, Heart, Users, Dumbbell, Award, Clock, CheckCircle, Leaf, Lightbulb, Banknote, ArrowRight } from 'lucide-react';
import { getThemeStyles, getCardClasses, getCardBorderClasses, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';
import { useLead } from '../../../context/LeadContext.jsx';

const iconMap = {
  location: MapPin, prime: MapPin, connectivity: MapPin, metro: MapPin,
  home: Home, apartment: Building2, villa: Home,
  pool: Waves, swimming: Waves, gym: Dumbbell, fitness: Dumbbell,
  clubhouse: Users, garden: TreePine, park: TreePine, green: TreePine,
  security: Shield, safe: Shield, cctv: Shield,
  quality: Star, premium: Star, luxury: Star, best: Award,
  parking: Car, investment: Banknote, value: Banknote, price: Banknote,
  rera: CheckCircle, approved: CheckCircle, possession: Clock,
  amenities: Sparkles, features: Lightbulb, modern: Sparkles,
};

const getIcon = (highlight) => {
  const text = `${highlight.title || ''} ${highlight.description || ''}`.toLowerCase();
  for (const [keyword, Icon] of Object.entries(iconMap)) {
    if (text.includes(keyword)) return Icon;
  }
  return Sparkles;
};

const defaultHighlights = [
  { title: 'Prime Location', description: 'Strategically situated with excellent connectivity to key areas' },
  { title: 'Ready to Move', description: 'Immediate possession available with all amenities operational' },
  { title: 'Essential Amenities', description: 'Landscaped gardens, children\'s play area, and dedicated parking' },
  { title: 'Social Infrastructure', description: 'Close proximity to schools, hospitals, and shopping centers' },
  { title: 'Peaceful Living', description: 'Located in a serene neighborhood away from city noise' },
  { title: 'Great Investment', description: 'High potential for appreciation in a rapidly developing area' },
];

const HighlightsSection = ({ property, layout = 'cards', theme = {}, bgVariant = 'white' }) => {
  const highlights = property.generatedContent?.highlights?.length > 0
    ? property.generatedContent.highlights
    : defaultHighlights;

  const sectionBg = property.sectionBackgrounds?.highlights || { image: '', layout: 'background' };
  const bgImage = sectionBg.image ? getFileUrl(sectionBg.image) : '';
  const bgLayout = sectionBg.layout || 'background';

  const { colors, isDark } = getThemeStyles(theme);
  const { openModal } = useLead();

  // Get section and card classes for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);
  const cardBgClass = getCardClasses(bgVariant, isDark);
  const cardBorderClass = getCardBorderClasses(bgVariant, isDark);

  // CTA Button Component
  const CTAButton = ({ isWhiteText = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mt-10 ${isWhiteText ? 'text-center' : ''}`}
    >
      <p className={`mb-4 ${isWhiteText ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>
        Want to know more about {property.name}?
      </p>
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => openModal(property, 'cta-price')}
        className={`cta-bounce-shine inline-flex items-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all cursor-pointer ${isWhiteText ? '' : 'shadow-lg hover:shadow-xl'}`}
        style={{ backgroundColor: colors.primary }}
      >
        Get Complete Details
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );

  const renderCard = (highlight, index, isWhiteText = false, horizontal = false) => {
    const Icon = getIcon(highlight);
    if (horizontal) {
      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer ${isWhiteText ? 'bg-white/10 hover:bg-white/20' : `${cardBgClass} ${cardBorderClass} hover:shadow-md`} transition-all`}
        >
          <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-bold mb-1 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{highlight.title}</h3>
            <p className={`text-sm ${isWhiteText ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>{highlight.description}</p>
          </div>
        </motion.div>
      );
    }
    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.03, y: -5 }}
        className={`p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer ${isWhiteText ? 'bg-white/10 hover:bg-white/20' : `${cardBgClass} ${cardBorderClass}`}`}
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: colors.primary }}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className={`text-lg font-bold mb-2 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{highlight.title}</h3>
        <p className={isWhiteText ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}>{highlight.description}</p>
      </motion.div>
    );
  };

  const renderHeader = (isWhiteText = false, centered = true) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-8 ${centered ? 'text-center' : ''}`}
    >
      <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: isWhiteText ? '#fff' : colors.secondary }}>
        Highlights
      </span>
      <h2 className={`text-3xl md:text-4xl font-bold mt-2 ${isWhiteText ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
        Why Choose {property.name}
      </h2>
      <p className={`mt-3 ${centered ? 'max-w-2xl mx-auto' : ''} ${isWhiteText ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
        Discover what makes this property stand out
      </p>
    </motion.div>
  );

  // No image
  if (!bgImage || bgLayout === 'none') {
    return (
      <section id="highlights" className={`py-10 md:py-12 ${sectionBgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderHeader()}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => renderCard(h, i))}
          </div>
          <CTAButton />
        </div>
      </section>
    );
  }

  // Full background
  if (bgLayout === 'background') {
    return (
      <section id="highlights" className="py-10 md:py-12 relative text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="absolute inset-0 bg-black/70" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {renderHeader(true)}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => renderCard(h, i, true))}
          </div>
          <CTAButton isWhiteText />
        </div>
      </section>
    );
  }

  // Split layouts
  const isLeft = bgLayout === 'split-left';

  return (
    <section id="highlights" className={`py-10 md:py-12 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-0">
          <div
            className={`${isLeft ? 'lg:order-1' : 'lg:order-2'} relative bg-cover bg-center h-[250px] lg:h-auto lg:min-h-[500px] rounded-2xl`}
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent rounded-2xl" />
          </div>
          <div className={`${isLeft ? 'lg:order-2' : 'lg:order-1'} ${cardBgClass} ${cardBorderClass} p-6 md:p-8 lg:p-12 rounded-2xl`}>
            {renderHeader(false, false)}
            <div className="space-y-4">
              {highlights.map((h, i) => renderCard(h, i, false, true))}
            </div>
            <CTAButton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;