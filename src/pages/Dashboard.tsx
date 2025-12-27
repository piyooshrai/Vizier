// src/pages/Dashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, RefreshCw, Grid3X3, List, BarChart3, Layers, LayoutGrid, TableProperties } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DrillDownModal } from '../components/dashboard/DrillDownModal';
import { DemoWelcomeModal } from '../components/onboarding/DemoWelcomeModal';
import { ProductTour } from '../components/onboarding/ProductTour';
import { UpgradePrompt } from '../components/onboarding/UpgradePrompt';
import { chartsService, PinnedChart } from '../services/charts.service';

interface ChartWithSize extends PinnedChart {
  size: 'small' | 'medium' | 'large';
}

type DensityMode = 'comfortable' | 'compact' | 'dense';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();
  const [pinnedCharts, setPinnedCharts] = useState<ChartWithSize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [density, setDensity] = useState<DensityMode>('compact');
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  // Load density preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dashboard_density');
    if (saved && ['comfortable', 'compact', 'dense'].includes(saved)) {
      setDensity(saved as DensityMode);
    }
  }, []);

  // Save density preference
  const handleDensityChange = (newDensity: DensityMode) => {
    setDensity(newDensity);
    localStorage.setItem('dashboard_density', newDensity);
  };

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

  // Handle drill-down click
  const handleDrillDown = (chart: PinnedChart) => {
    const data = generateDrillDownData(chart);
    setDrillDownData(data);
    setIsDrillDownOpen(true);
  };

  const handleCloseDrillDown = () => {
    setIsDrillDownOpen(false);
    setDrillDownData(null);
  };

  // Check if user has data
  const hasData = isDemoMode || localStorage.getItem('vizier_has_data') === 'true' || pinnedCharts.length > 0;

  // Get column span based on chart size
  // Progressive columns: more columns at wider screens instead of stretching cards
  const getColSpan = (size: string) => {
    if (layout === 'list') return 'col-span-12';

    switch (size) {
      // Small: 1 col → 2 cols → 3 cols → 4 cols → 6 cols
      case 'small': return 'col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 2xl:col-span-2';
      // Medium: 1 col → 2 cols → 2 cols → 3 cols → 4 cols
      case 'medium': return 'col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3';
      // Large: 1 col → 1 col → 2/3 → 1/2 → 1/3
      case 'large': return 'col-span-12 lg:col-span-8 xl:col-span-6 2xl:col-span-4';
      default: return 'col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4 2xl:col-span-3';
    }
  };

  // Density-based grid gap
  const getGridGap = () => {
    const gaps = { comfortable: 'gap-4', compact: 'gap-3', dense: 'gap-2' };
    return gaps[density];
  };

  // Density-based padding
  const getGridPadding = () => {
    const padding = { comfortable: 'px-4', compact: 'px-3', dense: 'px-2' };
    return padding[density];
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
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {pinnedCharts.length > 0 ? 'My Dashboard' : `Welcome back${user?.first_name ? `, ${user.first_name}` : ''}`}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {pinnedCharts.length > 0
                ? `${pinnedCharts.length} pinned ${pinnedCharts.length === 1 ? 'insight' : 'insights'}`
                : "Here's an overview of your healthcare analytics"
              }
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Density toggle - only show when charts exist */}
            {pinnedCharts.length > 0 && (
              <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => handleDensityChange('comfortable')}
                  className={`px-2.5 py-1.5 rounded text-xs transition-colors ${
                    density === 'comfortable'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Comfortable - Best for presentations"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDensityChange('compact')}
                  className={`px-2.5 py-1.5 rounded text-xs transition-colors ${
                    density === 'compact'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Compact - Balanced view (default)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDensityChange('dense')}
                  className={`px-2.5 py-1.5 rounded text-xs transition-colors ${
                    density === 'dense'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Dense - Maximum information"
                >
                  <TableProperties className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Layout toggle - only show when charts exist */}
            {pinnedCharts.length > 0 && (
              <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => setLayout('grid')}
                  className={`px-2.5 py-1.5 rounded text-xs transition-colors ${
                    layout === 'grid'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`px-2.5 py-1.5 rounded text-xs transition-colors ${
                    layout === 'list'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Refresh button - only show when charts exist */}
            {pinnedCharts.length > 0 && (
              <button
                onClick={loadCharts}
                disabled={isLoading}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh all"
              >
                <RefreshCw className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}

            {/* Add Chart / Ask Vizier button */}
            <button
              data-tour="ask-vizier"
              onClick={() => navigate('/insights')}
              className="px-4 py-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold rounded-lg transition-all shadow-lg inline-flex items-center gap-1.5"
            >
              {pinnedCharts.length > 0 ? (
                <>
                  <Plus className="w-4 h-4" />
                  Add Chart
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Ask Vizier
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Stats Overview - minimal padding for space efficiency */}
          <div className="px-3 py-3" data-tour="stats">
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
                <div className="px-4 py-3">
                  <h2 className="text-lg font-bold text-white">Pinned Insights</h2>
                </div>

                {/* Charts Grid - DENSITY-AWARE PADDING AND GAP */}
                <div className={`${getGridPadding()} pb-4`}>
                  <div className={`grid grid-cols-12 ${getGridGap()}`}>
                    {pinnedCharts.map((chart) => (
                      <div key={chart.id} className={getColSpan(chart.size)}>
                        <DashboardCard
                          chart={chart}
                          onUnpin={handleUnpin}
                          onResize={handleResize}
                          onExpand={handleExpand}
                          onRefresh={handleRefresh}
                          onDrillDown={handleDrillDown}
                          currentUser={{
                            id: user?.id?.toString() || 'demo-user',
                            name: user?.first_name || 'Demo User'
                          }}
                          density={density}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="px-4">
                <EmptyPinnedState />
              </div>
            )}
          </div>

          {/* Quick Actions - compact padding */}
          <div className="px-4 pb-6">
            <QuickActions />
          </div>
        </>
      ) : (
        <div className="px-4 py-6">
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

      {/* Drill-Down Modal */}
      {drillDownData && (
        <DrillDownModal
          isOpen={isDrillDownOpen}
          onClose={handleCloseDrillDown}
          data={drillDownData}
          isDemoMode={isDemoMode}
        />
      )}
    </div>
  );
};

// Generate drill-down data based on chart type
function generateDrillDownData(chart: PinnedChart) {
  const question = (chart.query_text || chart.title || '').toLowerCase();

  // Synthetic patient data
  const FIRST_NAMES = ['John', 'Mary', 'Robert', 'Patricia', 'Michael', 'Jennifer', 'William', 'Linda', 'David', 'Elizabeth', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica', 'Charles', 'Sarah', 'Christopher', 'Karen'];
  const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const generatePatients = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `patient-${i + 1}`,
      name: `${FIRST_NAMES[i % 20]} ${LAST_NAMES[i % 20]}`,
      mrn: `MRN-${String(12847 + i).padStart(5, '0')}`,
      age: 45 + Math.floor(Math.random() * 40),
      lastVisit: `12/${20 - (i % 20)}/2024`,
      primaryMetric: `${155 + Math.floor(Math.random() * 30)}/${85 + Math.floor(Math.random() * 20)}`,
      riskScore: (i < 5 ? 'High' : i < 12 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
    }));
  };

  // Diagnosis drill-down
  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return {
      title: 'Essential Hypertension',
      subtitle: 'Detailed analysis of patients with primary diagnosis',
      totalCount: 3247,
      demographics: {
        avgAge: 58,
        femalePercent: 62,
        malePercent: 38,
        ageDistribution: [
          { range: '0-17', count: 45 },
          { range: '18-34', count: 234 },
          { range: '35-49', count: 567 },
          { range: '50-64', count: 1243 },
          { range: '65+', count: 1158 },
        ],
        genderSplit: [
          { name: 'Female', value: 62 },
          { name: 'Male', value: 38 },
        ],
      },
      metrics: {
        readmissionRate: '8.2%',
        avgCost: '$4,850',
        avgEncounters: '3.2/year',
      },
      comorbidities: [
        { name: 'Diabetes Mellitus Type 2', count: 1461, percent: 45 },
        { name: 'Hyperlipidemia', count: 1234, percent: 38 },
        { name: 'Chronic Kidney Disease', count: 389, percent: 12 },
        { name: 'Coronary Artery Disease', count: 325, percent: 10 },
      ],
      highRiskPatients: generatePatients(20),
    };
  }

  // Age distribution drill-down
  if (question.includes('age') || question.includes('demographic')) {
    return {
      title: 'Age Group: 65+ Years',
      subtitle: 'Geriatric patient population analysis',
      totalCount: 3589,
      demographics: {
        avgAge: 73,
        femalePercent: 58,
        malePercent: 42,
        ageDistribution: [
          { range: '65-69', count: 1234 },
          { range: '70-74', count: 987 },
          { range: '75-79', count: 765 },
          { range: '80-84', count: 432 },
          { range: '85+', count: 171 },
        ],
        genderSplit: [
          { name: 'Female', value: 58 },
          { name: 'Male', value: 42 },
        ],
      },
      metrics: {
        readmissionRate: '14.5%',
        avgCost: '$6,250',
        avgEncounters: '5.8/year',
      },
      comorbidities: [
        { name: 'Hypertension', count: 2872, percent: 80 },
        { name: 'Diabetes', count: 1436, percent: 40 },
        { name: 'COPD', count: 718, percent: 20 },
        { name: 'Dementia', count: 359, percent: 10 },
      ],
      highRiskPatients: generatePatients(20),
    };
  }

  // Readmission drill-down
  if (question.includes('readmission')) {
    return {
      title: 'Readmission Analysis',
      subtitle: '30-day readmission rate breakdown',
      totalCount: 1582,
      demographics: {
        avgAge: 67,
        femalePercent: 48,
        malePercent: 52,
        ageDistribution: [
          { range: '18-34', count: 89 },
          { range: '35-49', count: 213 },
          { range: '50-64', count: 456 },
          { range: '65-74', count: 512 },
          { range: '75+', count: 312 },
        ],
        genderSplit: [
          { name: 'Female', value: 48 },
          { name: 'Male', value: 52 },
        ],
      },
      metrics: {
        readmissionRate: '12.3%',
        avgCost: '$8,450',
        avgEncounters: '6.2/year',
      },
      comorbidities: [
        { name: 'Heart Failure', count: 632, percent: 40 },
        { name: 'COPD', count: 474, percent: 30 },
        { name: 'Pneumonia', count: 316, percent: 20 },
        { name: 'Sepsis', count: 158, percent: 10 },
      ],
      highRiskPatients: generatePatients(20),
    };
  }

  // Default drill-down
  return {
    title: chart.query_text || chart.title || 'Data Analysis',
    subtitle: 'Detailed cohort analysis',
    totalCount: 12847,
    demographics: {
      avgAge: 52,
      femalePercent: 54,
      malePercent: 46,
      ageDistribution: [
        { range: '0-17', count: 1285 },
        { range: '18-34', count: 2569 },
        { range: '35-49', count: 3211 },
        { range: '50-64', count: 3204 },
        { range: '65+', count: 2578 },
      ],
      genderSplit: [
        { name: 'Female', value: 54 },
        { name: 'Male', value: 46 },
      ],
    },
    metrics: {
      readmissionRate: '12.3%',
      avgCost: '$4,250',
      avgEncounters: '3.7/year',
    },
    comorbidities: [
      { name: 'Hypertension', count: 3212, percent: 25 },
      { name: 'Diabetes', count: 2569, percent: 20 },
      { name: 'Asthma', count: 1927, percent: 15 },
      { name: 'Obesity', count: 1542, percent: 12 },
    ],
    highRiskPatients: generatePatients(20),
  };
}

export default Dashboard;
