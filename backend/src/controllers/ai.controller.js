import { GeneratedContent, Property } from '../models/index.js';
import { generateContent, checkAIStatus, getSupportedProviders } from '../config/ai.js';
import AI_PROMPTS from '../services/prompts.js';

// Generate mock content fallback when AI is unavailable
const getMockContent = (section, property) => {
  const mockContent = {
    hero: {
      headline: `Luxury Living at ${property.name || 'this Property'}`,
      subheadline: `Experience premium living in ${property.address?.locality || 'a prime location'} with world-class amenities`,
      ctaText: 'Schedule a Visit',
      badge: property.category === 'ready-to-move' ? 'Ready to Move' : 'New Launch',
      offers: [
        { icon: 'percent', text: 'No Pre-EMI till Possession', highlight: true },
        { icon: 'tag', text: 'Free Car Parking Worth ₹5L', highlight: false },
        { icon: 'clock', text: 'Early Bird Discount: 2% Off', highlight: false },
      ],
      offerValidity: 'Limited Time Only',
    },
    overview: {
      description: `${property.name || 'This property'} is a premium residential project by ${property.builder || 'a renowned developer'} located in ${property.address?.locality || 'a prime area'}, ${property.address?.city || 'the city'}. This project offers thoughtfully designed residences with modern amenities and excellent connectivity.`,
      summary: 'A premium residential project with excellent connectivity and world-class amenities.',
      keyPoints: [
        'Modern amenities and facilities',
        'Excellent connectivity to major hubs',
        property.reraNumber ? 'RERA registered project' : 'Premium specifications',
        'Thoughtfully designed spaces',
        'Prime location advantages',
      ],
    },
    highlights: [
      { icon: 'map', title: 'Prime Location', description: `Located in ${property.address?.locality || 'a prime area'} with excellent connectivity to key areas` },
      { icon: 'home', title: property.category === 'ready-to-move' ? 'Ready to Move' : 'New Launch', description: property.category === 'ready-to-move' ? 'Immediate possession available with all amenities operational' : 'Quality construction with modern design' },
      { icon: 'sparkles', title: 'Essential Amenities', description: 'Landscaped gardens, children\'s play area, and dedicated parking facilities' },
      { icon: 'building', title: 'Social Infrastructure', description: 'Close proximity to schools, hospitals, and shopping centers' },
      { icon: 'tree', title: 'Peaceful Living', description: 'Located in a serene neighborhood providing a calm retreat' },
      { icon: 'trending', title: 'Great Investment', description: 'High potential for appreciation in the rapidly developing area' },
    ],
    location: {
      connectivity: `Excellent connectivity to major hubs and business centers. ${property.address?.locality || 'The area'} is well-connected via roads and public transport.`,
    },
    investment: {
      benefits: [
        'High rental yield due to prime location',
        'Strong appreciation potential',
        'Excellent social infrastructure',
        'Growing demand in the area',
      ],
      rentalPotential: 'Expected rental yield of 3-4% per annum',
      futureGrowth: 'Property values expected to appreciate significantly.',
    },
    faq: [
      {
        question: `What is the possession status?`,
        answer: property.category === 'ready-to-move'
          ? 'The project is ready to move with immediate possession available.'
          : 'The project is currently under construction with possession expected as per schedule.',
      },
      {
        question: 'What amenities are available?',
        answer: 'The project offers a wide range of amenities including clubhouse, swimming pool, gym, sports courts, and more.',
      },
      {
        question: 'Is the project RERA registered?',
        answer: property.reraNumber
          ? `Yes, the project is RERA registered with registration number ${property.reraNumber}.`
          : 'Please contact our team for RERA details.',
      },
      {
        question: 'What about location connectivity?',
        answer: 'The project has excellent connectivity to major IT hubs, schools, hospitals, and shopping centers.',
      },
    ],
    seo: {
      metaTitle: `${property.name || 'Property'} | ${property.configurations?.[0] || 'Apartments'} in ${property.address?.locality || 'Prime Location'}`,
      metaDescription: `Premium ${property.configurations?.[0] || 'apartments'} in ${property.address?.locality || 'prime location'}. ${property.category === 'ready-to-move' ? 'Ready to move' : 'Under construction'} with world-class amenities.`,
      keywords: [property.name, property.address?.locality, 'apartments', 'flats', property.address?.city, 'buy property'].filter(Boolean),
    },
  };

  return mockContent[section] || {};
};

// @desc    Check AI status
// @route   GET /api/admin/ai/status
// @access  Private
export const getAIStatus = async (req, res) => {
  try {
    const status = await checkAIStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Get AI status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get supported AI providers
// @route   GET /api/admin/ai/providers
// @access  Private
export const getProviders = async (req, res) => {
  try {
    const providers = getSupportedProviders();
    res.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Generate content for a section
// @route   POST /api/admin/ai/generate/:section
// @access  Private
export const generateSectionContent = async (req, res) => {
  try {
    const { section } = req.params;
    const { propertyId, propertyData } = req.body;

    let property;

    // If propertyData is provided directly, use it (for unsaved properties)
    // Otherwise, fetch from database using propertyId
    if (propertyData) {
      property = propertyData;
    } else if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Property data or ID is required',
      });
    }

    // Get prompt for section
    const promptFn = AI_PROMPTS[section];
    if (!promptFn) {
      return res.status(400).json({
        success: false,
        message: 'Invalid section',
      });
    }

    let parsedContent;
    let usedFallback = false;

    try {
      // Generate prompt with property data
      const prompt = promptFn(property);

      // Call AI
      const generatedText = await generateContent(prompt);

      // Log the raw AI response for debugging
      console.log(`\n=== AI Response for ${section} ===`);
      console.log('Raw response:', generatedText?.substring(0, 500));

      // Parse the response
      parsedContent = parseGeneratedContent(section, generatedText);
      console.log('Parsed result:', JSON.stringify(parsedContent)?.substring(0, 200));

      // If parsing failed or returned null, use fallback
      if (!parsedContent || Object.keys(parsedContent).length === 0) {
        console.log('AI response could not be parsed, using fallback content');
        parsedContent = getMockContent(section, property);
        usedFallback = true;
      }
    } catch (aiError) {
      console.error('AI generation failed, using fallback content:', aiError.message);
      // Use mock content fallback when AI fails
      parsedContent = getMockContent(section, property);
      usedFallback = true;
    }

    // If property was fetched from DB, save the generated content
    if (propertyId && property._id && !usedFallback) {
      try {
        const dbProperty = await Property.findById(propertyId);
        if (dbProperty) {
          if (!dbProperty.generatedContent) {
            dbProperty.generatedContent = {};
          }
          Object.assign(dbProperty.generatedContent, parsedContent);
          await dbProperty.save();
        }
      } catch (saveError) {
        console.error('Failed to save content to database:', saveError);
        // Continue even if save fails - return content anyway
      }
    }

    res.json({
      success: true,
      data: {
        section,
        content: parsedContent,
        fallback: usedFallback,
      },
    });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate content',
    });
  }
};

// @desc    Save edited content
// @route   PUT /api/admin/content/:propertyId/:section
// @access  Private
export const saveContent = async (req, res) => {
  try {
    const { propertyId, section } = req.params;
    const content = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Initialize generatedContent if needed
    if (!property.generatedContent) {
      property.generatedContent = {};
    }

    // Update the section content
    property.generatedContent[section] = content;
    property.markModified('generatedContent');
    await property.save();

    res.json({
      success: true,
      data: property.generatedContent[section],
    });
  } catch (error) {
    console.error('Save content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get content for a property
// @route   GET /api/admin/content/:propertyId
// @access  Private
export const getPropertyContent = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
      success: true,
      data: property.generatedContent || {},
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Helper to detect if GLM returned JavaScript/JSON instead of plain text
const containsJavaScriptCode = (text) => {
  if (!text || typeof text !== 'string') return false;
  // Check for patterns like { name: '...' } or [{ ... }]
  return /\{\s*(name|title|question|answer|icon|distance)\s*:/i.test(text) ||
         /\[\s*\{/.test(text);
};

// Parse generated content based on section
const parseGeneratedContent = (section, text) => {
  // If GLM returned JavaScript code instead of plain text, reject it
  if (containsJavaScriptCode(text)) {
    console.log(`⚠️ GLM returned JavaScript/JSON instead of plain text for ${section}, using fallback`);
    return null;
  }

  const parsers = {
    hero: (text) => {
      const headline = text.match(/Headline:\s*(.+)/i)?.[1] || '';
      const subheadline = text.match(/Subheadline:\s*(.+)/i)?.[1] || '';
      const ctaText = text.match(/CTA:\s*(.+)/i)?.[1] || 'Get Details';
      const badge = text.match(/Badge:\s*(.+)/i)?.[1] || '';
      const offerValidity = text.match(/Offer Validity:\s*(.+)/i)?.[1]?.trim() || '';

      // Extract offers
      const offers = [];
      const offerRegex = /Offer\s*\d+:\s*(.+)/gi;
      let offerMatch;
      while ((offerMatch = offerRegex.exec(text)) !== null) {
        const offerText = offerMatch[1].trim();
        if (offerText) {
          offers.push({
            icon: offerText.toLowerCase().includes('emi') ? 'percent' :
                  offerText.toLowerCase().includes('parking') ? 'tag' :
                  offerText.toLowerCase().includes('discount') ? 'clock' : 'gift',
            text: offerText,
            highlight: offers.length === 0 // First offer is highlighted
          });
        }
      }

      if (!headline) return null;
      return { headline, subheadline, ctaText, badge, offers, offerValidity };
    },
    overview: (text) => {
      const description = text.match(/Description:\s*([\s\S]+?)(?=Key Points:|$)/i)?.[1]?.trim() || '';
      const keyPointsMatch = text.match(/Key Points:\s*([\s\S]+)$/i)?.[1];
      const keyPoints = keyPointsMatch?.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()).slice(0, 5) || [];
      if (!description) return null;
      return { description, keyPoints };
    },
    highlights: (text) => {
      const highlights = [];
      // More flexible regex that handles multi-line descriptions
      const regex = /\d+\.\s*([^:\n]+):\s*([\s\S]+?)(?=\d+\.|$)/gi;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const title = match[1].trim();
        const description = match[2].trim();
        if (title && description) {
          highlights.push({ icon: 'star', title, description });
        }
      }
      console.log(`Parsed ${highlights.length} highlights from AI response`);
      if (highlights.length === 0) return null;
      return highlights.slice(0, 8);
    },
    location: (text) => {
      // Only parse connectivity - nearby places are manually entered
      const connectivity = text.match(/Connectivity:\s*([\s\S]+?)$/i)?.[1]?.trim() || '';

      // Validate we have meaningful content
      if (!connectivity) {
        return null;
      }

      return { connectivity };
    },
    investment: (text) => {
      const benefitsMatch = text.match(/Benefits:\s*([\s\S]+?)(?=Rental|$)/i)?.[1]?.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()) || [];
      const rentalPotential = text.match(/Rental Potential:\s*([\s\S]+?)(?=Future|$)/i)?.[1]?.trim() || '';
      const futureGrowth = text.match(/Future Growth:\s*([\s\S]+)$/i)?.[1]?.trim() || '';
      if (benefitsMatch.length === 0 && !rentalPotential && !futureGrowth) return null;
      return { benefits: benefitsMatch.slice(0, 5), rentalPotential, futureGrowth };
    },
    faq: (text) => {
      const faqs = [];
      // More flexible regex that handles multi-line answers
      const regex = /Q\d*:\s*([^\n]+)\s*A\d*:\s*([\s\S]+?)(?=Q\d*:|$)/gi;
      let match;
      while ((match = regex.exec(text)) !== null) {
        const question = match[1].trim();
        const answer = match[2].trim();
        if (question && answer) {
          faqs.push({ question, answer });
        }
      }
      console.log(`Parsed ${faqs.length} FAQs from AI response`);
      if (faqs.length === 0) return null;
      return faqs.slice(0, 10);
    },
    builder: (text) => {
      const aboutBuilder = text.match(/About:\s*([\s\S]+?)(?=Experience|$)/i)?.[1]?.trim() || '';
      const experience = text.match(/Experience:\s*(.+)/i)?.[1]?.trim() || '';
      const totalProjects = text.match(/Total Projects:\s*(.+)/i)?.[1]?.trim() || '';
      const keyFactsMatch = text.match(/Key Facts:\s*([\s\S]+)$/i)?.[1]?.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()) || [];
      if (!aboutBuilder) return null;
      return { aboutBuilder, experience, totalProjects, keyFacts: keyFactsMatch.slice(0, 5) };
    },
    seo: (text) => {
      const metaTitle = text.match(/Title:\s*(.+)/i)?.[1]?.trim() || '';
      const metaDescription = text.match(/Description:\s*([\s\S]+?)(?=Keywords|$)/i)?.[1]?.trim() || '';
      const keywordsMatch = text.match(/Keywords:\s*(.+)/i)?.[1]?.split(',').map(k => k.trim()) || [];
      if (!metaTitle) return null;
      return { metaTitle, metaDescription, keywords: keywordsMatch.slice(0, 10) };
    },
  };

  try {
    const result = parsers[section] ? parsers[section](text) : {};
    // If parser returned null, signal to use fallback
    if (!result) return null;
    return result;
  } catch (error) {
    console.error('Parse error:', error);
    return null;
  }
};

export default {
  getAIStatus,
  getProviders,
  generateSectionContent,
  saveContent,
  getPropertyContent,
};