import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { useProperty } from '../../hooks/useProperty.js';
import { applyThemeToDocument, getThemeStyles } from '../../utils/theme.js';
import { getFileUrl, analyticsAPI } from '../../services/api.js';

// Navbar
import PropertyNavbar from '../../components/public/sections/PropertyNavbar.jsx';

// Section Components
import HeroSection from '../../components/public/sections/HeroSection.jsx';
import OverviewSection from '../../components/public/sections/OverviewSection.jsx';
import HighlightsSection from '../../components/public/sections/HighlightsSection.jsx';
import AmenitiesSection from '../../components/public/sections/AmenitiesSection.jsx';
import PricingSection from '../../components/public/sections/PricingSection.jsx';
import PlansSection from '../../components/public/sections/PlansSection.jsx';
import LocationSection from '../../components/public/sections/LocationSection.jsx';
import GallerySection from '../../components/public/sections/GallerySection.jsx';
import VideoTourSection from '../../components/public/sections/VideoTourSection.jsx';
import BuilderSection from '../../components/public/sections/BuilderSection.jsx';
import InvestmentSection from '../../components/public/sections/InvestmentSection.jsx';
import PropertyFAQSection from '../../components/public/sections/PropertyFAQSection.jsx';
import ContactSection from '../../components/public/sections/ContactSection.jsx';
import StickyContactSection from '../../components/public/sections/StickyContactSection.jsx';
import StickyBrochureButton from '../../components/public/sections/StickyBrochureButton.jsx';
import RERASection from '../../components/public/sections/RERASection.jsx';
import PropertyFooterSection from '../../components/public/sections/PropertyFooterSection.jsx';

// Map section names to components
const sectionComponents = {
  hero: HeroSection,
  overview: OverviewSection,
  highlights: HighlightsSection,
  amenities: AmenitiesSection,
  pricing: PricingSection,
  plans: PlansSection,
  location: LocationSection,
  gallery: GallerySection,
  videoTour: VideoTourSection,
  builderInfo: BuilderSection,
  investment: InvestmentSection,
  faq: PropertyFAQSection,
  contact: ContactSection,
};

// Sections that always use their own background (don't use bgVariant)
const alwaysOwnBackground = ['hero'];

// Sections that can have their own background when bgLayout === 'background'
const conditionalOwnBackground = ['overview', 'highlights', 'builderInfo'];

// Check if a section will actually render content (not return null)
const sectionWillRender = (sectionKey, property) => {
  switch (sectionKey) {
    case 'videoTour':
      return !!property.videoTour;
    case 'gallery':
      return !!(property.gallery && property.gallery.length > 0);
    case 'amenities':
      return !!(property.amenities && property.amenities.length > 0);
    case 'plans':
      const plansData = property.plans;
      const hasMasterPlan = plansData?.masterPlan?.url;
      const hasFloorPlans = plansData?.floorPlans && plansData.floorPlans.length > 0;
      const hasDimensionPlans = plansData?.dimensionPlans && plansData.dimensionPlans.length > 0;
      return !!(hasMasterPlan || hasFloorPlans || hasDimensionPlans);
    default:
      return true; // Most sections will render
  }
};

// Check if a section will use its own background styling
const sectionUsesOwnBackground = (sectionKey, sectionBackgrounds) => {
  // Hero always uses own background
  if (alwaysOwnBackground.includes(sectionKey)) return true;

  // Check if this section has a background image with 'background' layout
  if (conditionalOwnBackground.includes(sectionKey)) {
    const sectionBg = sectionBackgrounds?.[sectionKey];
    // If section has a background image and layout is 'background', it uses own styling
    if (sectionBg?.image && sectionBg?.layout === 'background') {
      return true;
    }
  }

  return false;
};

const PropertyLandingPage = () => {
  const { slug } = useParams();
  const { property, loading, error } = useProperty(slug);

  // Get enabled sections sorted by order (memoized to prevent infinite loops)
  const enabledSections = useMemo(() => {
    if (!property) return [];
    return Object.entries(property.sections || {})
      .filter(([key, value]) => value.enabled)
      .sort((a, b) => a[1].order - b[1].order);
  }, [property]);

  // Apply theme and favicon to document when property loads
  useEffect(() => {
    if (property?.theme) {
      applyThemeToDocument(property.theme);
    }

    // Apply custom favicon if set
    if (property?.branding?.favicon) {
      const faviconUrl = getFileUrl(property.branding.favicon);

      // Update existing favicon or create new one
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;

      // Also update apple-touch-icon
      let appleLink = document.querySelector("link[rel~='apple-touch-icon']");
      if (!appleLink) {
        appleLink = document.createElement('link');
        appleLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleLink);
      }
      appleLink.href = faviconUrl;
    }

    // Cleanup: remove dark class when leaving this page
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [property]);

  // Track page view
  useEffect(() => {
    if (property?._id) {
      // Detect device type
      const device = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

      // Detect traffic source
      const urlParams = new URLSearchParams(window.location.search);
      let source = 'direct';
      if (urlParams.get('utm_source')) {
        source = urlParams.get('utm_source');
      } else if (document.referrer) {
        if (document.referrer.includes('google')) source = 'organic';
        else if (document.referrer.includes('facebook') || document.referrer.includes('instagram') || document.referrer.includes('twitter')) source = 'social';
        else source = 'referral';
      }

      // Track page view (fire and forget)
      analyticsAPI.trackPageView({
        propertyId: property._id,
        source,
        device,
      }).catch(err => console.error('Analytics error:', err));
    }
  }, [property?._id]);

  // Debug: Log section alternation info
  useEffect(() => {
    if (property && enabledSections.length > 0) {
      console.log('=== Section Background Alternation Debug ===');
      console.log('Dark Mode:', property.theme?.darkMode);
      console.log('Section Backgrounds:', property.sectionBackgrounds);

      // Log enabled sections
      enabledSections.forEach(([sectionKey, sectionConfig], index) => {
        const usesOwnBg = sectionUsesOwnBackground(sectionKey, property.sectionBackgrounds);
        const willRender = sectionWillRender(sectionKey, property);
        const sectionsWithBgVariantSoFar = enabledSections
          .slice(0, index + 1)
          .filter(([key]) =>
            !sectionUsesOwnBackground(key, property.sectionBackgrounds) &&
            sectionWillRender(key, property)
          )
          .length;
        const bgVariant = sectionsWithBgVariantSoFar % 2 === 1 ? 'white' : 'gray';
        console.log(`${index}: ${sectionKey} | usesOwnBg: ${usesOwnBg} | willRender: ${willRender} | count: ${sectionsWithBgVariantSoFar} | bgVariant: ${bgVariant}`);
      });

      // Log RERA and Footer
      const renderedSectionsWithBgVariant = enabledSections
        .filter(([key]) =>
          !sectionUsesOwnBackground(key, property.sectionBackgrounds) &&
          sectionWillRender(key, property)
        )
        .length;
      const reraBgVariant = renderedSectionsWithBgVariant % 2 === 1 ? 'gray' : 'white';
      const hasRERAContent = property.reraNumber || property.branding?.reraWebsite || property.branding?.advertiserName || property.branding?.reraQrCode;
      const footerBgVariant = hasRERAContent
        ? (renderedSectionsWithBgVariant + 1) % 2 === 1 ? 'gray' : 'white'
        : reraBgVariant;

      console.log(`RERA | hasContent: ${!!hasRERAContent} | bgVariant: ${reraBgVariant}`);
      console.log(`Footer | bgVariant: ${footerBgVariant}`);
    }
  }, [property, enabledSections]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Property</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/properties" className="text-blue-800 hover:underline">
            Browse all properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
          <Link to="/properties" className="text-blue-800 hover:underline">
            Browse all properties
          </Link>
        </div>
      </div>
    );
  }

  // Get theme styles
  const themeStyles = getThemeStyles(property.theme);
  const fontHeading = themeStyles.fonts.heading;
  const fontBody = themeStyles.fonts.body;

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden"
      style={{
        '--font-heading': fontHeading,
        '--font-body': fontBody,
      }}
    >
      {/* Property Navbar */}
      <PropertyNavbar property={property} branding={property.branding} theme={property.theme} />

      {/* Render Sections Dynamically */}
      {enabledSections.map(([sectionKey, sectionConfig], index) => {
        const SectionComponent = sectionComponents[sectionKey];
        if (!SectionComponent) return null;

        // Skip rendering but don't count if section won't render (returns null due to no content)
        if (!sectionWillRender(sectionKey, property)) return null;

        // Count how many sections that use bgVariant AND will render have been rendered so far (including this one)
        // Sections with their own backgrounds (hero, or sections with bgLayout='background')
        // and sections that return null (no content) don't use bgVariant, so they shouldn't be counted
        const sectionsWithBgVariantSoFar = enabledSections
          .slice(0, index + 1)
          .filter(([key]) =>
            !sectionUsesOwnBackground(key, property.sectionBackgrounds) &&
            sectionWillRender(key, property)
          )
          .length;

        // Calculate background variant based on position in the alternation sequence
        // First section that uses bgVariant gets 'white' (odd: 1), next gets 'gray' (even: 2), etc.
        const bgVariant = sectionsWithBgVariantSoFar % 2 === 1 ? 'white' : 'gray';

        return (
          <SectionComponent
            key={sectionKey}
            property={property}
            layout={sectionConfig.layout}
            theme={property.theme}
            branding={property.branding}
            bgVariant={bgVariant}
          />
        );
      })}

      {/* Sticky Contact Section */}
      {property.sections?.contact?.enabled && (
        <StickyContactSection property={property} theme={property.theme} />
      )}

      {/* Sticky Brochure Download Button */}
      <StickyBrochureButton property={property} theme={property.theme} />

      {/* RERA Section & Footer - Calculate bgVariant based on rendered sections */}
      {(() => {
        // Count all sections that have rendered and use bgVariant
        const renderedSectionsWithBgVariant = enabledSections
          .filter(([key]) =>
            !sectionUsesOwnBackground(key, property.sectionBackgrounds) &&
            sectionWillRender(key, property)
          )
          .length;

        // RERA gets the next bgVariant in sequence
        const reraBgVariant = renderedSectionsWithBgVariant % 2 === 1 ? 'gray' : 'white';

        // Check if RERA will render (has content)
        const hasRERAContent = property.reraNumber || property.branding?.reraWebsite || property.branding?.advertiserName || property.branding?.reraQrCode;

        // Footer gets the next bgVariant after RERA (if RERA renders) or same as RERA (if RERA doesn't render)
        const footerBgVariant = hasRERAContent
          ? (renderedSectionsWithBgVariant + 1) % 2 === 1 ? 'gray' : 'white'
          : reraBgVariant;

        return (
          <>
            <RERASection property={property} theme={property.theme} bgVariant={reraBgVariant} />
            <PropertyFooterSection property={property} theme={property.theme} bgVariant={footerBgVariant} />
          </>
        );
      })()}
    </div>
  );
};

export default PropertyLandingPage;