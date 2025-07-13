import React from 'react';
import { Car, Zap, Beef, Recycle } from 'lucide-react';
import { ActivityData } from '../types';

interface InputFormProps {
  data: ActivityData;
  onChange: (data: ActivityData) => void;
  onCalculate: () => void;
  onReset: () => void;
  hasData: boolean;
  showResults: boolean;
  isLoading?: boolean;
}

const InputField: React.FC<{
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  icon: React.ReactNode;
  placeholder: string;
  emoji: string;
}> = ({ id, label, value, onChange, unit, icon, placeholder, emoji }) => (
  <div className="space-y-2 sm:space-y-3">
    <label htmlFor={id} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-gray-800">
      <span className="text-lg sm:text-2xl" role="img" aria-label={label}>{emoji}</span>
      <span className="text-green-600 bg-green-50 p-1 sm:p-1.5 rounded-lg">{icon}</span>
      <span className="flex-1">{label}</span>
    </label>
    <div className="relative group">
      <input
        type="number"
        id={id}
        value={value || ''}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        min="0"
        step="0.1"
        className="w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 sm:pr-16 border-2 border-gray-200 rounded-xl 
                   bg-white text-gray-900 placeholder-gray-400
                   text-sm sm:text-base
                   transition-all duration-300 ease-in-out
                   hover:border-green-300 hover:shadow-md hover:bg-green-50/30
                   focus:border-green-500 focus:ring-4 focus:ring-green-100 focus:outline-none focus:bg-white
                   group-hover:shadow-lg transform hover:scale-[1.02]"
        aria-describedby={`${id}-unit`}
      />
      <span 
        id={`${id}-unit`} 
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 
                   text-xs sm:text-sm font-medium text-gray-500 bg-gray-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md
                   transition-colors duration-300 group-hover:bg-green-100 group-hover:text-green-700"
      >
        {unit}
      </span>
      
      {/* Subtle glow effect on focus */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 
                      opacity-0 transition-opacity duration-300 pointer-events-none
                      group-focus-within:opacity-100 -z-10 blur-sm"></div>
    </div>
  </div>
);

export const InputForm: React.FC<InputFormProps> = ({ 
  data, 
  onChange, 
  onCalculate, 
  onReset, 
  hasData, 
  showResults,
  isLoading = false
}) => {
  const handleInputChange = (field: keyof ActivityData, value: number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 sm:px-8 py-4 sm:py-6">
        <div className="text-center space-y-1 sm:space-y-2">
          <h2 className="text-lg sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
            📊 Daily Activity Tracker
          </h2>
          <p className="text-sm sm:text-base text-green-100">💚 Enter your daily activities to calculate your carbon footprint</p>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <InputField
            id="car-distance"
            label="Distance traveled by car"
            value={data.carDistance}
            onChange={(value) => handleInputChange('carDistance', value)}
            unit="km"
            icon={<Car size={18} />}
            placeholder="Enter kilometers"
            emoji="🚗"
          />
          
          <InputField
            id="electricity-usage"
            label="Electricity usage"
            value={data.electricityUsage}
            onChange={(value) => handleInputChange('electricityUsage', value)}
            unit="kWh"
            icon={<Zap size={18} />}
            placeholder="Enter kilowatt-hours"
            emoji="⚡"
          />
          
          <InputField
            id="meat-consumption"
            label="Meat consumed"
            value={data.meatConsumption}
            onChange={(value) => handleInputChange('meatConsumption', value)}
            unit="grams"
            icon={<Beef size={18} />}
            placeholder="Enter grams"
            emoji="🍖"
          />
          
          <InputField
            id="plastic-items"
            label="Plastic items used"
            value={data.plasticItems}
            onChange={(value) => handleInputChange('plasticItems', value)}
            unit="items"
            icon={<Recycle size={18} />}
            placeholder="Enter count"
            emoji="🧴"
          />
        </div>
        
        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
            💡 <strong>Tip:</strong> Enter your daily activities and click calculate to see your carbon footprint.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onCalculate}
            disabled={!hasData || isLoading}
            className={`flex-1 py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base
                       transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                       flex items-center justify-center gap-2
                       ${hasData && !isLoading
                         ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700' 
                         : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                       }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Calculating...
              </>
            ) : (
              showResults ? '🔄 Recalculate Footprint' : '🌱 Calculate My Footprint'
            )}
          </button>
          
          {showResults && (
            <button
              onClick={onReset}
              disabled={isLoading}
              className="flex-1 sm:flex-none py-3 sm:py-4 px-6 sm:px-8 rounded-xl font-semibold text-sm sm:text-base
                         bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300
                         transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                         hover:bg-gray-50 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Resetting...
                </>
              ) : (
                '🗑️ Reset'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};