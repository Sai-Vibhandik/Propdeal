import { Building2, User, FileCheck } from 'lucide-react';
import { getThemeStyles, getSectionBgClasses } from '../../../utils/theme.js';
import { getFileUrl } from '../../../services/api.js';

const RERASection = ({ property, theme = {}, bgVariant = 'gray' }) => {
  const { colors, isDark } = getThemeStyles(theme);

  // Get section background class for proper contrast
  const sectionBgClass = getSectionBgClasses(bgVariant, isDark);

  // Get RERA details from property with defaults
  const branding = property.branding || {};
  const reraSection = property.reraSection || {};

  // Default values - will be used if fields are empty
  const defaults = {
    headerText: 'Project Registered under Government of India RERA Act 2016',
    reraWebsite: 'https://maharera.com',
    advertiserName: 'PropDeal',
    advertiserRegNo: 'A51234567890',
    projectRegNo: 'PRM1234567890',
    disclaimer: "We're an authorized marketing channel partner (PropDeal). The provided content, images & video are sourced from respective owners and are provided only for information purposes, it does not constitute an offer to buy any service. The price plans are subject to change without prior notice, and the properties mentioned are subject to availability. You can receive a call, SMS, or emails on contact details registered with us.",
  };

  // RERA details - use property fields first, then fall back to defaults
  const headerText = reraSection.headerText || defaults.headerText;
  const reraWebsite = branding.reraWebsite || defaults.reraWebsite;
  const advertiserName = branding.advertiserName || defaults.advertiserName;
  const advertiserRegNo = branding.advertiserRegNo || defaults.advertiserRegNo;
  const projectRegNo = property.reraNumber || reraSection.projectRegNo || defaults.projectRegNo;
  const disclaimer = reraSection.disclaimer || defaults.disclaimer;
  const reraQrCode = branding.reraQrCode ? getFileUrl(branding.reraQrCode) : '';

  // Check if section is enabled
  const isEnabled = reraSection.enabled !== false; // Default to true

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }

  return (
    <section className={`py-6 ${sectionBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* QR Code - First */}
        {reraQrCode && (
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white border border-gray-300 shadow-sm'}`}>
              <img
                src={reraQrCode}
                alt="RERA QR Code"
                className="w-32 h-32 object-contain"
              />
              <p className={`text-xs text-center mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Scan for RERA details
              </p>
            </div>
          </div>
        )}

        {/* RERA Info - Second */}
        <div className="mb-4 space-y-2">
          {/* Line 1: RERA Registration Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <Building2 className="w-5 h-5 flex-shrink-0" style={{ color: colors.primary }} />
            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {headerText}
            </p>
            {reraWebsite && (
              <>
                <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>|</span>
                <a
                  href={reraWebsite.startsWith('http') ? reraWebsite : `https://${reraWebsite}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {reraWebsite}
                </a>
              </>
            )}
          </div>

          {/* Line 2: Advertiser Info */}
          <div className="flex items-center gap-2 flex-wrap">
            <User className="w-5 h-5 flex-shrink-0" style={{ color: colors.primary }} />
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Government RERA Authorised Advertiser's:</span>{' '}
              {advertiserName}
              {advertiserRegNo && <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>, Registration No.: {advertiserRegNo}</span>}
            </p>
          </div>

          {/* Line 3: Project Registration Number */}
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 flex-shrink-0" style={{ color: colors.primary }} />
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-medium">Project Registration No.:</span>{' '}
              <span className="font-semibold">{projectRegNo}</span>
            </p>
          </div>
        </div>

        {/* Disclaimer - Third */}
        <div className={`pt-4 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-300'}`}>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className="font-medium">Disclaimer:</span> {disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
};

export default RERASection;