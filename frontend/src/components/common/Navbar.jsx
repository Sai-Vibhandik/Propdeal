import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Building2, Phone, Star, LogIn } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { getFileUrl } from '../../services/api.js';

const Navbar = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const { content } = useSiteContent();

  // Get branding data
  const branding = content?.branding || {};
  const siteName = content?.seo?.siteName || 'PropertyHub';
  const logoUrl = branding.logo ? getFileUrl(branding.logo) : null;

  // Check if we're on homepage (hero page)
  const isHeroPage = location.pathname === '/';

  // Clear active section when navigating away from homepage
  useEffect(() => {
    if (!isHeroPage) {
      setActiveSection('');
    }
  }, [isHeroPage, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // On hero pages, only show solid background after scrolling past hero
      const scrollThreshold = isHeroPage ? 100 : 20;
      setIsScrolled(window.scrollY > scrollThreshold);

      // Track active section based on scroll position
      if (isHeroPage) {
        const sections = ['featured', 'contact'];
        const navbarHeight = 80;

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight + 100) {
              setActiveSection(sectionId);
              return;
            }
          }
        }
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHeroPage]);

  // Scroll to section on homepage
  const scrollToSection = (sectionId) => {
    if (!isHeroPage) {
      // If not on homepage, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  // Handle scroll after navigation from other pages (using URL hash)
  useEffect(() => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    if (isHeroPage && hash) {
      const sectionId = hash;

      // Clear the hash from URL after handling
      window.history.replaceState(null, '', window.location.pathname);

      // Wait for page to fully render then scroll
      const scrollToElement = () => {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          setActiveSection(sectionId);
        }
      };

      // Use requestAnimationFrame + setTimeout to ensure DOM is ready
      requestAnimationFrame(() => {
        setTimeout(scrollToElement, 400);
      });
    }
  }, [isHeroPage]);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/properties', label: 'Properties', icon: Building2 },
    { path: '#featured', label: 'Featured', icon: Star, isSection: true },
    { path: '#contact', label: 'Contact', icon: Phone, isSection: true },
  ];

  const isActive = (path) => {
    if (path === '/') {
      // Home is active only when on homepage AND no section is active
      return location.pathname === '/' && !activeSection;
    }
    if (path.startsWith('#')) return activeSection === path.replace('#', '');
    return location.pathname.startsWith(path);
  };

  // Determine navbar background style
  const getNavStyle = () => {
    if (isHeroPage && !isScrolled) {
      // Transparent on hero page when at top
      return 'bg-transparent';
    }
    return isScrolled
      ? 'bg-white shadow-lg'
      : 'bg-white/95 backdrop-blur-md';
  };

  // Determine text color
  const getTextColor = () => {
    if (isHeroPage && !isScrolled) {
      return 'text-white';
    }
    return 'text-slate-800';
  };

  // Render logo
  const renderLogo = () => {
    const logoHeight = branding.navbarLogoHeight || 40;
    const displayName = branding.siteName || siteName || 'PropertyHub';
    const showName = branding.showSiteNameWithLogo !== false;

    if (logoUrl) {
      return (
        <>
          <img
            src={logoUrl}
            alt={branding.logoAlt || 'Logo'}
            style={{ maxHeight: logoHeight }}
            className="object-contain"
          />
          {showName && (
            <span className={`text-xl font-bold ml-2 ${getTextColor()}`}>
              {displayName}
            </span>
          )}
        </>
      );
    }
    // Fallback to default logo icon + text
    const nameParts = siteName.split(' ');
    return (
      <>
        <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <span className={`text-xl font-bold ${getTextColor()}`}>
          {nameParts[0]}
          {nameParts[1] && <span className="text-amber-500">{nameParts[1]}</span>}
        </span>
      </>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${getNavStyle()}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              {renderLogo()}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                // Section links (Featured, Contact)
                if (link.isSection) {
                  return (
                    <button
                      key={link.path}
                      onClick={() => scrollToSection(link.path.replace('#', ''))}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-slate-800 text-white'
                          : isHeroPage && !isScrolled
                            ? 'text-white/90 hover:bg-white/10'
                            : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-slate-800 text-white'
                        : isHeroPage && !isScrolled
                          ? 'text-white/90 hover:bg-white/10'
                          : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                to="/login"
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                  isHeroPage && !isScrolled
                    ? 'text-white/90 hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/properties"
                className="px-5 py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
              >
                Find Property
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg cursor-pointer ${
                isHeroPage && !isScrolled
                  ? 'text-white hover:bg-white/10'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
            className="fixed top-16 left-0 right-0 z-30 md:hidden bg-white shadow-lg shadow-slate-200/50"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;

                // Section links (Featured, Contact)
                if (link.isSection) {
                  return (
                    <button
                      key={link.path}
                      onClick={() => scrollToSection(link.path.replace('#', ''))}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all w-full text-left cursor-pointer ${
                        isActive(link.path)
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      isActive(link.path)
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg transition-all text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
              <Link
                to="/properties"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors cursor-pointer"
              >
                Find Property
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar - only on non-hero pages */}
      {!isHeroPage && <div className="h-16 md:h-20" />}
    </>
  );
};

export default Navbar;