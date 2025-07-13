import React, { useState } from 'react';
import { Award, Lock } from 'lucide-react';
import { Badge } from '../types';

interface BadgeDisplayProps {
  badges: Badge[];
  newBadges?: Badge[];
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badges, newBadges = [] }) => {
  const [showAll, setShowAll] = useState(false);
  
  const unlockedBadges = badges.filter(b => b.unlocked);
  const lockedBadges = badges.filter(b => !b.unlocked);
  const displayBadges = showAll ? badges : unlockedBadges.slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
            🏆 Achievement Badges
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            {unlockedBadges.length} of {badges.length} badges earned
          </p>
        </div>

        {/* New Badge Notification */}
        {newBadges.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 sm:p-4 animate-scale-in">
            <div className="text-center space-y-2">
              <div className="text-lg sm:text-xl">🎉</div>
              <h4 className="font-semibold text-gray-900">New Badge{newBadges.length > 1 ? 's' : ''} Unlocked!</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {newBadges.map(badge => (
                  <span key={badge.id} className="text-lg sm:text-xl animate-bounce animate-pulse-slow">
                    {badge.icon}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badge Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {displayBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-3 sm:p-4 rounded-lg border-2 text-center transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                badge.unlocked
                  ? `${badge.color} shadow-md hover:shadow-lg cursor-pointer`
                  : 'bg-gray-50 text-gray-400 border-gray-200 opacity-60'
              }`}
              title={badge.description}
              style={{ 
                animationDelay: `${displayBadges.indexOf(badge) * 0.1}s` 
              }}
            >
              {/* Badge Icon */}
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                {badge.unlocked ? badge.icon : <Lock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-gray-400" />}
              </div>
              
              {/* Badge Name */}
              <h4 className={`text-xs sm:text-sm font-semibold mb-1 ${
                badge.unlocked ? '' : 'text-gray-500'
              }`}>
                {badge.name}
              </h4>
              
              {/* Badge Description */}
              <p className={`text-xs leading-tight ${
                badge.unlocked ? 'opacity-80' : 'text-gray-400'
              }`}>
                {badge.description}
              </p>

              {/* New Badge Indicator */}
              {newBadges.some(nb => nb.id === badge.id) && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}

              {/* Unlock Date */}
              {badge.unlocked && badge.unlockedDate && (
                <div className="text-xs opacity-60 mt-1">
                  {new Date(badge.unlockedDate).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {badges.length > 6 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 
                         text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 
                         bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{showAll ? 'Show Less' : `Show All (${lockedBadges.length} locked)`}</span>
            </button>
          </div>
        )}

        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200 p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-gray-900">
              {Math.round((unlockedBadges.length / badges.length) * 100)}% Complete
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedBadges.length / badges.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};