import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, Settings, X } from 'lucide-react';
import { DailyTip as DailyTipType } from '../types';
import { getTodaysTip, setOpenAIKey, hasOpenAIKey } from '../utils/dailyTips';

export const DailyTip: React.FC = () => {
  const [tip, setTip] = useState<DailyTipType | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load today's tip
    try {
      const todaysTip = getTodaysTip();
      setTip(todaysTip);
    } catch (error) {
      console.warn('Could not load daily tip:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveApiKey = () => {
    setOpenAIKey(apiKey);
    setShowSettings(false);
    setApiKey('');
    
    // Refresh tip to potentially get AI enhancement
    setTimeout(() => {
      try {
        const refreshedTip = getTodaysTip();
        setTip(refreshedTip);
      } catch (error) {
        console.warn('Could not refresh tip:', error);
      }
    }, 1000);
  };

  const getCategoryIcon = (category: string): string => {
    switch (category) {
      case 'transportation': return '🚗';
      case 'energy': return '⚡';
      case 'food': return '🍃';
      case 'waste': return '♻️';
      default: return '🌱';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'transportation': return 'from-green-50 to-emerald-50 border-green-200';
      case 'energy': return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'food': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'waste': return 'from-gray-50 to-slate-50 border-gray-200';
      default: return 'from-green-50 to-emerald-50 border-green-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 py-3 sm:py-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!tip) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(tip.category)} px-4 sm:px-6 py-3 sm:py-4 border-b`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
                💡 Daily Eco Tip
                {tip.isAI && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 border border-purple-200">
                    <Sparkles className="w-3 h-3" />
                    AI Enhanced
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-600 flex items-center gap-1">
                {getCategoryIcon(tip.category)}
                {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)} • Today
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg transition-colors duration-200"
            title="AI Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
          {tip.content}
        </p>

        {/* AI Settings Panel */}
        {showSettings && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-4 space-y-3 animate-scale-in">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Enhancement Settings
              </h4>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-gray-600">
              {hasOpenAIKey() 
                ? "✅ AI enhancement is enabled. Tips will be personalized when possible."
                : "Add your OpenAI API key to get AI-enhanced daily tips (optional)."
              }
            </p>
            
            {!hasOpenAIKey() && (
              <div className="space-y-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey.trim()}
                    className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
                  >
                    Save Key
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
            
            {hasOpenAIKey() && (
              <button
                onClick={() => {
                  setOpenAIKey('');
                  setShowSettings(false);
                }}
                className="text-xs text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Remove API Key
              </button>
            )}
          </div>
        )}

        {/* Info Footer */}
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="flex items-center gap-1">
            🔄 Tips refresh daily • 
            {tip.isAI ? ' Enhanced by AI' : ' Curated by experts'}
          </p>
        </div>
      </div>
    </div>
  );
};