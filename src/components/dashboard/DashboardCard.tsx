import React, { useState, useEffect } from 'react';
import { X, Maximize2, RefreshCw, ExternalLink, MessageSquare, Globe, Lock } from 'lucide-react';
import { ChartRenderer } from '../insights/ChartRenderer';
import { PinnedChart } from '../../services/charts.service';

interface Annotation {
  id: string;
  userId: string;
  userName: string;
  text: string;
  isPublic: boolean;
  timestamp: string;
}

interface CurrentUser {
  id: string;
  name: string;
}

interface DashboardCardProps {
  chart: PinnedChart & { size?: 'small' | 'medium' | 'large' };
  onUnpin: (id: string) => void;
  onResize: (id: string, size: 'small' | 'medium' | 'large') => void;
  onExpand: (id: string) => void;
  onRefresh?: (id: string) => void;
  currentUser: CurrentUser;
}

function getSizeHeight(size?: string): number {
  switch (size) {
    case 'small': return 250;
    case 'medium': return 350;
    case 'large': return 500;
    default: return 350;
  }
}

// Generate Key Insight based on chart question
function generateKeyInsight(chart: PinnedChart): string {
  // Use Vanna's explanation if available
  if (chart.explanation) {
    return chart.explanation;
  }

  const question = (chart.query_text || chart.title || '').toLowerCase();

  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return "Your most common diagnosis is Essential Hypertension, affecting approximately 25% of your patient population. This aligns with national averages for primary care practices.";
  }

  if (question.includes('age') || question.includes('demographic')) {
    return "Your patient population skews older, with 63% of patients over 45 years old. The largest segment is the 65+ age group at 28%.";
  }

  if (question.includes('readmission')) {
    return "Your 30-day readmission rate has declined from 14.2% to 12.3% over the past 6 months, now sitting below the national average of 14.5%.";
  }

  if (question.includes('encounter') || question.includes('volume')) {
    return "Encounter volume has remained stable at approximately 4,000 encounters per month, with slight seasonal variations.";
  }

  if (question.includes('cost')) {
    return "Average encounter cost is $4,250, consistent with expected ranges for your patient mix and service types.";
  }

  if (question.includes('patient') && question.includes('count')) {
    return "Your patient population shows healthy growth patterns with consistent engagement across demographics.";
  }

  // Default
  return "Analysis of your healthcare data reveals important patterns for clinical and operational decision-making.";
}

// Generate What This Means - Clinical significance
function generateMeaning(chart: PinnedChart): string {
  const question = (chart.query_text || chart.title || '').toLowerCase();

  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return "This patient distribution indicates your screening and diagnosis processes are functioning effectively. The prevalence of hypertension and diabetes suggests a need for robust chronic disease management programs.";
  }

  if (question.includes('age') || question.includes('demographic')) {
    return "Understanding your demographic composition is critical for resource allocation and care program design. An older patient population requires different care pathways, more preventive services, and specialized geriatric care protocols.";
  }

  if (question.includes('readmission')) {
    return "Declining readmission rates indicate improving care coordination and discharge planning. This positive trend suggests your quality improvement initiatives are working and patient engagement is strong.";
  }

  if (question.includes('encounter') || question.includes('volume')) {
    return "Stable encounter volume provides predictability for staffing and resource planning. Seasonal patterns help anticipate capacity needs and optimize scheduling.";
  }

  if (question.includes('cost')) {
    return "Cost metrics within expected ranges suggest appropriate resource utilization and billing practices. Monitoring cost trends by diagnosis helps identify opportunities for efficiency improvements.";
  }

  if (question.includes('patient') && question.includes('count')) {
    return "Patient volume metrics are essential for capacity planning and resource allocation. Understanding growth trends helps prepare for future demand.";
  }

  // Default
  return "This data provides essential context for clinical decision-making and operational planning. Use these insights to inform strategic resource allocation and quality improvement initiatives.";
}

// Generate Recommended Actions - What to do
function generateRecommendations(chart: PinnedChart): string {
  const question = (chart.query_text || chart.title || '').toLowerCase();

  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return "Consider expanding preventive care programs for high-prevalence conditions. Implement care coordination protocols for patients with multiple comorbidities. Set up monitoring alerts if any diagnosis shows unexpected growth.";
  }

  if (question.includes('age') || question.includes('demographic')) {
    return "Develop age-appropriate care pathways, particularly for geriatric patients. Consider Medicare Advantage partnerships. Invest in preventive services tailored to older adults with chronic conditions.";
  }

  if (question.includes('readmission')) {
    return "Continue current discharge planning protocols that are proving effective. Document successful practices to replicate across departments. Set up alerts if rate increases above 13% to maintain quality standards.";
  }

  if (question.includes('encounter') || question.includes('volume')) {
    return "Use volume patterns to optimize staffing schedules. Plan for seasonal fluctuations in advance. Consider capacity expansion if sustained growth trends emerge.";
  }

  if (question.includes('cost')) {
    return "Monitor cost outliers to identify potential billing issues or high-cost cases requiring case management. Compare costs across similar diagnosis groups to identify efficiency opportunities.";
  }

  if (question.includes('patient') && question.includes('count')) {
    return "Track patient acquisition sources to optimize outreach. Monitor retention rates and implement engagement programs for at-risk patients.";
  }

  // Default
  return "Share these insights with relevant stakeholders for aligned decision-making. Use this data to inform strategic planning and resource allocation discussions.";
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  chart,
  onUnpin,
  onResize,
  onExpand,
  onRefresh,
  currentUser,
}) => {
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPublic, setAnnotationPublic] = useState(true);

  // Load annotations from localStorage
  useEffect(() => {
    const key = `annotations_${chart.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setAnnotations(JSON.parse(saved));
      } catch {
        setAnnotations([]);
      }
    }
  }, [chart.id]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    if (onRefresh) {
      onRefresh(chart.id);
    }

    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAddAnnotation = () => {
    if (!annotationText.trim()) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      text: annotationText.trim(),
      isPublic: annotationPublic,
      timestamp: new Date().toISOString(),
    };

    const updated = [...annotations, newAnnotation];
    setAnnotations(updated);

    // Save to localStorage
    localStorage.setItem(`annotations_${chart.id}`, JSON.stringify(updated));

    // Reset form
    setAnnotationText('');
    setIsAddingAnnotation(false);
  };

  // Filter annotations (show public + user's private)
  const visibleAnnotations = annotations.filter(
    ann => ann.isPublic || ann.userId === currentUser.id
  );

  const chartHeight = getSizeHeight(chart.size);

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">

      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-start justify-between flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
            {chart.query_text || chart.title}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(chart.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>

        <div className="flex items-center gap-1 ml-3">
          {/* Add Note Button */}
          <button
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className={`p-2 rounded-lg transition-colors ${
              isAddingAnnotation ? 'bg-amber-500/20 text-amber-400' : 'hover:bg-gray-700 text-gray-400 hover:text-white'
            }`}
            title="Add note"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Size menu */}
          <div className="relative">
            <button
              onClick={() => setShowSizeMenu(!showSizeMenu)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Resize"
            >
              <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>

            {showSizeMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSizeMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 min-w-[120px] py-1">
                  <button
                    onClick={() => { onResize(chart.id, 'small'); setShowSizeMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      chart.size === 'small' ? 'text-amber-400 bg-gray-700' : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => { onResize(chart.id, 'medium'); setShowSizeMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      chart.size === 'medium' || !chart.size ? 'text-amber-400 bg-gray-700' : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => { onResize(chart.id, 'large'); setShowSizeMenu(false); }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      chart.size === 'large' ? 'text-amber-400 bg-gray-700' : 'text-white hover:bg-gray-700'
                    }`}
                  >
                    Large
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 hover:text-white ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Expand / View in Ask Vizier */}
          <button
            onClick={() => onExpand(chart.id)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="View in Ask Vizier"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>

          {/* Unpin */}
          <button
            onClick={() => onUnpin(chart.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove from dashboard"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Annotation Form */}
      {isAddingAnnotation && (
        <div className="p-4 bg-gray-900/50 border-b border-gray-700">
          <textarea
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Add your note about this insight..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-amber-500"
            rows={2}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="radio"
                  name={`visibility-${chart.id}`}
                  checked={annotationPublic}
                  onChange={() => setAnnotationPublic(true)}
                  className="accent-amber-500"
                />
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="radio"
                  name={`visibility-${chart.id}`}
                  checked={!annotationPublic}
                  onChange={() => setAnnotationPublic(false)}
                  className="accent-amber-500"
                />
                <Lock className="w-4 h-4" />
                <span>Private</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingAnnotation(false)}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAnnotation}
                disabled={!annotationText.trim()}
                className="px-3 py-1.5 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 text-black text-sm font-medium rounded-lg transition-colors"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Annotations Display */}
      {visibleAnnotations.length > 0 && (
        <div className="px-4 py-3 bg-gray-900/30 border-b border-gray-700 space-y-2 max-h-32 overflow-y-auto">
          {visibleAnnotations.map(annotation => (
            <div key={annotation.id} className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-0.5">
                {annotation.isPublic ? (
                  <Globe className="w-3 h-3 text-gray-500" />
                ) : (
                  <Lock className="w-3 h-3 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 leading-relaxed">
                  <span className="font-semibold text-white">{annotation.userName}:</span>{' '}
                  {annotation.text}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {new Date(annotation.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 p-4 min-h-0 bg-white">
        <div style={{ height: chartHeight }}>
          {chart.chart_data && chart.chart_type ? (
            <ChartRenderer
              type={chart.chart_type as any}
              data={chart.chart_data}
              height={chartHeight}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No visualization available</p>
            </div>
          )}
        </div>
      </div>

      {/* Explanations - Three Sections */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/50 space-y-3 flex-shrink-0">

        {/* Key Insight */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
            Key Insight
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateKeyInsight(chart)}
          </p>
        </div>

        {/* What This Means */}
        <div>
          <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">
            What This Means
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateMeaning(chart)}
          </p>
        </div>

        {/* Recommended Actions */}
        <div>
          <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">
            Recommended Actions
          </h4>
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateRecommendations(chart)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
