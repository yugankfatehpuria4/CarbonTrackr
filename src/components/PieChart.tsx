import React from 'react';
import { EmissionResult } from '../types';

interface PieChartProps {
  data: EmissionResult[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 200 }) => {
  if (data.length === 0) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-full border-4 border-dashed border-gray-200"
        style={{ width: size, height: size }}
      >
        <span className="text-gray-400 text-sm font-medium">No data yet</span>
      </div>
    );
  }

  const radius = (size - 20) / 2;
  const center = size / 2;
  let cumulativePercentage = 0;

  const createPath = (percentage: number, startAngle: number): string => {
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Background circle for better visual separation */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="white"
            stroke="#f3f4f6"
            strokeWidth="2"
          />
          
          {data.map((item, index) => {
            const startAngle = cumulativePercentage * 3.6;
            const path = createPath(item.percentage, startAngle);
            cumulativePercentage += item.percentage;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="3"
                className="hover:opacity-90 transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ transformOrigin: `${center}px ${center}px` }}
              />
            );
          })}
        </svg>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white rounded-full w-20 h-20 flex items-center justify-center shadow-md border-2 border-gray-100">
            <div>
              <div className="text-lg font-bold text-gray-900">
                {data.reduce((sum, item) => sum + item.amount, 0).toFixed(1)}
              </div>
              <div className="text-xs text-gray-500">kg CO₂</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg px-4 sm:px-0">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div 
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                {item.category}
              </p>
              <div className="flex items-center space-x-1 sm:space-x-2 text-xs text-gray-600">
                <span>{item.percentage.toFixed(1)}%</span>
                <span>•</span>
                <span>{item.amount.toFixed(2)} kg</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};