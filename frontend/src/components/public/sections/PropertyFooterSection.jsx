import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import { useLead } from '../../../context/LeadContext.jsx';
import { getThemeStyles, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

const PropertyFooterSection = ({ property, theme = {}, bgVariant = 'gray' }) => {
  const { openModal } = useLead();
  const { colors, isDark } = getThemeStyles(theme);

  // Get section background class for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);

  // Get branding info
  const branding = property.branding || {};
  const companyName = branding.companyName || property.builder || 'Developer';
  const projectName = property.name || 'Property';
  const address = property.address || {};
  const logo = branding.logo ? getFileUrl(branding.logo) : null;

  return (
    <footer className={`py-8 ${sectionBgClass}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            {/* Logo */}
            {logo && (
              <div className="mb-4">
                <img
                  src={logo}
                  alt={companyName}
                  className="h-20 object-contain"
                />
              </div>
            )}
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {projectName}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              by <span className="font-medium" style={{ color: colors.secondary }}>{companyName}</span>
            </p>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.secondary }} />
              <div>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  {address.fullAddress || `${address.locality}, ${address.city}`}
                </p>
                {address.landmark && (
                  <p className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                    Near {address.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Overview', 'Amenities', 'Pricing', 'Location', 'Gallery'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Get in Touch
            </h4>
            <ul className="space-y-3">
              {branding.phoneNumber && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5" style={{ color: colors.secondary }} />
                  <a
                    href={`tel:${branding.phoneNumber}`}
                    className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {branding.phoneNumber}
                  </a>
                </li>
              )}
              {branding.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5" style={{ color: colors.secondary }} />
                  <a
                    href={`mailto:${branding.email}`}
                    className={`transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {branding.email}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <Globe className="w-5 h-5" style={{ color: colors.secondary }} />
                <button
                  onClick={() => openModal(property, 'cta-visit')}
                  className={`transition-colors ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Schedule Site Visit
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default PropertyFooterSection;