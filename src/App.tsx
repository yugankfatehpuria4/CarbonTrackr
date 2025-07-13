import React, { useState, useMemo } from 'react';
import { Leaf, Loader2 } from 'lucide-react';
import { ActivityData, UserStats, Badge } from './types';
import { InputForm } from './components/InputForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Suggestions } from './components/Suggestions';
import { StreakTracker } from './components/StreakTracker';
import { BadgeDisplay } from './components/BadgeDisplay';
import { DailyTip } from './components/DailyTip';
import { TrendChart } from './components/TrendChart';
import { ProgressNotification } from './components/ProgressNotification';
import { AICoach } from './components/AICoach';
import { Footer } from './components/Footer';
import { calculateEmissions, getTotalEmissions, getSuggestion } from './utils/calculations';
import { getStoredStats, updateStats } from './utils/streakManager';
import { saveDailyRecord, getTrendData, getChartData } from './utils/trendManager';

// Loading skeleton component
const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-6 sm:space-y-8">
    {/* Header skeleton */}
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-8">
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-100 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
    
    {/* Stats skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-16 bg-gray-100 rounded-lg"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 sm:p-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          <div className="h-12 bg-gray-100 rounded-lg"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activityData, setActivityData] = useState<ActivityData>({
    carDistance: 0,
    electricityUsage: 0,
    meatConsumption: 0,
    plasticItems: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(getStoredStats());
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [trendPeriod, setTrendPeriod] = useState<'week' | 'month'>('week');

  // Simulate initial loading for better UX
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const emissionResults = useMemo(() => 
    showResults ? calculateEmissions(activityData) : [], 
    [activityData, showResults]
  );
  const totalEmissions = useMemo(() => getTotalEmissions(emissionResults), [emissionResults]);
  const suggestion = useMemo(() => getSuggestion(emissionResults), [emissionResults]);
  const trendData = useMemo(() => getTrendData(), [showResults]); // Recalculate when results change
  const chartData = useMemo(() => getChartData(trendPeriod), [trendPeriod, showResults]);

  // Smooth scroll to results section
  const scrollToResults = () => {
    const resultsElement = document.getElementById('results-section');
    if (resultsElement) {
      resultsElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };
  const handleCalculate = () => {
    // Add loading state for calculation
    setIsLoading(true);
    
    setTimeout(() => {
      const emissionResults = calculateEmissions(activityData);
      const totalEmissions = getTotalEmissions(emissionResults);
      
      // Save daily record for trend tracking
      saveDailyRecord(activityData, emissionResults);
      
      const { stats, newBadges: earnedBadges } = updateStats(totalEmissions);
      
      setUserStats(stats);
      setNewBadges(earnedBadges);
      setShowResults(true);
      setIsLoading(false);
      
      // Auto-scroll to results after a brief delay for state update
      setTimeout(() => {
        scrollToResults();
      }, 100);
      
      // Clear new badge notification after 5 seconds
      if (earnedBadges.length > 0) {
        setTimeout(() => setNewBadges([]), 5000);
      }
    }, 800); // Realistic loading time
  };

  const handleCalculateOld = () => {
    const emissionResults = calculateEmissions(activityData);
    const totalEmissions = getTotalEmissions(emissionResults);
    const { stats, newBadges: earnedBadges } = updateStats(totalEmissions);
    
    setUserStats(stats);
    setNewBadges(earnedBadges);
    setShowResults(true);
    
    // Auto-scroll to results after a brief delay for state update
    setTimeout(() => {
      scrollToResults();
    }, 100);
    
    // Clear new badge notification after 5 seconds
    if (earnedBadges.length > 0) {
      setTimeout(() => setNewBadges([]), 5000);
    }
  };

  const handleReset = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setActivityData({
        carDistance: 0,
        electricityUsage: 0,
        meatConsumption: 0,
        plasticItems: 0
      });
      setShowResults(false);
      setNewBadges([]);
      setIsLoading(false);
      
      // Smooth scroll back to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const handleResetOld = () => {
    setActivityData({
      carDistance: 0,
      electricityUsage: 0,
      meatConsumption: 0,
      plasticItems: 0
    });
    setShowResults(false);
    setNewBadges([]);
    
    // Smooth scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasAnyData = Object.values(activityData).some(value => value > 0);

  // Show loading skeleton on initial load
  if (isLoading && !showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-spin" />
              </div>
              <div className="text-center">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">CarbonTrackr</h1>
                <p className="text-sm sm:text-base text-green-600 font-medium">Loading your eco dashboard...</p>
              </div>
            </div>
          </div>
        </header>

        {/* Loading Content */}
        <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">CarbonTrackr</h1>
              <p className="text-sm sm:text-base text-green-600 font-medium">Track. Understand. Reduce.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-3 sm:space-y-4 px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Calculate Your Daily Carbon Footprint
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Understanding your carbon footprint is the first step toward a more sustainable lifestyle. 
            Track your daily activities and discover personalized ways to reduce your environmental impact.
          </p>
        </div>

        {/* Input Form */}
        <InputForm 
          data={activityData} 
          onChange={setActivityData}
          onCalculate={handleCalculate}
          onReset={handleReset}
          hasData={hasAnyData}
          showResults={showResults}
          isLoading={isLoading}
        />

        {/* Results */}
        {showResults && (
          <div 
            id="results-section" 
            className="space-y-6 sm:space-y-8 animate-fade-in-up"
          >
            <ResultsDisplay 
              results={emissionResults} 
              total={totalEmissions}
            />
            
            {/* Suggestions */}
            <Suggestions suggestion={suggestion} />
            
            {/* AI Coach */}
            <AICoach 
              emissionResults={emissionResults}
              totalEmissions={totalEmissions}
              showRecommendation={true}
            />
          </div>
        )}

        {/* Streak Tracker */}
        <div className="animate-fade-in-up">
          <StreakTracker stats={userStats} />
        </div>

        {/* Progress Notification */}
        <div className="animate-fade-in-up">
          <ProgressNotification 
            weeklyChange={trendData.weeklyChange}
            monthlyChange={trendData.monthlyChange}
            weeklyAverage={trendData.weeklyAverage}
            monthlyAverage={trendData.monthlyAverage}
          />
        </div>

        {/* Trend Chart */}
        <div className="animate-fade-in-up">
          <TrendChart 
            data={chartData}
            period={trendPeriod}
            onPeriodChange={setTrendPeriod}
          />
        </div>

        {/* Daily Tip */}
        <div className="animate-fade-in-up">
          <DailyTip />
        </div>

        {/* AI Coach (Always Available) */}
        <div className="animate-fade-in-up">
          <AICoach 
            emissionResults={emissionResults}
            totalEmissions={totalEmissions}
            showRecommendation={false}
          />
        </div>

        {/* Badge Display */}
        <div className="animate-fade-in-up">
          <BadgeDisplay badges={userStats.badges} newBadges={newBadges} />
        </div>

        {/* Educational Info */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-6 animate-fade-in-up">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 text-center">
            🌍 Did You Know?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 p-3 sm:p-4 space-y-1 sm:space-y-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-2">
                🚗 Transportation Impact
              </h4>
              <p className="leading-relaxed">Transportation accounts for about 14% of global greenhouse gas emissions. Even small changes like carpooling can make a significant difference.</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-100 p-3 sm:p-4 space-y-1 sm:space-y-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-2">
                💡 Energy Efficiency
              </h4>
              <p className="leading-relaxed">The average household can reduce their electricity consumption by 25% through simple efficiency measures.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-3 sm:p-4 space-y-1 sm:space-y-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-2">
                🌿 Dietary Choices
              </h4>
              <p className="leading-relaxed">Livestock farming produces 18% of greenhouse gas emissions. One meatless day per week can significantly reduce your carbon footprint.</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg border border-gray-100 p-3 sm:p-4 space-y-1 sm:space-y-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base flex items-center gap-2">
                ♻️ Plastic Reduction
              </h4>
              <p className="leading-relaxed">8 million tons of plastic waste enter our oceans annually. Choose reusable alternatives whenever possible.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;