import SiteContent from '../models/SiteContent.js';

// @desc    Get site content (public)
// @route   GET /api/site-content
// @access  Public
export const getSiteContent = async (req, res) => {
  try {
    const content = await SiteContent.getSingleton();

    // Filter out inactive items for public view
    const publicContent = {
      heroSlides: content.heroSlides.filter(s => s.isActive),
      whyUs: content.whyUs,
      cities: content.cities?.filter(c => c.isActive) || [],
      featuredBuilders: content.featuredBuilders || [],
      testimonials: content.testimonials.filter(t => t.isActive),
      faqs: content.faqs.filter(f => f.isActive),
      contact: content.contact,
      social: content.social,
      seo: content.seo,
      branding: content.branding || {},
      footer: content.footer,
      footerLinks: content.footerLinks?.filter(l => l.isActive) || [],
      footerSocialLinks: content.footerSocialLinks?.filter(s => s.isActive) || [],
      privacyPolicy: content.privacyPolicy || '',
      termsOfService: content.termsOfService || '',
    };

    res.json({
      success: true,
      data: publicContent,
    });
  } catch (error) {
    console.error('Get site content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get full site content (admin)
// @route   GET /api/admin/site-content
// @access  Private (Admin only)
export const getAdminSiteContent = async (req, res) => {
  try {
    const content = await SiteContent.getSingleton();

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Get admin site content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update hero slides
// @route   PUT /api/admin/site-content/hero-slides
// @access  Private (Admin only)
export const updateHeroSlides = async (req, res) => {
  try {
    const { slides } = req.body;

    const content = await SiteContent.getSingleton();
    content.heroSlides = slides;
    await content.save();

    res.json({
      success: true,
      data: content.heroSlides,
      message: 'Hero slides updated successfully',
    });
  } catch (error) {
    console.error('Update hero slides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update Why Us section
// @route   PUT /api/admin/site-content/why-us
// @access  Private (Admin only)
export const updateWhyUs = async (req, res) => {
  try {
    const { sectionTitle, sectionSubtitle, features, stats } = req.body;

    const content = await SiteContent.getSingleton();

    if (sectionTitle) content.whyUs.sectionTitle = sectionTitle;
    if (sectionSubtitle) content.whyUs.sectionSubtitle = sectionSubtitle;
    if (features) content.whyUs.features = features;
    if (stats) content.whyUs.stats = stats;

    await content.save();

    res.json({
      success: true,
      data: content.whyUs,
      message: 'Why Us section updated successfully',
    });
  } catch (error) {
    console.error('Update why us error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update cities
// @route   PUT /api/admin/site-content/cities
// @access  Private (Admin only)
export const updateCities = async (req, res) => {
  try {
    const { cities } = req.body;

    const content = await SiteContent.getSingleton();
    content.cities = cities;
    await content.save();

    res.json({
      success: true,
      data: content.cities,
      message: 'Cities updated successfully',
    });
  } catch (error) {
    console.error('Update cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update testimonials
// @route   PUT /api/admin/site-content/testimonials
// @access  Private (Admin only)
export const updateTestimonials = async (req, res) => {
  try {
    const { testimonials } = req.body;

    const content = await SiteContent.getSingleton();
    content.testimonials = testimonials;
    await content.save();

    res.json({
      success: true,
      data: content.testimonials,
      message: 'Testimonials updated successfully',
    });
  } catch (error) {
    console.error('Update testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update FAQs
// @route   PUT /api/admin/site-content/faqs
// @access  Private (Admin only)
export const updateFAQs = async (req, res) => {
  try {
    const { faqs } = req.body;

    const content = await SiteContent.getSingleton();
    content.faqs = faqs;
    await content.save();

    res.json({
      success: true,
      data: content.faqs,
      message: 'FAQs updated successfully',
    });
  } catch (error) {
    console.error('Update FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update contact info
// @route   PUT /api/admin/site-content/contact
// @access  Private (Admin only)
export const updateContact = async (req, res) => {
  try {
    const { phone, email, address, city, state, pincode, workingHours } = req.body;

    const content = await SiteContent.getSingleton();

    if (phone !== undefined) content.contact.phone = phone;
    if (email !== undefined) content.contact.email = email;
    if (address !== undefined) content.contact.address = address;
    if (city !== undefined) content.contact.city = city;
    if (state !== undefined) content.contact.state = state;
    if (pincode !== undefined) content.contact.pincode = pincode;
    if (workingHours !== undefined) content.contact.workingHours = workingHours;

    await content.save();

    res.json({
      success: true,
      data: content.contact,
      message: 'Contact info updated successfully',
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update social links
// @route   PUT /api/admin/site-content/social
// @access  Private (Admin only)
export const updateSocial = async (req, res) => {
  try {
    const { facebook, twitter, instagram, linkedin, youtube } = req.body;

    const content = await SiteContent.getSingleton();

    if (facebook !== undefined) content.social.facebook = facebook;
    if (twitter !== undefined) content.social.twitter = twitter;
    if (instagram !== undefined) content.social.instagram = instagram;
    if (linkedin !== undefined) content.social.linkedin = linkedin;
    if (youtube !== undefined) content.social.youtube = youtube;

    await content.save();

    res.json({
      success: true,
      data: content.social,
      message: 'Social links updated successfully',
    });
  } catch (error) {
    console.error('Update social error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update SEO settings
// @route   PUT /api/admin/site-content/seo
// @access  Private (Admin only)
export const updateSEO = async (req, res) => {
  try {
    const { siteName, siteTagline, metaDescription, metaKeywords, ogImage } = req.body;

    const content = await SiteContent.getSingleton();

    if (siteName !== undefined) content.seo.siteName = siteName;
    if (siteTagline !== undefined) content.seo.siteTagline = siteTagline;
    if (metaDescription !== undefined) content.seo.metaDescription = metaDescription;
    if (metaKeywords !== undefined) content.seo.metaKeywords = metaKeywords;
    if (ogImage !== undefined) content.seo.ogImage = ogImage;

    await content.save();

    res.json({
      success: true,
      data: content.seo,
      message: 'SEO settings updated successfully',
    });
  } catch (error) {
    console.error('Update SEO error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update branding settings
// @route   PUT /api/admin/site-content/branding
// @access  Private (Admin only)
export const updateBranding = async (req, res) => {
  try {
    const { logo, logoAlt, siteName, showSiteNameWithLogo, navbarLogoHeight, footerLogoHeight, sidebarLogoHeight } = req.body;

    const content = await SiteContent.getSingleton();

    if (!content.branding) {
      content.branding = {};
    }
    if (logo !== undefined) content.branding.logo = logo;
    if (logoAlt !== undefined) content.branding.logoAlt = logoAlt;
    if (siteName !== undefined) content.branding.siteName = siteName;
    if (showSiteNameWithLogo !== undefined) content.branding.showSiteNameWithLogo = showSiteNameWithLogo;
    if (navbarLogoHeight !== undefined) content.branding.navbarLogoHeight = navbarLogoHeight;
    if (footerLogoHeight !== undefined) content.branding.footerLogoHeight = footerLogoHeight;
    if (sidebarLogoHeight !== undefined) content.branding.sidebarLogoHeight = sidebarLogoHeight;

    await content.save();

    res.json({
      success: true,
      data: content.branding,
      message: 'Branding settings updated successfully',
    });
  } catch (error) {
    console.error('Update branding error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update footer settings
// @route   PUT /api/admin/site-content/footer
// @access  Private (Admin only)
export const updateFooter = async (req, res) => {
  try {
    const { description, copyrightText, showNewsletter } = req.body;

    const content = await SiteContent.getSingleton();

    if (description !== undefined) content.footer.description = description;
    if (copyrightText !== undefined) content.footer.copyrightText = copyrightText;
    if (showNewsletter !== undefined) content.footer.showNewsletter = showNewsletter;

    await content.save();

    res.json({
      success: true,
      data: content.footer,
      message: 'Footer settings updated successfully',
    });
  } catch (error) {
    console.error('Update footer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update footer links
// @route   PUT /api/admin/site-content/footer-links
// @access  Private (Admin only)
export const updateFooterLinks = async (req, res) => {
  try {
    const { links } = req.body;

    const content = await SiteContent.getSingleton();
    content.footerLinks = links;
    await content.save();

    res.json({
      success: true,
      data: content.footerLinks,
      message: 'Footer links updated successfully',
    });
  } catch (error) {
    console.error('Update footer links error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update footer social links
// @route   PUT /api/admin/site-content/footer-social-links
// @access  Private (Admin only)
export const updateFooterSocialLinks = async (req, res) => {
  try {
    const { socialLinks } = req.body;

    const content = await SiteContent.getSingleton();
    content.footerSocialLinks = socialLinks;
    await content.save();

    res.json({
      success: true,
      data: content.footerSocialLinks,
      message: 'Footer social links updated successfully',
    });
  } catch (error) {
    console.error('Update footer social links error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update privacy policy
// @route   PUT /api/admin/site-content/privacy-policy
// @access  Private (Admin only)
export const updatePrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    const siteContent = await SiteContent.getSingleton();
    siteContent.privacyPolicy = content;
    await siteContent.save();

    res.json({
      success: true,
      data: siteContent.privacyPolicy,
      message: 'Privacy policy updated successfully',
    });
  } catch (error) {
    console.error('Update privacy policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update terms of service
// @route   PUT /api/admin/site-content/terms-of-service
// @access  Private (Admin only)
export const updateTermsOfService = async (req, res) => {
  try {
    const { content } = req.body;

    const siteContent = await SiteContent.getSingleton();
    siteContent.termsOfService = content;
    await siteContent.save();

    res.json({
      success: true,
      data: siteContent.termsOfService,
      message: 'Terms of service updated successfully',
    });
  } catch (error) {
    console.error('Update terms of service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Update featured builders
// @route   PUT /api/admin/site-content/featured-builders
// @access  Private (Admin only)
export const updateFeaturedBuilders = async (req, res) => {
  try {
    const { builders } = req.body;

    // Validate max 10 builders
    if (builders && builders.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 builders allowed',
      });
    }

    const content = await SiteContent.getSingleton();
    content.featuredBuilders = builders || [];
    await content.save();

    res.json({
      success: true,
      data: content.featuredBuilders,
      message: 'Featured builders updated successfully',
    });
  } catch (error) {
    console.error('Update featured builders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Reset to defaults
// @route   POST /api/admin/site-content/reset
// @access  Private (Admin only)
export const resetSiteContent = async (req, res) => {
  try {
    await SiteContent.deleteMany({});
    const content = await SiteContent.getSingleton();

    res.json({
      success: true,
      data: content,
      message: 'Site content reset to defaults',
    });
  } catch (error) {
    console.error('Reset site content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};