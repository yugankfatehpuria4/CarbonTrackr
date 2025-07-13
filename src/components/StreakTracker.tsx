import React from 'react';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';
import { UserStats } from '../types';

interface StreakTrackerProps {
  stats: UserStats;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ stats }) => {
  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return "Start your tracking journey! 🚀";
    if (streak === 1) return "Great start! Keep it up! 💪";
    if (streak < 7) return "Building momentum! 🔥";
    if (streak < 30) return "Amazing consistency! ⭐";
    return "Eco champion status! 🏆";
  };

  const getStreakColor = (streak: number): string => {
    if (streak === 0) return "text-gray-600";
    if (streak < 3) return "text-green-600";
    if (streak < 7) return "text-orange-600";
    if (streak < 30) return "text-yellow-600";
    return "text-purple-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="text-center space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="space-y-1 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
            🔥 Tracking Streak
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            Keep tracking daily to build your streak!
          </p>
        </div>

        {/* Main Streak Display */}
        <div className="space-y-3 sm:space-y-4 animate-scale-in">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3">
            <Flame className={`w-6 h-6 sm:w-8 sm:h-8 ${getStreakColor(stats.currentStreak)}`} />
            <div className="text-center">
              <div className={`text-3xl sm:text-4xl font-bold ${getStreakColor(stats.currentStreak)} transition-all duration-500`}>
                {stats.currentStreak}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">
                {stats.currentStreak === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
          
          <p className={`text-sm sm:text-base font-medium ${getStreakColor(stats.currentStreak)}`}>
            {getStreakMessage(stats.currentStreak)}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-2 sm:p-3 text-center">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg sm:text-xl font-bold text-blue-900 transition-all duration-300">{stats.longestStreak}</div>
            <div className="text-xs text-blue-700">Best Streak</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-2 sm:p-3 text-center">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg sm:text-xl font-bold text-green-900 transition-all duration-300">{stats.totalCalculations}</div>
            <div className="text-xs text-green-700">Total Tracks</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-2 sm:p-3 text-center">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg sm:text-xl font-bold text-purple-900 transition-all duration-300">
              {stats.badges.filter(b => b.unlocked).length}
            </div>
            <div className="text-xs text-purple-700">Badges</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Next milestone</span>
            <span>
              {stats.currentStreak < 3 ? '3 days' : 
               stats.currentStreak < 7 ? '7 days' : 
               stats.currentStreak < 30 ? '30 days' : 'Champion! 🏆'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                stats.currentStreak < 3 ? 'bg-green-500' :
                stats.currentStreak < 7 ? 'bg-orange-500' :
                stats.currentStreak < 30 ? 'bg-yellow-500' : 'bg-purple-500'
              }`}
              style={{ 
                width: `${Math.min(100, (stats.currentStreak / (
                  stats.currentStreak < 3 ? 3 :
                  stats.currentStreak < 7 ? 7 :
                  stats.currentStreak < 30 ? 30 : 30
                )) * 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};