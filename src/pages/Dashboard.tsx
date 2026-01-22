import {
  BarChart3,
  Grid3X3,
  Layers,
  LayoutGrid,
  List,
  MessageSquare,
  Plus,
  RefreshCw,
  TableProperties,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import { DrillDownModal } from '../components/dashboard/DrillDownModal';
import { QuickActions } from '../components/dashboard/QuickActions';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { DemoWelcomeModal } from '../components/onboarding/DemoWelcomeModal';
import { ProductTour } from '../components/onboarding/ProductTour';
import { UpgradePrompt } from '../components/onboarding/UpgradePrompt';
import { useAuth } from '../contexts/AuthContext';
import { chartsService, type PinnedChart } from '../services/charts.service';

// --- Types ---

type ChartSize = 'small' | 'medium' | 'large';
type DensityMode = 'comfortable' | 'compact' | 'dense';

interface ChartWithSize extends PinnedChart {
  size: ChartSize;
}

// --- Components ---

// Empty state when no charts are pinned
const EmptyPinnedState = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
        <BarChart3 className="w-10 h-10 text-gray-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">
        Your Dashboard is Empty
      </h3>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        Start by asking Vizier questions about your data. Pin your favorite
        insights to build your personalized dashboard.
      </p>
      <button
        type="button"
        onClick={() => navigate('/insights')}
        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors inline-flex items-center gap-2 shadow-lg"
      >
        <MessageSquare className="w-5 h-5" />
        Ask Vizier
      </button>
    </div>
  );
};

// Sub-component for Pinned Charts Section
const PinnedChartsSection = ({
  isLoading,
  pinnedCharts,
  density,
  onUnpin,
  onResize,
  onExpand,
  onRefresh,
  onDrillDown,
  user,
  getColSpan,
  getGridPadding,
  getGridGap,
}: {
  isLoading: boolean;
  pinnedCharts: ChartWithSize[];
  density: DensityMode;
  onUnpin: (id: string) => void;
  onResize: (id: string, size: ChartSize) => void;
  onExpand: (id: string) => void;
  onRefresh: (id: string) => void;
  onDrillDown: (chart: PinnedChart) => void;
  user: { id?: string | number; first_name?: string } | null;
  getColSpan: (size: string) => string;
  getGridPadding: () => string;
  getGridGap: () => string;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    );
  }

  if (pinnedCharts.length === 0) {
    return (
      <div className="px-4">
        <EmptyPinnedState />
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-white">Pinned Insights</h2>
      </div>
      <div className={`${getGridPadding()} pb-4`}>
        <div className="max-w-[2000px] mx-auto">
          <div className={`grid grid-cols-12 ${getGridGap()}`}>
            {pinnedCharts.map((chart) => (
              <div key={chart.id} className={getColSpan(chart.size)}>
                <DashboardCard
                  chart={chart}
                  onUnpin={onUnpin}
                  onResize={onResize}
                  onExpand={onExpand}
                  onRefresh={onRefresh}
                  onDrillDown={onDrillDown}
                  currentUser={{
                    id: user?.id?.toString() || 'demo-user',
                    name: user?.first_name || 'Demo User',
                  }}
                  density={density}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// --- Main Component ---

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();
  const [pinnedCharts, setPinnedCharts] = useState<ChartWithSize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTour, setShowTour] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [density, setDensity] = useState<DensityMode>('compact');
  const [drillDownData, setDrillDownData] = useState<ReturnType<
    typeof generateDrillDownData
  > | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalEncounters: 0,
    readmissionRate: 0,
    avgCost: 0,
  });

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

  const demoStats = {
    totalPatients: 12847,
    totalEncounters: 47293,
    readmissionRate: 12.3,
    avgCost: 4250,
  };

  useEffect(() => {
    if (isDemoMode) {
      setStats(demoStats);
      return;
    }

    const stored = localStorage.getItem('vizier_insights_summary');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as {
        total_patients?: number;
        total_encounters?: number;
      };
      setStats((prev) => ({
        ...prev,
        totalPatients: parsed.total_patients ?? prev.totalPatients,
        totalEncounters: parsed.total_encounters ?? prev.totalEncounters,
      }));
    } catch (error) {
      console.error('Failed to parse insights summary:', error);
    }
  }, [isDemoMode]);

  const loadCharts = useCallback(async () => {
    setIsLoading(true);
    try {
      const charts = await chartsService.getCharts();
      const chartsWithSize: ChartWithSize[] = charts.map((chart, index) => {
        let defaultSize: ChartSize = 'medium';
        if (index === 0) defaultSize = 'large';
        else if (index === 1) defaultSize = 'small';

        return {
          ...chart,
          size: (chart.size as ChartSize) || defaultSize,
        };
      });
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
    const confirmed = globalThis.confirm(
      'Remove this chart from your dashboard?',
    );
    if (!confirmed) return;

    try {
      await chartsService.deleteChart(chartId);
      setPinnedCharts((prev) => prev.filter((c) => c.id !== chartId));
    } catch (error) {
      console.error('Failed to delete chart:', error);
      alert('Failed to remove chart');
    }
  };

  const handleResize = async (chartId: string, newSize: ChartSize) => {
    setPinnedCharts((prev) =>
      prev.map((chart) =>
        chart.id === chartId ? { ...chart, size: newSize } : chart,
      ),
    );
    await chartsService.updateChartSize(chartId, newSize);
  };

  const handleExpand = (chartId: string) => {
    const chart = pinnedCharts.find((c) => c.id === chartId);
    if (chart) {
      navigate('/insights', { state: { initialQuestion: chart.query_text } });
    }
  };

  const handleRefresh = async (chartId: string) => {
    console.log('Refreshing chart:', chartId);
  };

  const handleDrillDown = (chart: PinnedChart) => {
    const data = generateDrillDownData(chart);
    setDrillDownData(data);
    setIsDrillDownOpen(true);
  };

  const handleCloseDrillDown = () => {
    setIsDrillDownOpen(false);
    setDrillDownData(null);
  };

  const hasData =
    isDemoMode ||
    localStorage.getItem('vizier_has_data') === 'true' ||
    pinnedCharts.length > 0;

  const getColSpan = (size: string) => {
    if (layout === 'list') return 'col-span-12';
    switch (size) {
      case 'small':
        return 'col-span-12 md:col-span-6 lg:col-span-4';
      case 'medium':
        return 'col-span-12 md:col-span-6 lg:col-span-6';
      case 'large':
        return 'col-span-12 lg:col-span-8';
      default:
        return 'col-span-12 md:col-span-6 lg:col-span-6';
    }
  };

  const getGridGap = () => {
    const gaps = { comfortable: 'gap-4', compact: 'gap-3', dense: 'gap-2' };
    return gaps[density];
  };

  const getGridPadding = () => {
    const padding = { comfortable: 'px-4', compact: 'px-3', dense: 'px-2' };
    return padding[density];
  };

  const headerTitle = pinnedCharts.length > 0 ? 'My Dashboard' : 'Welcome back';
  const pinnedCountText = pinnedCharts.length === 1 ? 'insight' : 'insights';
  const headerSubtitle =
    pinnedCharts.length > 0
      ? `${pinnedCharts.length} pinned ${pinnedCountText}`
      : "Here's an overview of your healthcare analytics";

  return (
    <div className="h-full overflow-y-auto bg-black">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {headerTitle}
              {pinnedCharts.length === 0 && user?.first_name
                ? `, ${user.first_name}`
                : ''}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">{headerSubtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Density toggle - only show when charts exist */}
            {pinnedCharts.length > 0 && (
              <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
                <button
                  type="button"
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
                  type="button"
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
                  type="button"
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

            {/* Layout toggle */}
            {pinnedCharts.length > 0 && (
              <div className="flex items-center bg-gray-800 rounded-lg p-0.5">
                <button
                  type="button"
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
                  type="button"
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

            {/* Refresh button */}
            {pinnedCharts.length > 0 && (
              <button
                type="button"
                onClick={loadCharts}
                disabled={isLoading}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                title="Refresh all"
              >
                <RefreshCw
                  className={`w-4 h-4 text-white ${isLoading ? 'animate-spin' : ''}`}
                />
              </button>
            )}

            {/* Add Chart / Ask Vizier button */}
            <button
              type="button"
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
          <div className="px-3 py-3" data-tour="stats">
            <StatsOverview stats={stats} />
          </div>

          <div data-tour="saved-insights">
            <PinnedChartsSection
              isLoading={isLoading}
              pinnedCharts={pinnedCharts}
              density={density}
              onUnpin={handleUnpin}
              onResize={handleResize}
              onExpand={handleExpand}
              onRefresh={handleRefresh}
              onDrillDown={handleDrillDown}
              user={user}
              getColSpan={getColSpan}
              getGridPadding={getGridPadding}
              getGridGap={getGridGap}
            />
          </div>

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
  const FIRST_NAMES = [
    'John',
    'Mary',
    'Robert',
    'Patricia',
    'Michael',
    'Jennifer',
    'William',
    'Linda',
    'David',
    'Elizabeth',
    'Richard',
    'Barbara',
    'Joseph',
    'Susan',
    'Thomas',
    'Jessica',
    'Charles',
    'Sarah',
    'Christopher',
    'Karen',
  ];
  const LAST_NAMES = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
  ];

  // Helper for risk score
  const getRiskScore = (index: number): 'High' | 'Medium' | 'Low' => {
    if (index < 5) return 'High';
    if (index < 12) return 'Medium';
    return 'Low';
  };

  const generatePatients = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `patient-${i + 1}`,
      name: `${FIRST_NAMES[i % 20]} ${LAST_NAMES[i % 20]}`,
      mrn: `MRN-${String(12847 + i).padStart(5, '0')}`,
      age: 45 + Math.floor(Math.random() * 40),
      lastVisit: `12/${20 - (i % 20)}/2024`,
      primaryMetric: `${155 + Math.floor(Math.random() * 30)}/${85 + Math.floor(Math.random() * 20)}`,
      riskScore: getRiskScore(i),
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
