import React from 'react';
import { Lightbulb, Car, Zap, Beef, Recycle } from 'lucide-react';
import { SuggestionData } from '../types';

interface SuggestionsProps {
  suggestion: SuggestionData;
}

const iconMap = {
  Car,
  Zap,
  Beef,
  Recycle,
  Leaf: Lightbulb
};

export const Suggestions: React.FC<SuggestionsProps> = ({ suggestion }) => {
  const IconComponent = iconMap[suggestion.icon as keyof typeof iconMap] || Lightbulb;

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-lg border border-green-200 p-4 sm:p-6">
      <div className="flex items-start space-x-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
        <div className="flex-1 space-y-1 sm:space-y-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span>💡 Eco Tip</span>
          </h3>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {suggestion.message}
          </p>
          <div className="text-xs sm:text-sm text-green-600 font-medium flex items-center gap-1">
            🎯
            Focus area: {suggestion.category}
          </div>
        </div>
      </div>
    </div>
  );
};