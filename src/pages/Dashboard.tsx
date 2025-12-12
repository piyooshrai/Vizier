// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { InsightsGrid } from '../components/dashboard/InsightsGrid';
import { EmptyDashboard } from '../components/dashboard/EmptyDashboard';
import { QuickActions } from '../components/dashboard/QuickActions';
import { DemoWelcomeModal } from '../components/onboarding/DemoWelcomeModal';
import { ProductTour } from '../components/onboarding/ProductTour';
import { UpgradePrompt } from '../components/onboarding/UpgradePrompt';

interface SavedInsight {
  id: string;
  question: string;
  answer: string;
  chartType: string;
  chartData: any;
  timestamp: Date;
  explanation: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode } = useAuth();
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([]);
  const [showTour, setShowTour] = useState(false);

  // Demo stats
  const demoStats = {
    totalPatients: 12847,
    totalEncounters: 47293,
    readmissionRate: 12.3,
    avgCost: 4250,
  };

  // Demo saved insights - all gold themed
  const demoInsights: SavedInsight[] = [
    {
      id: '1',
      question: 'What are my top diagnoses by patient volume?',
      answer: 'Hypertension leads with 3,247 patients',
      chartType: 'bar_chart',
      chartData: [
        { name: 'Hypertension', value: 3247 },
        { name: 'Type 2 Diabetes', value: 2891 },
        { name: 'Hyperlipidemia', value: 2456 },
        { name: 'Obesity', value: 1987 },
        { name: 'Anxiety', value: 1654 },
      ],
      timestamp: new Date('2024-01-15'),
      explanation:
        'Hypertension is your most common diagnosis, affecting 25% of your patient population. This is consistent with national averages for primary care.',
    },
    {
      id: '2',
      question: 'Show me patient age distribution',
      answer: '45-64 is the largest age group',
      chartType: 'pie_chart',
      chartData: [
        { name: '0-17', value: 1285 },
        { name: '18-44', value: 3456 },
        { name: '45-64', value: 4567 },
        { name: '65+', value: 3539 },
      ],
      timestamp: new Date('2024-01-14'),
      explanation:
        'Your patient population skews older, with 63% of patients over 45. Consider focusing preventive care resources on this demographic.',
    },
    {
      id: '3',
      question: 'What is my readmission trend over time?',
      answer: 'Readmissions decreased 12% this year',
      chartType: 'line_chart',
      chartData: [
        { month: 'Jan', rate: 9.8 },
        { month: 'Feb', rate: 9.5 },
        { month: 'Mar', rate: 9.2 },
        { month: 'Apr', rate: 8.9 },
        { month: 'May', rate: 8.7 },
        { month: 'Jun', rate: 8.2 },
      ],
      timestamp: new Date('2024-01-13'),
      explanation:
        'Your readmission rate has steadily declined, now sitting below the national average of 9.1%. Care coordination efforts appear to be working.',
    },
  ];

  useEffect(() => {
    if (isDemoMode) {
      setSavedInsights(demoInsights);
    } else {
      // Load from localStorage for real users
      const saved = localStorage.getItem('vizier_saved_insights');
      if (saved) {
        setSavedInsights(JSON.parse(saved));
      }
    }
  }, [isDemoMode]);

  const handleDeleteInsight = (id: string) => {
    const confirmed = window.confirm('Delete this insight?');
    if (confirmed) {
      setSavedInsights((prev) => {
        const updated = prev.filter((i) => i.id !== id);
        if (!isDemoMode) {
          localStorage.setItem('vizier_saved_insights', JSON.stringify(updated));
        }
        // Also update the layout in localStorage
        const savedLayout = localStorage.getItem('dashboard_layout');
        if (savedLayout) {
          const layouts = JSON.parse(savedLayout).filter(
            (l: { i: string }) => l.i !== id
          );
          localStorage.setItem('dashboard_layout', JSON.stringify(layouts));
        }
        return updated;
      });
    }
  };

  const handleExpandInsight = (id: string) => {
    // Navigate to insights page with this question pre-filled
    const insight = savedInsights.find((i) => i.id === id);
    if (insight) {
      navigate('/insights', { state: { initialQuestion: insight.question } });
    }
  };

  // Check if user has data
  const hasData = isDemoMode || localStorage.getItem('vizier_has_data') === 'true';

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back{user?.first_name ? `, ${user.first_name}` : ''}
            </h1>
            <p className="text-gray-400 mt-1">
              Here's an overview of your healthcare analytics
            </p>
          </div>

          <button
            data-tour="ask-vizier"
            onClick={() => navigate('/insights')}
            className="px-6 py-3 bg-white hover:bg-gray-100 text-black font-semibold rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Ask Vizier
          </button>
        </div>

        {hasData ? (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div data-tour="stats">
              <StatsOverview stats={demoStats} />
            </div>

            {/* Saved Insights */}
            {savedInsights.length > 0 && (
              <div data-tour="saved-insights">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Saved Insights</h2>
                  <button
                    onClick={() => navigate('/insights')}
                    className="px-4 py-2 bg-white hover:bg-gray-100 text-black text-sm font-semibold rounded-lg transition-colors"
                  >
                    Ask New Question
                  </button>
                </div>
                {/* Grid container with proper constraints */}
                <div className="w-full min-h-[600px]">
                  <InsightsGrid
                    insights={savedInsights}
                    onDeleteInsight={handleDeleteInsight}
                    onExpandInsight={handleExpandInsight}
                  />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <QuickActions />
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-lg">
            <EmptyDashboard isDemoMode={isDemoMode} />
          </div>
        )}
        </div>
      </div>

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
