import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Send } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext.jsx';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getFileUrl } from '../../services/api.js';

// Map platform names to icons
const PLATFORM_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

const Footer = () => {
  const { content } = useSiteContent();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();

  // Get data from site content
  const branding = content?.branding || {};
  const siteName = content?.seo?.siteName || 'PropertyHub';
  const logoUrl = branding.logo ? getFileUrl(branding.logo) : null;
  const contact = content?.contact || {};
  const footerSettings = content?.footer || {};
  const seo = content?.seo || {};

  // Get dynamic footer links
  const footerLinks = content?.footerLinks || [];
  const footerSocialLinks = content?.footerSocialLinks || [];

  // Handle newsletter subscription
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setSubscribing(true);
    // Simulate API call (you can replace with actual newsletter API)
    setTimeout(() => {
      toast.success('Thank you for subscribing!');
      setEmail('');
      setSubscribing(false);
    }, 1000);
  };

  // Handle link click for section links
  const handleLinkClick = (e, url) => {
    // Check if it's a hash link (section link)
    if (url.startsWith('/#')) {
      e.preventDefault();
      const sectionId = url.substring(2); // Remove '/#'

      // If we're on homepage, scroll to section
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // If not on homepage, navigate to homepage with hash
        window.location.href = url;
      }
    }
  };

  // Handle scroll after navigation from other pages
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && location.pathname === '/') {
      const scrollToElement = () => {
        const element = document.getElementById(hash);
        if (element) {
          const navbarHeight = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      };
      // Clear the hash from URL after handling
      window.history.replaceState(null, '', window.location.pathname);
      // Wait for page to render
      requestAnimationFrame(() => {
        setTimeout(scrollToElement, 300);
      });
    }
  }, [location.pathname]);

  // Format address
  const fullAddress = [
    contact.address,
    contact.city,
    contact.state,
    contact.pincode
  ].filter(Boolean).join(', ');

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-90 transition-opacity cursor-pointer">
              {logoUrl ? (
                <>
                  <img
                    src={logoUrl}
                    alt={branding.logoAlt || 'Logo'}
                    style={{ maxHeight: branding.footerLogoHeight || 32 }}
                    className="object-contain"
                  />
                  {branding.showSiteNameWithLogo !== false && (
                    <span className="text-xl font-bold text-white">
                      {branding.siteName || siteName.split(' ')[0]}
                      {branding.siteName ? '' : (siteName.split(' ')[1] && (
                        <span className="text-amber-500">{siteName.split(' ')[1]}</span>
                      ))}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    {siteName.split(' ')[0]}
                    {siteName.split(' ')[1] && (
                      <span className="text-amber-500">{siteName.split(' ')[1]}</span>
                    )}
                  </span>
                </>
              )}
            </Link>
            <p className="text-sm text-slate-400">
              {footerSettings.description || seo.siteTagline || 'Discover your dream property with our platform. We help you find the perfect home with detailed insights and virtual tours.'}
            </p>
            {/* Social Links */}
            {footerSocialLinks.length > 0 && (
              <div className="flex space-x-3">
                {footerSocialLinks.filter(s => s.isActive).map((social, index) => {
                  const Icon = PLATFORM_ICONS[social.platform] || Facebook;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 hover:scale-110 transition-all cursor-pointer"
                      aria-label={social.platform}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {footerLinks.filter(l => l.isActive).length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {footerLinks.filter(l => l.isActive).map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.url}
                      onClick={(e) => handleLinkClick(e, link.url)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              {fullAddress && (
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-400">{fullAddress}</span>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <a href={`mailto:${contact.email}`} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.workingHours && (
                <li className="flex items-start space-x-3">
                  <span className="text-slate-400 text-sm">
                    <strong className="text-slate-300">Hours:</strong> {contact.workingHours}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <p className="text-sm text-slate-500">
              {footerSettings.copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`}
            </p>
            <div className="flex space-x-4 text-sm">
              <Link to="/privacy-policy" className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;