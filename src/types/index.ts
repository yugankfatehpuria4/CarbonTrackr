export interface ActivityData {
  carDistance: number;
  electricityUsage: number;
  meatConsumption: number;
  plasticItems: number;
}

export interface EmissionResult {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface EmissionCoefficients {
  car: number;
  electricity: number;
  meat: number;
  plastic: number;
}

export interface SuggestionData {
  category: string;
  message: string;
  icon: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalCalculations: number;
  lastCalculationDate: string | null;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export interface DailyTip {
  id: string;
  content: string;
  category: 'transportation' | 'energy' | 'food' | 'waste' | 'general';
  date: string;
  isAI?: boolean;
}

export interface AIRecommendation {
  id: string;
  content: string;
  category: string;
  timestamp: string;
  isPersonalized: boolean;
  footprintData?: {
    total: number;
    highestCategory: string;
    breakdown: Record<string, number>;
  };
}

export interface DailyRecord {
  date: string;
  totalEmissions: number;
  breakdown: {
    transportation: number;
    electricity: number;
    food: number;
    plastic: number;
  };
  activities: ActivityData;
}

export interface TrendData {
  records: DailyRecord[];
  weeklyAverage: number;
  monthlyAverage: number;
  weeklyChange: number;
  monthlyChange: number;
}