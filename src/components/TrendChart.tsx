import React from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';

interface ChartDataPoint {
  date: string;
  displayDate: string;
  totalEmissions: number;
  breakdown: {
    transportation: number;
    electricity: number;
    food: number;
    plastic: number;
  };
}

interface TrendChartProps {
  data: ChartDataPoint[];
  period: 'week' | 'month';
  onPeriodChange: (period: 'week' | 'month') => void;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, period, onPeriodChange }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12 space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">📈 No Trend Data Yet</h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto">
              Start tracking your carbon footprint daily to see your progress over time!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const maxEmission = Math.max(...data.map(d => d.totalEmissions));
  const chartHeight = 200;

  const getBarHeight = (emission: number): number => {
    if (maxEmission === 0) return 0;
    return Math.max(4, (emission / maxEmission) * chartHeight);
  };

  const getEmissionColor = (emission: number): string => {
    if (emission < 3) return 'bg-green-500';
    if (emission < 5) return 'bg-yellow-500';
    if (emission < 7) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getEmissionLevel = (emission: number): string => {
    if (emission < 3) return 'Excellent';
    if (emission < 5) return 'Good';
    if (emission < 7) return 'Average';
    return 'High';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">📈 CO₂ Trend Dashboard</h3>
              <p className="text-xs sm:text-sm text-gray-600">Track your carbon footprint over time</p>
            </div>
          </div>
          
          {/* Period Toggle */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => onPeriodChange('week')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                period === 'week'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => onPeriodChange('month')}
              className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                period === 'month'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Chart */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-end justify-center space-x-1 sm:space-x-2 bg-gray-50 rounded-lg p-3 sm:p-4" style={{ height: chartHeight + 60 }}>
            {data.map((point, index) => (
              <div key={point.date} className="flex flex-col items-center space-y-1 sm:space-y-2 group">
                {/* Bar */}
                <div className="relative flex items-end">
                  <div
                    className={`w-4 sm:w-6 rounded-t-sm transition-all duration-500 hover:opacity-80 cursor-pointer ${getEmissionColor(point.totalEmissions)}`}
                    style={{ 
                      height: `${getBarHeight(point.totalEmissions)}px`,
                      animationDelay: `${index * 50}ms`
                    }}
                    title={`${point.displayDate}: ${point.totalEmissions.toFixed(1)} kg CO₂`}
                  />
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                      <div className="font-semibold">{point.totalEmissions.toFixed(1)} kg CO₂</div>
                      <div className="text-gray-300">{getEmissionLevel(point.totalEmissions)}</div>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                
                {/* Date Label */}
                <div className="text-xs text-gray-500 transform -rotate-45 origin-center whitespace-nowrap">
                  {period === 'week' ? point.displayDate : point.displayDate.split(' ')[1]}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">Excellent (&lt;3kg)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-gray-600">Good (3-5kg)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-gray-600">Average (5-7kg)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-gray-600">High (&gt;7kg)</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-green-900">
              {data.reduce((sum, d) => sum + d.totalEmissions, 0).toFixed(1)}
            </div>
            <div className="text-xs text-green-700">Total kg CO₂</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-blue-900">
              {data.length > 0 ? (data.reduce((sum, d) => sum + d.totalEmissions, 0) / data.filter(d => d.totalEmissions > 0).length || 0).toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-blue-700">Daily Average</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-purple-900">
              {Math.min(...data.filter(d => d.totalEmissions > 0).map(d => d.totalEmissions)).toFixed(1) || '0.0'}
            </div>
            <div className="text-xs text-purple-700">Best Day</div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              {data.filter(d => d.totalEmissions > 0).length}
            </div>
            <div className="text-xs text-gray-700">Days Tracked</div>
          </div>
        </div>
      </div>
    </div>
  );
};