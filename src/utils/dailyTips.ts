import { DailyTip } from '../types';

// Fallback tips that work without any external dependencies
const FALLBACK_TIPS: Omit<DailyTip, 'id' | 'date'>[] = [
  {
    content: "🚶‍♀️ Walk or bike for trips under 2 miles. You'll save about 1 kg of CO₂ per mile and get great exercise!",
    category: 'transportation',
    isAI: false
  },
  {
    content: "💡 Switch to LED bulbs - they use 75% less energy and last 25 times longer than incandescent bulbs.",
    category: 'energy',
    isAI: false
  },
  {
    content: "🌱 Try 'Meatless Monday' - skipping meat one day per week can save 1,900 lbs of CO₂ annually.",
    category: 'food',
    isAI: false
  },
  {
    content: "♻️ Bring a reusable water bottle - Americans use 50 billion plastic bottles yearly, most ending up in landfills.",
    category: 'waste',
    isAI: false
  },
  {
    content: "🌡️ Lower your thermostat by 2°F in winter and raise it 2°F in summer to save 2,000 lbs of CO₂ yearly.",
    category: 'energy',
    isAI: false
  },
  {
    content: "🚗 Combine errands into one trip - cold starts use more fuel and produce more emissions than warm engines.",
    category: 'transportation',
    isAI: false
  },
  {
    content: "🥬 Buy local and seasonal produce when possible - it reduces transportation emissions and supports local farmers.",
    category: 'food',
    isAI: false
  },
  {
    content: "📱 Keep your devices longer - extending a phone's life by just one year reduces its environmental impact by 25%.",
    category: 'waste',
    isAI: false
  },
  {
    content: "🚿 Take shorter showers - reducing shower time by 2 minutes can save 1,750 gallons of water annually.",
    category: 'energy',
    isAI: false
  },
  {
    content: "🏠 Unplug electronics when not in use - phantom loads account for 5-10% of residential electricity use.",
    category: 'energy',
    isAI: false
  }
];

const STORAGE_KEY = 'carbontrackr_daily_tip';

// Simple hash function to get consistent daily tips
const getDateHash = (date: string): number => {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    const char = date.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Get today's tip (deterministic based on date)
export const getTodaysTip = (): DailyTip => {
  const today = new Date().toDateString();
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // Check if we have a stored tip for today
  if (stored) {
    try {
      const parsedTip: DailyTip = JSON.parse(stored);
      if (parsedTip.date === today) {
        return parsedTip;
      }
    } catch (error) {
      console.warn('Error parsing stored tip:', error);
    }
  }
  
  // Generate new tip for today
  const dateHash = getDateHash(today);
  const tipIndex = dateHash % FALLBACK_TIPS.length;
  const selectedTip = FALLBACK_TIPS[tipIndex];
  
  const todaysTip: DailyTip = {
    id: `tip_${today}_${tipIndex}`,
    date: today,
    ...selectedTip
  };
  
  // Try to enhance with AI if available (optional)
  enhanceTipWithAI(todaysTip).then(enhancedTip => {
    if (enhancedTip) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enhancedTip));
      } catch (error) {
        console.warn('Could not save enhanced tip:', error);
      }
    }
  }).catch(() => {
    // Silently fail - AI enhancement is optional
  });
  
  // Store and return fallback tip immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todaysTip));
  } catch (error) {
    console.warn('Could not save tip:', error);
  }
  
  return todaysTip;
};

// Optional AI enhancement (completely non-blocking)
const enhanceTipWithAI = async (baseTip: DailyTip): Promise<DailyTip | null> => {
  // Only attempt AI enhancement if user has provided an API key
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    return null;
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an environmental expert. Enhance the given eco-tip with a specific, actionable insight. Keep it under 150 characters and include an emoji. Focus on practical impact.'
          },
          {
            role: 'user',
            content: `Enhance this eco-tip for the ${baseTip.category} category: ${baseTip.content}`
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    const enhancedContent = data.choices?.[0]?.message?.content?.trim();
    
    if (enhancedContent && enhancedContent.length > 10) {
      return {
        ...baseTip,
        content: enhancedContent,
        isAI: true
      };
    }
  } catch (error) {
    // Silently fail - this is optional enhancement
    console.warn('AI enhancement failed (this is normal):', error);
  }
  
  return null;
};

// Optional: Allow users to set their OpenAI API key
export const setOpenAIKey = (key: string): void => {
  try {
    if (key.trim()) {
      localStorage.setItem('openai_api_key', key.trim());
    } else {
      localStorage.removeItem('openai_api_key');
    }
  } catch (error) {
    console.warn('Could not save API key:', error);
  }
};

export const hasOpenAIKey = (): boolean => {
  try {
    return !!localStorage.getItem('openai_api_key');
  } catch {
    return false;
  }
};