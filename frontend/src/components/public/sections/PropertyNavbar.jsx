import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Building2 } from 'lucide-react';
import { useLead } from '../../../context/LeadContext.jsx';
import { getThemeStyles } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

const PropertyNavbar = ({ property, branding, theme = {} }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { openModal } = useLead();

  // Get theme colors using the theme system
  const { colors, isDark } = getThemeStyles(theme);
  const logo = branding?.logo ? getFileUrl(branding.logo) : null;
  const builderName = property?.builder || branding?.name || 'Property';

  // Get enabled sections for navigation
  const enabledSections = Object.entries(property?.sections || {})
    .filter(([key, value]) => value.enabled)
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key]) => key);

  // Navigation links with labels
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'floorPlans', label: 'Floor Plans' },
    { id: 'location', label: 'Location' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'faq', label: 'FAQ' },
  ].filter(item => enabledSections.includes(item.id));

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 70);

      // Update active section based on scroll position
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPos = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(navItems[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Determine navbar background style based on theme (always solid)
  const getNavBgClass = () => {
    // Always solid background for visibility
    return isDark
      ? 'bg-gray-900 shadow-lg'
      : 'bg-white shadow-lg';
  };

  // Determine text color based on theme
  const getTextColor = () => {
    return isDark ? 'text-white' : 'text-gray-900';
  };

  const getSubTextColor = () => {
    return isDark ? 'text-gray-400' : 'text-gray-500';
  };

  const getNavButtonClass = (isActive) => {
    const baseClass = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer';

    if (isActive) {
      return `${baseClass} text-white`;
    }

    return isDark
      ? `${baseClass} text-gray-300 hover:bg-gray-800`
      : `${baseClass} text-gray-700 hover:bg-gray-100`;
  };

  // Animated CTA Button Component - Bounce + Shine
  const AnimatedCTAButton = ({ mobile = false }) => {
    return (
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          openModal(property, 'cta-price');
          if (mobile) setIsMobileMenuOpen(false);
        }}
        className={`cta-bounce-shine flex items-center justify-center gap-2 font-semibold text-white rounded-lg cursor-pointer ${
          mobile ? 'w-full py-3' : 'px-5 py-2.5'
        }`}
        style={{ backgroundColor: colors.primary }}
      >
        <span className="relative z-10">Get Details</span>
      </motion.button>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavBgClass()} lg:border-b-2`}
        style={{ borderColor: `${colors.primary}60` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo / Brand */}
            <div className="flex items-center space-x-3">
              {logo ? (
                <img
                  src={logo}
                  alt={builderName}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="hidden sm:block">
                <span className={`text-xl font-bold ${getTextColor()}`}>
                  {property?.name || 'Property'}
                </span>
                <span className={`block text-xs ${getSubTextColor()}`}>
                  by {builderName}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={getNavButtonClass(activeSection === item.id)}
                  style={activeSection === item.id ? { backgroundColor: colors.primary } : {}}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center space-x-3">
              <AnimatedCTAButton />
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 left-0 right-0 z-40 lg:hidden shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {/* Property Info */}
              <div className={`px-4 py-3 border-b mb-2 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {property?.name}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  by {builderName}
                </div>
              </div>

              {/* Navigation Links */}
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all cursor-pointer ${
                    activeSection === item.id
                      ? 'text-white'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={activeSection === item.id ? { backgroundColor: colors.primary } : {}}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* CTA */}
              <div className="mt-4">
                <AnimatedCTAButton mobile />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
};

export default PropertyNavbar;