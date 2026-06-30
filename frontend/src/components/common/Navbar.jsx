import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LogIn, Briefcase, Compass, Home } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { getFileUrl } from '../../services/api.js';

const Navbar = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();
  const { content } = useSiteContent();

  // Get branding data
  const branding = content?.branding || {};
  const siteName = content?.seo?.siteName || 'PropDeal';
  const logoUrl = branding.logo ? getFileUrl(branding.logo) : null;

  // Check if we're on homepage (hero page) - /discover is the buyer-facing home page with hero
  const isHeroPage = location.pathname === '/discover';
  const isDevelopersPage = location.pathname === '/';

  // Clear active section when navigating away from homepage
  // Also reset scroll state on route change
  useEffect(() => {
    if (!isHeroPage) {
      setActiveSection('');
    }
    // Reset scroll state on route change to prevent navbar style flicker
    setIsScrolled(false);
  }, [isHeroPage, location.pathname]);

  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // On hero pages and developers page, show enhanced background after scrolling
      const scrollThreshold = 50;
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
    { path: '/', label: 'For Professionals', icon: Briefcase },
    { path: '/discover', label: 'For Buyers', icon: Compass },
    { path: '/properties', label: 'Properties', icon: Home },
  ];

  const isActive = (path) => {
    if (path === '/') {
      // Home is active only when on homepage AND no section is active
      return location.pathname === '/' && !activeSection;
    }
    if (path.startsWith('#')) return activeSection === path.replace('#', '');
    return location.pathname.startsWith(path);
  };

  // Determine navbar background style - consistent dark gradient across all pages
  const getNavStyle = () => {
    if (isScrolled) {
      return 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5';
    }
    return 'bg-slate-900/80 backdrop-blur-lg';
  };

  // Determine text color - white for dark navbar
  const getTextColor = () => {
    return 'text-white';
  };

  // Render logo
  const renderLogo = () => {
    const logoHeight = branding.navbarLogoHeight || 40;
    const displayName = branding.siteName || siteName || 'PropDeal';
    const showName = branding.showSiteNameWithLogo !== false;
    const nameParts = displayName.split(' ');

    if (logoUrl) {
      return (
        <>
          <img
            src={logoUrl}
            alt={branding.logoAlt || 'Logo'}
            style={{ maxHeight: logoHeight }}
            className="object-contain rounded-2xl"
          />
          {showName && (
            <span className="text-xl font-bold ml-2">
              <span className="text-white">{nameParts[0]}</span>
              {nameParts[1] && <span className="text-amber-400"> {nameParts[1]}</span>}
              {nameParts.slice(2).join(' ') && <span className="text-white"> {nameParts.slice(2).join(' ')}</span>}
            </span>
          )}
        </>
      );
    }
    // Fallback to default logo icon + text with gradient
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-300/50 ring-1 ring-slate-700/10">
          <Building2 className="w-5 h-5 text-amber-400" />
        </div>
        <span className="text-xl font-bold">
          <span className="text-white">{nameParts[0]}</span>
          {nameParts[1] && <span className="text-amber-400"> {nameParts[1]}</span>}
          {nameParts.slice(2).join(' ') && <span className="text-white"> {nameParts.slice(2).join(' ')}</span>}
        </span>
      </div>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 ${getNavStyle()}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - Fixed width container to prevent shift */}
            <Link to="/" className="flex items-center group min-w-0">
              {renderLogo()}
            </Link>

            {/* Desktop Navigation - Fixed width */}
            <div className="hidden md:flex items-center gap-1 flex-shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                // Section links (Featured, Contact)
                if (link.isSection) {
                  return (
                    <button
                      key={link.path}
                      onClick={() => scrollToSection(link.path.replace('#', ''))}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer group ${
                        active
                          ? 'bg-white/15 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-amber-400' : ''}`} />
                      <span>{link.label}</span>
                      {active && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      // If clicking Home while on homepage, scroll to top
                      if (link.path === '/' && isHeroPage) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveSection('');
                      }
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer group ${
                      active
                        ? 'bg-white/15 text-white shadow-lg'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-amber-400' : ''}`} />
                    <span>{link.label}</span>
                    {active && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <LogIn className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                <span>Login</span>
              </Link>
              <Link
                to="/properties"
                className="relative px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-xl overflow-hidden group hover:shadow-lg hover:shadow-amber-500/25 transition-shadow"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Properties
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>

            {/* Mobile Navigation - Icons Only */}
            <div className="flex md:hidden items-center gap-1 flex-shrink-0">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);

                if (link.isSection) {
                  return (
                    <button
                      key={link.path}
                      onClick={() => scrollToSection(link.path.replace('#', ''))}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        active
                          ? 'bg-white/15 text-white'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                      title={link.label}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : ''}`} />
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (link.path === '/' && isHeroPage) {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setActiveSection('');
                      }
                    }}
                    className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    title={link.label}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : ''}`} />
                  </Link>
                );
              })}
              <Link
                to="/login"
                className="p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Login"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;