import { EmissionResult, AIRecommendation } from '../types';

const STORAGE_KEY = 'carbontrackr_ai_settings';

export interface AISettings {
  apiKey: string;
  enabled: boolean;
  personalizedTips: boolean;
}

export const getAISettings = (): AISettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Error loading AI settings:', error);
  }
  
  return {
    apiKey: '',
    enabled: false,
    personalizedTips: true
  };
};

export const saveAISettings = (settings: AISettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Error saving AI settings:', error);
  }
};

export const generatePersonalizedRecommendation = async (
  emissionResults: EmissionResult[],
  totalEmissions: number
): Promise<AIRecommendation | null> => {
  const settings = getAISettings();
  
  if (!settings.enabled || !settings.apiKey || !settings.personalizedTips) {
    return null;
  }

  if (emissionResults.length === 0) {
    return null;
  }

  try {
    const highestEmission = emissionResults.reduce((max, current) => 
      current.amount > max.amount ? current : max
    );

    const breakdown = emissionResults.reduce((acc, result) => {
      acc[result.category.toLowerCase()] = result.amount;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `You are an expert environmental coach. Based on this carbon footprint data:

Total daily emissions: ${totalEmissions.toFixed(1)} kg CO₂
Highest impact category: ${highestEmission.category} (${highestEmission.amount.toFixed(1)} kg CO₂, ${highestEmission.percentage.toFixed(1)}%)

Breakdown:
${emissionResults.map(r => `- ${r.category}: ${r.amount.toFixed(1)} kg CO₂ (${r.percentage.toFixed(1)}%)`).join('\n')}

Provide ONE specific, actionable tip to reduce emissions in the highest impact category. Be encouraging, specific, and include a realistic impact estimate. Keep it under 120 characters and start with an emoji.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful environmental coach. Provide concise, actionable eco-tips with emojis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 80,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();

    if (content && content.length > 10) {
      return {
        id: `ai_rec_${Date.now()}`,
        content,
        category: highestEmission.category,
        timestamp: new Date().toISOString(),
        isPersonalized: true,
        footprintData: {
          total: totalEmissions,
          highestCategory: highestEmission.category,
          breakdown
        }
      };
    }
  } catch (error) {
    console.warn('AI recommendation failed (this is normal):', error);
  }

  return null;
};

export const askAICoach = async (question: string): Promise<string | null> => {
  const settings = getAISettings();
  
  if (!settings.enabled || !settings.apiKey) {
    return null;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert environmental coach specializing in carbon footprint reduction. Provide practical, actionable advice that people can implement immediately. Be encouraging and specific.'
          },
          {
            role: 'user',
            content: question
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.warn('AI coach question failed:', error);
    return null;
  }
};