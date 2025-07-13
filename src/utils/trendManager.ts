import { DailyRecord, TrendData, ActivityData, EmissionResult } from '../types';
import { calculateEmissions, getTotalEmissions } from './calculations';

const STORAGE_KEY = 'carbontrackr_trends';

export const getStoredTrends = (): DailyRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading trends:', error);
  }
  return [];
};

export const saveDailyRecord = (activities: ActivityData, emissions: EmissionResult[]): DailyRecord => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const totalEmissions = getTotalEmissions(emissions);
  
  const breakdown = {
    transportation: emissions.find(e => e.category === 'Transportation')?.amount || 0,
    electricity: emissions.find(e => e.category === 'Electricity')?.amount || 0,
    food: emissions.find(e => e.category === 'Food')?.amount || 0,
    plastic: emissions.find(e => e.category === 'Plastic')?.amount || 0,
  };

  const newRecord: DailyRecord = {
    date: today,
    totalEmissions,
    breakdown,
    activities
  };

  try {
    const existingRecords = getStoredTrends();
    const updatedRecords = existingRecords.filter(record => record.date !== today);
    updatedRecords.push(newRecord);
    
    // Keep only last 90 days for performance
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const filteredRecords = updatedRecords.filter(record => 
      new Date(record.date) >= ninetyDaysAgo
    );
    
    // Sort by date (newest first)
    filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return newRecord;
  } catch (error) {
    console.error('Error saving trend data:', error);
    return newRecord;
  }
};

export const getTrendData = (): TrendData => {
  const records = getStoredTrends();
  
  if (records.length === 0) {
    return {
      records: [],
      weeklyAverage: 0,
      monthlyAverage: 0,
      weeklyChange: 0,
      monthlyChange: 0
    };
  }

  // Calculate averages
  const last7Days = records.slice(0, 7);
  const last30Days = records.slice(0, 30);
  const previous7Days = records.slice(7, 14);
  const previous30Days = records.slice(30, 60);

  const weeklyAverage = last7Days.length > 0 
    ? last7Days.reduce((sum, record) => sum + record.totalEmissions, 0) / last7Days.length 
    : 0;

  const monthlyAverage = last30Days.length > 0 
    ? last30Days.reduce((sum, record) => sum + record.totalEmissions, 0) / last30Days.length 
    : 0;

  const previousWeeklyAverage = previous7Days.length > 0 
    ? previous7Days.reduce((sum, record) => sum + record.totalEmissions, 0) / previous7Days.length 
    : weeklyAverage;

  const previousMonthlyAverage = previous30Days.length > 0 
    ? previous30Days.reduce((sum, record) => sum + record.totalEmissions, 0) / previous30Days.length 
    : monthlyAverage;

  const weeklyChange = previousWeeklyAverage > 0 
    ? ((weeklyAverage - previousWeeklyAverage) / previousWeeklyAverage) * 100 
    : 0;

  const monthlyChange = previousMonthlyAverage > 0 
    ? ((monthlyAverage - previousMonthlyAverage) / previousMonthlyAverage) * 100 
    : 0;

  return {
    records,
    weeklyAverage,
    monthlyAverage,
    weeklyChange,
    monthlyChange
  };
};

export const getChartData = (period: 'week' | 'month' = 'week') => {
  const records = getStoredTrends();
  const days = period === 'week' ? 7 : 30;
  const relevantRecords = records.slice(0, days).reverse(); // Reverse for chronological order

  // Fill in missing days with 0 emissions
  const filledData = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const existingRecord = relevantRecords.find(record => record.date === dateString);
    
    filledData.push({
      date: dateString,
      displayDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      totalEmissions: existingRecord?.totalEmissions || 0,
      breakdown: existingRecord?.breakdown || {
        transportation: 0,
        electricity: 0,
        food: 0,
        plastic: 0
      }
    });
  }

  return filledData;
};

// Generate sample data for demo purposes (optional)
export const generateSampleData = (): void => {
  const sampleData: DailyRecord[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Generate realistic sample data with some variation
    const baseEmission = 4 + Math.random() * 4; // 4-8 kg base
    const variation = (Math.random() - 0.5) * 2; // ±1 kg variation
    const totalEmissions = Math.max(1, baseEmission + variation);
    
    const breakdown = {
      transportation: totalEmissions * (0.3 + Math.random() * 0.2), // 30-50%
      electricity: totalEmissions * (0.2 + Math.random() * 0.15), // 20-35%
      food: totalEmissions * (0.15 + Math.random() * 0.15), // 15-30%
      plastic: totalEmissions * (0.05 + Math.random() * 0.1), // 5-15%
    };

    sampleData.push({
      date: dateString,
      totalEmissions: parseFloat(totalEmissions.toFixed(2)),
      breakdown: {
        transportation: parseFloat(breakdown.transportation.toFixed(2)),
        electricity: parseFloat(breakdown.electricity.toFixed(2)),
        food: parseFloat(breakdown.food.toFixed(2)),
        plastic: parseFloat(breakdown.plastic.toFixed(2)),
      },
      activities: {
        carDistance: Math.random() * 50,
        electricityUsage: Math.random() * 20,
        meatConsumption: Math.random() * 200,
        plasticItems: Math.floor(Math.random() * 10)
      }
    });
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};