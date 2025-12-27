// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, RefreshCw, Grid3X3, List, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DemoWelcomeModal } from '../components/onboarding/DemoWelcomeModal';
import { ProductTour } from '../components/onboarding/ProductTour';
import { UpgradePrompt } from '../components/onboarding/UpgradePrompt';
import { chartsService, PinnedChart } from '../services/charts.service';

interface ChartWithSize extends PinnedChart {
  size: 'small' | 'medium' | 'large';
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();
  const [pinnedCharts, setPinnedCharts] = useState<ChartWithSize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  // Demo stats
  const demoStats = {
    totalPatients: 12847,
    totalEncounters: 47293,
    readmissionRate: 12.3,
    avgCost: 4250,
  };

  // Load pinned charts
  const loadCharts = useCallback(async () => {
    setIsLoading(true);
    try {
      const charts = await chartsService.getCharts();

      // Transform and add default sizes
      const chartsWithSize: ChartWithSize[] = charts.map((chart, index) => ({
        ...chart,
        size: chart.size || (index === 0 ? 'large' : index === 1 ? 'small' : 'medium'),
      }));

      setPinnedCharts(chartsWithSize);
    } catch (error) {
      console.error('Failed to load charts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCharts();
  }, [loadCharts]);

  const handleUnpin = async (chartId: string) => {
    const confirmed = window.confirm('Remove this chart from your dashboard?');
    if (!confirmed) return;

    try {
      await chartsService.deleteChart(chartId);
      setPinnedCharts(prev => prev.filter(c => c.id !== chartId));
    } catch (error) {
      console.error('Failed to delete chart:', error);
      alert('Failed to remove chart');
    }
  };

  const handleResize = async (chartId: string, newSize: 'small' | 'medium' | 'large') => {
    setPinnedCharts(prev =>
      prev.map(chart =>
        chart.id === chartId ? { ...chart, size: newSize } : chart
      )
    );

    // Persist size change
    await chartsService.updateChartSize(chartId, newSize);
  };

  const handleExpand = (chartId: string) => {
    const chart = pinnedCharts.find(c => c.id === chartId);
    if (chart) {
      navigate('/insights', { state: { initialQuestion: chart.query_text } });
    }
  };

  const handleRefresh = async (chartId: string) => {
    // In production, this would re-run the SQL query
    console.log('Refreshing chart:', chartId);
  };

  // Check if user has data
  const hasData = isDemoMode || localStorage.getItem('vizier_has_data') === 'true' || pinnedCharts.length > 0;

  // Get column span based on chart size
  const getColSpan = (size: string) => {
    if (layout === 'list') return 'col-span-12';

    switch (size) {
      case 'small': return 'col-span-12 md:col-span-6 lg:col-span-4';
      case 'medium': return 'col-span-12 md:col-span-6 lg:col-span-6';
      case 'large': return 'col-span-12 lg:col-span-8';
      default: return 'col-span-12 md:col-span-6 lg:col-span-6';
    }
  };

  // Empty state when no charts are pinned
  const EmptyPinnedState = () => (
    <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
        <BarChart3 className="w-10 h-10 text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        Your Dashboard is Empty
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Start by asking Vizier questions about your data. Pin your favorite insights to build your personalized dashboard.
      </p>
      <button
        onClick={() => navigate('/insights')}
        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg"
      >
        <MessageSquare className="w-5 h-5" />
        Ask Vizier
      </button>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-black">
      {/* Header - moderate padding */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {pinnedCharts.length > 0 ? 'My Dashboard' : `Welcome back${user?.first_name ? `, ${user.first_name}` : ''}`}
            </h1>
            <p className="text-gray-400 mt-1">
              {pinnedCharts.length > 0
                ? `${pinnedCharts.length} pinned ${pinnedCharts.length === 1 ? 'insight' : 'insights'}`
                : "Here's an overview of your healthcare analytics"
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Layout toggle - only show when charts exist */}
            {pinnedCharts.length > 0 && (
              <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setLayout('grid')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    layout === 'grid'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    layout === 'list'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Refresh button - only show when charts exist */}
            {pinnedCharts.length > 0 && (
              <button
                onClick={loadCharts}
                disabled={isLoading}
                className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh all"
              >
                <RefreshCw className={`w-5 h-5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Add Chart / Ask Vizier button */}
            <button
              data-tour="ask-vizier"
              onClick={() => navigate('/insights')}
              className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
            >
              {pinnedCharts.length > 0 ? (
                <>
                  <Plus className="w-5 h-5" />
                  Add Chart
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Ask Vizier
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Stats Overview - moderate padding */}
          <div className="px-6 py-6" data-tour="stats">
            <StatsOverview stats={demoStats} />
          </div>

          {/* Pinned Charts Section */}
          <div data-tour="saved-insights">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : pinnedCharts.length > 0 ? (
              <>
                {/* Section Header */}
                <div className="px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Pinned Insights</h2>
                </div>

                {/* Charts Grid - MINIMAL PADDING for maximum width */}
                <div className="px-4 pb-6">
                  <div className="grid grid-cols-12 gap-4">
                    {pinnedCharts.map((chart) => (
                      <div key={chart.id} className={getColSpan(chart.size)}>
                        <DashboardCard
                          chart={chart}
                          onUnpin={handleUnpin}
                          onResize={handleResize}
                          onExpand={handleExpand}
                          onRefresh={handleRefresh}
                          currentUser={{
                            id: user?.id?.toString() || 'demo-user',
                            name: user?.first_name || 'Demo User'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="px-6">
                <EmptyPinnedState />
              </div>
            )}
          </div>

          {/* Quick Actions - moderate padding */}
          <div className="px-6 pb-8">
            <QuickActions />
          </div>
        </>
      ) : (
        <div className="px-6 py-8">
          <EmptyPinnedState />
        </div>
      )}

      {/* Onboarding Components */}
      <DemoWelcomeModal
        onStartTour={() => setShowTour(true)}
        onClose={() => {}}
      />

      <ProductTour
        isActive={showTour}
        onComplete={() => setShowTour(false)}
        onSkip={() => setShowTour(false)}
      />

      <UpgradePrompt />
    </div>
  );
};

export default Dashboard;
