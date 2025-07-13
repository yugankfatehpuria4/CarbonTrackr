import React from 'react';
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react';

interface ProgressNotificationProps {
  weeklyChange: number;
  monthlyChange: number;
  weeklyAverage: number;
  monthlyAverage: number;
}

export const ProgressNotification: React.FC<ProgressNotificationProps> = ({
  weeklyChange,
  monthlyChange,
  weeklyAverage,
  monthlyAverage
}) => {
  const getChangeIcon = (change: number) => {
    if (change < -5) return <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />;
    if (change > 5) return <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />;
    return <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />;
  };

  const getChangeColor = (change: number): string => {
    if (change < -5) return 'from-green-50 to-emerald-50 border-green-200';
    if (change > 5) return 'from-red-50 to-pink-50 border-red-200';
    return 'from-blue-50 to-indigo-50 border-blue-200';
  };

  const getChangeMessage = (change: number, period: string): string => {
    if (Math.abs(change) < 1) return `Your ${period} footprint is stable 📊`;
    if (change < -10) return `Amazing! You've reduced by ${Math.abs(change).toFixed(0)}% ${period} 🌟`;
    if (change < -5) return `Great progress! Down ${Math.abs(change).toFixed(0)}% ${period} 🌱`;
    if (change < 0) return `Small improvement of ${Math.abs(change).toFixed(0)}% ${period} 👍`;
    if (change < 5) return `Slight increase of ${change.toFixed(0)}% ${period} ⚠️`;
    return `Footprint increased ${change.toFixed(0)}% ${period} - let's improve! 💪`;
  };

  const getMotivationalTip = (change: number): string => {
    if (change < -10) return "You're an eco champion! Keep up the fantastic work! 🏆";
    if (change < -5) return "Excellent progress! Your efforts are making a real difference! 🌟";
    if (change < 0) return "You're on the right track! Small changes add up! 🌱";
    if (change < 5) return "Stay focused on your goals. Every day is a new opportunity! 🎯";
    return "Don't worry! Tomorrow is a fresh start to reduce your impact! 💚";
  };

  // Show weekly change if we have data, otherwise show encouraging message
  if (weeklyAverage === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg border border-blue-200 p-4 sm:p-6">
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 space-y-1 sm:space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span>🚀 Start Your Journey</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Begin tracking your carbon footprint daily to see your progress and get personalized insights!
            </p>
            <div className="text-xs sm:text-sm text-blue-600 font-medium">
              💡 Tip: Consistency is key to making a real environmental impact
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${getChangeColor(weeklyChange)} rounded-lg shadow-lg border p-4 sm:p-6 animate-scale-in`}>
      <div className="space-y-4 sm:space-y-6">
        {/* Weekly Progress */}
        <div className="flex items-start space-x-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              {getChangeIcon(weeklyChange)}
            </div>
          </div>
          <div className="flex-1 space-y-1 sm:space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <span>📊 Weekly Progress</span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {getChangeMessage(weeklyChange, 'this week')}
            </p>
            <div className="text-xs sm:text-sm font-medium text-gray-600">
              Average: {weeklyAverage.toFixed(1)} kg CO₂/day
            </div>
          </div>
        </div>

        {/* Monthly Progress (if we have enough data) */}
        {monthlyAverage > 0 && (
          <div className="border-t border-white/50 pt-3 sm:pt-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Monthly trend:</span>
              <span className={`font-semibold flex items-center gap-1 ${
                monthlyChange < 0 ? 'text-green-700' : monthlyChange > 0 ? 'text-red-700' : 'text-blue-700'
              }`}>
                {monthlyChange < 0 ? '📉' : monthlyChange > 0 ? '📈' : '➡️'}
                {monthlyChange > 0 ? '+' : ''}{monthlyChange.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Motivational Message */}
        <div className="bg-white/50 rounded-lg p-3 sm:p-4 border border-white/30">
          <p className="text-xs sm:text-sm text-gray-700 text-center font-medium">
            {getMotivationalTip(weeklyChange)}
          </p>
        </div>
      </div>
    </div>
  );
};