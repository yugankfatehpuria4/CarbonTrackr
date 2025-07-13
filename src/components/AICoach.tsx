import React, { useState, useEffect } from 'react';
import { Bot, MessageCircle, Settings, X, Send, Sparkles, Lock } from 'lucide-react';
import { EmissionResult, AIRecommendation } from '../types';
import { generatePersonalizedRecommendation, askAICoach, getAISettings, saveAISettings, AISettings } from '../utils/aiCoach';

interface AICoachProps {
  emissionResults: EmissionResult[];
  totalEmissions: number;
  showRecommendation?: boolean;
}

export const AICoach: React.FC<AICoachProps> = ({ 
  emissionResults, 
  totalEmissions, 
  showRecommendation = false 
}) => {
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [settings, setSettings] = useState<AISettings>(getAISettings());

  // Generate personalized recommendation when results change
  useEffect(() => {
    if (showRecommendation && emissionResults.length > 0 && settings.enabled) {
      setIsLoadingRecommendation(true);
      generatePersonalizedRecommendation(emissionResults, totalEmissions)
        .then(rec => {
          setRecommendation(rec);
        })
        .finally(() => {
          setIsLoadingRecommendation(false);
        });
    }
  }, [emissionResults, totalEmissions, showRecommendation, settings.enabled]);

  const handleSettingsUpdate = (newSettings: Partial<AISettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveAISettings(updatedSettings);
  };

  const handleAskQuestion = async () => {
    if (!chatQuestion.trim() || isLoadingChat) return;

    setIsLoadingChat(true);
    setChatResponse('');

    try {
      const response = await askAICoach(chatQuestion);
      setChatResponse(response || 'Sorry, I couldn\'t generate a response right now. Please try again.');
    } catch (error) {
      setChatResponse('Sorry, there was an error. Please check your API key and try again.');
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAskQuestion();
    }
  };

  if (!settings.enabled && !showSettings) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg border border-purple-200 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                🤖 AI Eco Coach
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">Get personalized carbon reduction tips</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
          >
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            Enable AI
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow-lg border border-purple-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                🤖 AI Eco Coach
              </h3>
              <p className="text-xs sm:text-sm text-purple-100">Powered by GPT • Personalized for you</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="Ask AI Coach"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 sm:p-2 text-white hover:bg-white/20 rounded-lg transition-colors duration-200"
              title="AI Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-lg border border-purple-200 p-4 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Coach Settings
              </h4>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => handleSettingsUpdate({ apiKey: e.target.value })}
                  placeholder="sk-..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Enable AI Coach</span>
                <button
                  onClick={() => handleSettingsUpdate({ enabled: !settings.enabled })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                    settings.enabled ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Personalized Tips</span>
                <button
                  onClick={() => handleSettingsUpdate({ personalizedTips: !settings.personalizedTips })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                    settings.personalizedTips ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.personalizedTips ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <p>💡 Your API key is stored locally and never shared. Get one at <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">OpenAI</a></p>
            </div>
          </div>
        )}

        {/* Personalized Recommendation */}
        {settings.enabled && showRecommendation && (
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              🎯 Personalized Recommendation
            </h4>
            
            {isLoadingRecommendation ? (
              <div className="bg-white rounded-lg border border-purple-200 p-4 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ) : recommendation ? (
              <div className="bg-white rounded-lg border border-purple-200 p-4 shadow-sm animate-scale-in">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {recommendation.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-purple-600">
                      <Sparkles className="w-3 h-3" />
                      <span>Personalized for your {recommendation.category.toLowerCase()} footprint</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : settings.apiKey ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500">
                💭 Calculate your footprint to get personalized AI recommendations
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Add your OpenAI API key to enable personalized recommendations
              </div>
            )}
          </div>
        )}

        {/* Chat Interface */}
        {showChat && settings.enabled && settings.apiKey && (
          <div className="space-y-3 sm:space-y-4 animate-scale-in">
            <h4 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-purple-600" />
              💬 Ask Your AI Coach
            </h4>
            
            <div className="bg-white rounded-lg border border-purple-200 p-4 space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What else can I do to reduce emissions?"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  disabled={isLoadingChat}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!chatQuestion.trim() || isLoadingChat}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-1"
                >
                  {isLoadingChat ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {isLoadingChat && (
                <div className="bg-gray-50 rounded-lg p-3 animate-pulse">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <Bot className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="text-sm text-gray-500">AI Coach is thinking...</div>
                  </div>
                </div>
              )}
              
              {chatResponse && (
                <div className="bg-gray-50 rounded-lg p-3 animate-scale-in">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-purple-600" />
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {chatResponse}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-xs text-gray-500 text-center">
                💡 Try asking: "How can I reduce my transportation emissions?" or "What are the best energy-saving tips?"
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};