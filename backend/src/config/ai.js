/**
 * AI Service Configuration
 * Supports multiple providers: Ollama, OpenAI, Anthropic (Claude), Google Gemini
 *
 * Set AI_PROVIDER in .env to: 'ollama', 'openai', 'anthropic', or 'gemini'
 * Then configure the corresponding API keys/URLs
 */

import dotenv from 'dotenv';

// Load environment variables first (needed for ES modules)
dotenv.config();

// AI Provider Configuration
const AI_PROVIDERS = {
  ollama: {
    name: 'Ollama (Local)',
    url: process.env.OLLAMA_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3',
    apiKey: process.env.OLLAMA_API_KEY || null, // Optional: for cloud-hosted Ollama
  },
  openai: {
    name: 'OpenAI',
    url: 'https://api.openai.com/v1',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY,
  },
  anthropic: {
    name: 'Anthropic (Claude)',
    url: 'https://api.anthropic.com/v1',
    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
  gemini: {
    name: 'Google Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    apiKey: process.env.GEMINI_API_KEY,
  },
};

// Get current provider from env
const CURRENT_PROVIDER = process.env.AI_PROVIDER || 'ollama';

/**
 * Generate content using the configured AI provider
 */
export const generateContent = async (prompt, options = {}) => {
  const provider = AI_PROVIDERS[CURRENT_PROVIDER];

  if (!provider) {
    throw new Error(`Unknown AI provider: ${CURRENT_PROVIDER}`);
  }

  console.log(`Using AI provider: ${provider.name} (${provider.model})`);

  switch (CURRENT_PROVIDER) {
    case 'ollama':
      return await generateWithOllama(provider, prompt, options);
    case 'openai':
      return await generateWithOpenAI(provider, prompt, options);
    case 'anthropic':
      return await generateWithAnthropic(provider, prompt, options);
    case 'gemini':
      return await generateWithGemini(provider, prompt, options);
    default:
      throw new Error(`Unsupported AI provider: ${CURRENT_PROVIDER}`);
  }
};

/**
 * Ollama (Local LLM)
 */
const generateWithOllama = async (provider, prompt, options) => {
  try {
    // Build headers - include Authorization if API key is provided
    const headers = {
      'Content-Type': 'application/json',
    };

    if (provider.apiKey) {
      headers['Authorization'] = `Bearer ${provider.apiKey}`;
    }

    const response = await fetch(`${provider.url}/api/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: provider.model,
        prompt,
        stream: false,
        // System prompt to enforce plain text output
        system: 'CRITICAL: You MUST return ONLY plain text formatted as specified in the user prompt. NEVER return JavaScript code, JSON objects, or JavaScript arrays. Do NOT use square brackets [], curly braces {}, or JavaScript syntax. Always use the EXACT plain text format shown in the examples.',
        options: {
          temperature: options.temperature || 0.7,
          top_p: options.topP || 0.9,
          num_predict: options.maxTokens || 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Ollama generation error:', error);
    throw new Error(`Ollama generation failed: ${error.message}`);
  }
};

/**
 * OpenAI (GPT models)
 */
const generateWithOpenAI = async (provider, prompt, options) => {
  if (!provider.apiKey) {
    throw new Error('OpenAI API key not configured. Set OPENAI_API_KEY in .env');
  }

  try {
    const response = await fetch(`${provider.url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional real estate content writer. Generate high-quality, engaging content for property listings.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI generation error:', error);
    throw new Error(`OpenAI generation failed: ${error.message}`);
  }
};

/**
 * Anthropic (Claude)
 */
const generateWithAnthropic = async (provider, prompt, options) => {
  if (!provider.apiKey) {
    throw new Error('Anthropic API key not configured. Set ANTHROPIC_API_KEY in .env');
  }

  try {
    const response = await fetch(`${provider.url}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: options.maxTokens || 2000,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        system: 'You are a professional real estate content writer. Generate high-quality, engaging content for property listings.',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Anthropic request failed');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Anthropic generation error:', error);
    throw new Error(`Anthropic generation failed: ${error.message}`);
  }
};

/**
 * Google Gemini
 */
const generateWithGemini = async (provider, prompt, options) => {
  if (!provider.apiKey) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in .env');
  }

  try {
    const response = await fetch(
      `${provider.url}/models/${provider.model}:generateContent?key=${provider.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a professional real estate content writer. Generate high-quality, engaging content for property listings.\n\n${prompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Gemini request failed');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini generation error:', error);
    throw new Error(`Gemini generation failed: ${error.message}`);
  }
};

/**
 * Check AI provider status
 */
export const checkAIStatus = async () => {
  const provider = AI_PROVIDERS[CURRENT_PROVIDER];

  if (!provider) {
    return {
      available: false,
      provider: CURRENT_PROVIDER,
      error: `Unknown AI provider: ${CURRENT_PROVIDER}`,
    };
  }

  // For API-based providers, just check if key is configured
  if (provider.apiKey !== undefined && !provider.apiKey) {
    return {
      available: false,
      provider: provider.name,
      model: provider.model,
      error: `API key not configured. Set ${CURRENT_PROVIDER.toUpperCase()}_API_KEY in .env`,
    };
  }

  // For Ollama, check if server is running
  if (CURRENT_PROVIDER === 'ollama') {
    try {
      // Build headers - include Authorization if API key is provided
      const headers = {};
      if (provider.apiKey) {
        headers['Authorization'] = `Bearer ${provider.apiKey}`;
      }

      const response = await fetch(`${provider.url}/api/tags`, { headers });
      if (!response.ok) {
        return {
          available: false,
          provider: provider.name,
          error: provider.apiKey ? 'Ollama API authentication failed' : 'Ollama server not running',
        };
      }
      const data = await response.json();
      return {
        available: true,
        provider: provider.name,
        model: provider.model,
        models: data.models || [],
      };
    } catch (error) {
      return {
        available: false,
        provider: provider.name,
        error: provider.apiKey ? 'Ollama API not reachable' : 'Ollama server not reachable',
      };
    }
  }

  // For other providers with API keys, assume available
  return {
    available: true,
    provider: provider.name,
    model: provider.model,
  };
};

/**
 * Get list of supported providers
 */
export const getSupportedProviders = () => {
  return Object.entries(AI_PROVIDERS).map(([key, config]) => ({
    id: key,
    name: config.name,
    // For Ollama, always show as configured (works with or without API key)
    // For other providers, require API key
    configured: key === 'ollama' ? true : !!config.apiKey,
  }));
};

export default {
  generateContent,
  checkAIStatus,
  getSupportedProviders,
};