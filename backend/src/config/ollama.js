const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

export const generateContent = async (prompt, options = {}) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || OLLAMA_MODEL,
        prompt,
        stream: false,
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
    throw new Error(`AI generation failed: ${error.message}`);
  }
};

export const checkOllamaStatus = async () => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) return { available: false, models: [] };
    const data = await response.json();
    return {
      available: true,
      models: data.models || [],
      defaultModel: OLLAMA_MODEL,
    };
  } catch (error) {
    return { available: false, models: [], error: error.message };
  }
};

export default { generateContent, checkOllamaStatus };