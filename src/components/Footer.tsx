import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 sm:py-6 mt-8 sm:mt-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-xs sm:text-sm text-gray-600">
            © 2025 CarbonTrackr. Helping you track and reduce your carbon footprint.
          </div>
        </div>
      </div>
    </footer>
  );
};