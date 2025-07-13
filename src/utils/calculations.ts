import { ActivityData, EmissionResult, SuggestionData } from '../types';

export const EMISSION_COEFFICIENTS = {
  car: 0.21,        // kg CO₂ per km
  electricity: 0.43, // kg CO₂ per kWh
  meat: 0.027,      // kg CO₂ per gram
  plastic: 0.1      // kg CO₂ per item
};

export const calculateEmissions = (data: ActivityData): EmissionResult[] => {
  const carEmissions = data.carDistance * EMISSION_COEFFICIENTS.car;
  const electricityEmissions = data.electricityUsage * EMISSION_COEFFICIENTS.electricity;
  const meatEmissions = data.meatConsumption * EMISSION_COEFFICIENTS.meat;
  const plasticEmissions = data.plasticItems * EMISSION_COEFFICIENTS.plastic;

  const total = carEmissions + electricityEmissions + meatEmissions + plasticEmissions;

  const results: EmissionResult[] = [
    {
      category: 'Transportation',
      amount: carEmissions,
      percentage: total > 0 ? (carEmissions / total) * 100 : 0,
      color: '#10B981',
      icon: 'Car'
    },
    {
      category: 'Electricity',
      amount: electricityEmissions,
      percentage: total > 0 ? (electricityEmissions / total) * 100 : 0,
      color: '#F59E0B',
      icon: 'Zap'
    },
    {
      category: 'Food',
      amount: meatEmissions,
      percentage: total > 0 ? (meatEmissions / total) * 100 : 0,
      color: '#3B82F6',
      icon: 'Beef'
    },
    {
      category: 'Plastic',
      amount: plasticEmissions,
      percentage: total > 0 ? (plasticEmissions / total) * 100 : 0,
      color: '#6B7280',
      icon: 'Recycle'
    }
  ];

  return results.filter(result => result.amount > 0);
};

export const getTotalEmissions = (results: EmissionResult[]): number => {
  return results.reduce((total, result) => total + result.amount, 0);
};

export const getSuggestion = (results: EmissionResult[]): SuggestionData => {
  if (results.length === 0) {
    return {
      category: 'General',
      message: 'Start tracking your daily activities to see your carbon impact!',
      icon: 'Leaf'
    };
  }

  const highestEmission = results.reduce((max, current) => 
    current.amount > max.amount ? current : max
  );

  const suggestions: Record<string, SuggestionData> = {
    'Transportation': {
      category: 'Transportation',
      message: 'Try carpooling, using public transport, or walking to reduce your carbon impact.',
      icon: 'Car'
    },
    'Electricity': {
      category: 'Electricity',
      message: 'Switch to LED bulbs and unplug devices when not in use to save energy.',
      icon: 'Zap'
    },
    'Food': {
      category: 'Food',
      message: 'Consider having a meatless day or choosing locally sourced food options.',
      icon: 'Beef'
    },
    'Plastic': {
      category: 'Plastic',
      message: 'Use reusable bags and containers to reduce single-use plastic consumption.',
      icon: 'Recycle'
    }
  };

  return suggestions[highestEmission.category] || suggestions['General'];
};