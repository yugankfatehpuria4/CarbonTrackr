import { UserStats, Badge } from '../types';

const STORAGE_KEY = 'carbontrackr_stats';

const AVAILABLE_BADGES: Omit<Badge, 'unlocked' | 'unlockedDate'>[] = [
  {
    id: 'first_calculation',
    name: 'First Steps',
    description: 'Completed your first carbon footprint calculation',
    icon: '🌱',
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  {
    id: 'streak_3',
    name: 'Getting Started',
    description: 'Maintained a 3-day tracking streak',
    icon: '🔥',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintained a 7-day tracking streak',
    icon: '⭐',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    id: 'streak_30',
    name: 'Eco Champion',
    description: 'Maintained a 30-day tracking streak',
    icon: '🏆',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'low_footprint',
    name: 'Green Guardian',
    description: 'Achieved a daily footprint under 3kg CO₂',
    icon: '🌿',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'calculations_10',
    name: 'Dedicated Tracker',
    description: 'Completed 10 carbon footprint calculations',
    icon: '📊',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'calculations_50',
    name: 'Data Master',
    description: 'Completed 50 carbon footprint calculations',
    icon: '🎯',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
];

export const getStoredStats = (): UserStats => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
  
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalCalculations: 0,
    lastCalculationDate: null,
    badges: AVAILABLE_BADGES.map(badge => ({ ...badge, unlocked: false }))
  };
};

export const updateStats = (totalEmissions: number): { stats: UserStats; newBadges: Badge[] } => {
  const stats = getStoredStats();
  const today = new Date().toDateString();
  const newBadges: Badge[] = [];
  
  // Update calculation count
  stats.totalCalculations += 1;
  
  // Update streak
  if (stats.lastCalculationDate) {
    const lastDate = new Date(stats.lastCalculationDate);
    const todayDate = new Date(today);
    const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 1) {
      // Consecutive day
      stats.currentStreak += 1;
    } else if (daysDiff > 1) {
      // Streak broken
      stats.currentStreak = 1;
    }
    // Same day = no change to streak
  } else {
    // First calculation ever
    stats.currentStreak = 1;
  }
  
  stats.lastCalculationDate = today;
  stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
  
  // Check for new badges
  stats.badges = stats.badges.map(badge => {
    if (badge.unlocked) return badge;
    
    let shouldUnlock = false;
    
    switch (badge.id) {
      case 'first_calculation':
        shouldUnlock = stats.totalCalculations >= 1;
        break;
      case 'streak_3':
        shouldUnlock = stats.currentStreak >= 3;
        break;
      case 'streak_7':
        shouldUnlock = stats.currentStreak >= 7;
        break;
      case 'streak_30':
        shouldUnlock = stats.currentStreak >= 30;
        break;
      case 'low_footprint':
        shouldUnlock = totalEmissions < 3;
        break;
      case 'calculations_10':
        shouldUnlock = stats.totalCalculations >= 10;
        break;
      case 'calculations_50':
        shouldUnlock = stats.totalCalculations >= 50;
        break;
    }
    
    if (shouldUnlock) {
      const unlockedBadge = { ...badge, unlocked: true, unlockedDate: today };
      newBadges.push(unlockedBadge);
      return unlockedBadge;
    }
    
    return badge;
  });
  
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
  
  return { stats, newBadges };
};