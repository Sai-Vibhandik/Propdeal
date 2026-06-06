import { GeneratedContent, Property } from '../models/index.js';
import { generateContent, checkOllamaStatus } from '../config/ollama.js';
import AI_PROMPTS from '../services/prompts.js';

// @desc    Check AI status
// @route   GET /api/admin/ai/status
// @access  Private
export const getAIStatus = async (req, res) => {
  try {
    const status = await checkOllamaStatus();
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

// @desc    Generate content for a section
// @route   POST /api/admin/ai/generate/:section
// @access  Private
export const generateSectionContent = async (req, res) => {
  try {
    const { section } = req.params;
    const { propertyId } = req.body;

    // Get property data
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
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

    // Generate prompt
    const prompt = promptFn(property);

    // Call AI
    const generatedText = await generateContent(prompt);

    // Parse the response
    const parsedContent = parseGeneratedContent(section, generatedText);

    // Save to database
    let content = await GeneratedContent.findOne({ propertyId, section });

    if (content) {
      // Update existing
      Object.assign(content, parsedContent, {
        edited: false,
        generatedAt: new Date(),
        modelUsed: process.env.OLLAMA_MODEL || 'llama3',
        promptUsed: prompt,
      });
      await content.save();
    } else {
      // Create new
      content = await GeneratedContent.create({
        propertyId,
        section,
        ...parsedContent,
        modelUsed: process.env.OLLAMA_MODEL || 'llama3',
        promptUsed: prompt,
      });
    }

    res.json({
      success: true,
      data: content,
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

    let existingContent = await GeneratedContent.findOne({ propertyId, section });

    if (existingContent) {
      Object.assign(existingContent, content, {
        edited: true,
        editedAt: new Date(),
        editedBy: req.user._id,
      });
      await existingContent.save();
    } else {
      existingContent = await GeneratedContent.create({
        propertyId,
        section,
        ...content,
        edited: true,
        editedAt: new Date(),
        editedBy: req.user._id,
      });
    }

    res.json({
      success: true,
      data: existingContent,
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

    const content = await GeneratedContent.find({ propertyId });

    // Convert to object keyed by section
    const contentMap = {};
    content.forEach((c) => {
      contentMap[c.section] = c;
    });

    res.json({
      success: true,
      data: contentMap,
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Parse generated content based on section
const parseGeneratedContent = (section, text) => {
  const parsers = {
    hero: (text) => {
      const headline = text.match(/Headline:\s*(.+)/i)?.[1] || '';
      const subheadline = text.match(/Subheadline:\s*(.+)/i)?.[1] || '';
      const ctaText = text.match(/CTA:\s*(.+)/i)?.[1] || 'Get Details';
      return { hero: { headline, subheadline, ctaText } };
    },
    overview: (text) => {
      const description = text.match(/Description:\s*([\s\S]+?)(?=Key Points:|$)/i)?.[1]?.trim() || '';
      const keyPointsMatch = text.match(/Key Points:\s*([\s\S]+)$/i)?.[1];
      const keyPoints = keyPointsMatch?.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()).slice(0, 5) || [];
      return { overview: { description, keyPoints } };
    },
    highlights: (text) => {
      const highlights = [];
      const regex = /\d+\.\s*(.+?):\s*(.+?)(?=\d+\.|$)/gi;
      let match;
      while ((match = regex.exec(text)) !== null) {
        highlights.push({ title: match[1].trim(), description: match[2].trim() });
      }
      return { highlights: highlights.slice(0, 8) };
    },
    location: (text) => {
      const connectivity = text.match(/Connectivity:\s*([\s\S]+?)(?=Nearby|$)/i)?.[1]?.trim() || '';
      const nearbyMatch = text.match(/Nearby Places:\s*([\s\S]+)$/i)?.[1];
      const nearbyPlaces = nearbyMatch?.split('\n').filter(Boolean).map(line => {
        const parts = line.replace(/^[-•]\s*/, '').split('-');
        return { name: parts[0]?.trim(), distance: parts[1]?.trim(), type: parts[2]?.trim() };
      }).slice(0, 10) || [];
      return { location: { connectivity, nearbyPlaces } };
    },
    investment: (text) => {
      const benefitsMatch = text.match(/Benefits:\s*([\s\S]+?)(?=Rental|$)/i)?.[1]?.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()) || [];
      const rentalPotential = text.match(/Rental Potential:\s*([\s\S]+?)(?=Future|$)/i)?.[1]?.trim() || '';
      const futureGrowth = text.match(/Future Growth:\s*([\s\S]+)$/i)?.[1]?.trim() || '';
      return { investment: { benefits: benefitsMatch.slice(0, 5), rentalPotential, futureGrowth } };
    },
    faq: (text) => {
      const faqs = [];
      const regex = /Q\d*:\s*(.+?)\s*A\d*:\s*(.+?)(?=Q\d*:|$)/gi;
      let match;
      while ((match = regex.exec(text)) !== null) {
        faqs.push({ question: match[1].trim(), answer: match[2].trim() });
      }
      return { faqs: faqs.slice(0, 10) };
    },
    builder: (text) => {
      const aboutBuilder = text.match(/About:\s*([\s\S]+?)(?=Experience|$)/i)?.[1]?.trim() || '';
      const experience = text.match(/Experience:\s*(.+)/i)?.[1]?.trim() || '';
      const totalProjects = text.match(/Total Projects:\s*(.+)/i)?.[1]?.trim() || '';
      const keyFactsMatch = text.match(/Key Facts:\s*([\s\S]+)$/i)?.[1]?.split('\n').filter(Boolean).map(s => s.replace(/^[-•]\s*/, '').trim()) || [];
      return { builder: { aboutBuilder, experience, totalProjects, keyFacts: keyFactsMatch.slice(0, 5) } };
    },
    seo: (text) => {
      const metaTitle = text.match(/Title:\s*(.+)/i)?.[1]?.trim() || '';
      const metaDescription = text.match(/Description:\s*([\s\S]+?)(?=Keywords|$)/i)?.[1]?.trim() || '';
      const keywordsMatch = text.match(/Keywords:\s*(.+)/i)?.[1]?.split(',').map(k => k.trim()) || [];
      return { seo: { metaTitle, metaDescription, keywords: keywordsMatch.slice(0, 10) } };
    },
  };

  return parsers[section] ? parsers[section](text) : {};
};

export default {
  getAIStatus,
  generateSectionContent,
  saveContent,
  getPropertyContent,
};