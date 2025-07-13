import React from 'react';
import { Leaf, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { EmissionResult } from '../types';
import { PieChart } from './PieChart';

interface ResultsDisplayProps {
  results: EmissionResult[];
  total: number;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, total }) => {
  // National average is approximately 6.8 kg CO₂ per day per person
  const nationalAverage = 6.8;
  const percentageVsAverage = ((total - nationalAverage) / nationalAverage) * 100;
  
  const getImpactLevel = (total: number): { 
    level: string; 
    color: string; 
    description: string;
    comparison: string;
    icon: React.ReactNode;
  } => {
    if (total < 3) return { 
      level: 'Excellent', 
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200', 
      description: 'Outstanding! Your carbon footprint is exceptionally low.',
      comparison: 'Well below national average',
      icon: <TrendingDown className="w-4 h-4 text-emerald-600" />
    };
    if (total < 5) return { 
      level: 'Good', 
      color: 'text-green-700 bg-green-50 border-green-200', 
      description: 'Great job! Your carbon footprint is below average.',
      comparison: 'Below national average',
      icon: <TrendingDown className="w-4 h-4 text-green-600" />
    };
    if (total < 7) return { 
      level: 'Average', 
      color: 'text-amber-700 bg-amber-50 border-amber-200', 
      description: 'Your carbon footprint is around the national average.',
      comparison: 'Close to national average',
      icon: <Minus className="w-4 h-4 text-amber-600" />
    };
    if (total < 10) return { 
      level: 'High', 
      color: 'text-orange-700 bg-orange-50 border-orange-200', 
      description: 'Your carbon footprint is above average. Small changes can help!',
      comparison: 'Above national average',
      icon: <TrendingUp className="w-4 h-4 text-orange-600" />
    };
    return { 
      level: 'Very High', 
      color: 'text-red-700 bg-red-50 border-red-200', 
      description: 'Your carbon footprint is significantly high. Every change counts!',
      comparison: 'Well above national average',
      icon: <TrendingUp className="w-4 h-4 text-red-600" />
    };
  };

  const impact = getImpactLevel(total);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">🌱 Your Carbon Footprint</h2>
        </div>
      </div>

      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Main Stat Display */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {total.toFixed(1)}
            </div>
            <div className="text-base sm:text-xl text-gray-600 font-medium">
              kg CO₂ emitted today
            </div>
          </div>
          
          {/* Impact Badge */}
          <div className="flex items-center justify-center space-x-2">
            <div className={`inline-flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border-2 ${impact.color}`}>
              {impact.icon}
              <span>{impact.level} Impact</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm sm:text-base text-gray-700 max-w-md mx-auto leading-relaxed px-4">
            {impact.description}
          </p>
        </div>

        {/* Comparison Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-200 p-4 sm:p-6">
          <div className="text-center space-y-2 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
              📊
              Compared to National Average
            </h3>
            <div className="flex items-center justify-center space-x-3 sm:space-x-4">
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-gray-600">{nationalAverage}</div>
                <div className="text-xs sm:text-sm text-gray-500">National avg</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{total.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-gray-500">Your footprint</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2">
              {impact.icon}
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {impact.comparison}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                ({percentageVsAverage > 0 ? '+' : ''}{percentageVsAverage.toFixed(0)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Pie Chart Section */}
        {results.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 flex items-center justify-center gap-2">
                📈
                Emissions Breakdown
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm px-4">
                🔍 See which activities contribute most to your carbon footprint
              </p>
            </div>
            <PieChart data={results} size={window.innerWidth < 640 ? 240 : 280} />
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="text-center py-8 sm:py-12 space-y-3 sm:space-y-4 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                🚀
                Start Tracking Your Impact
              </h3>
              <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
                📝 Enter your daily activities above to see your carbon footprint breakdown and get personalized suggestions.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};