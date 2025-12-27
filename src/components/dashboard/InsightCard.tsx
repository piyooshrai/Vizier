import React, { useState, useEffect } from 'react';
import { Trash2, Maximize2, MessageSquare, Lock, Globe } from 'lucide-react';
import { ChartRenderer } from '../insights/ChartRenderer';

interface Annotation {
  id: string;
  userId: string;
  userName: string;
  text: string;
  isPublic: boolean;
  timestamp: Date;
}

interface InsightCardProps {
  insight: {
    id: string;
    question: string;
    answer: string;
    chartType: string;
    chartData: any;
    explanation: string;
    timestamp: Date;
  };
  size?: 'small' | 'medium' | 'large';
  onDelete: (id: string) => void;
  onExpand: (id: string) => void;
  currentUser?: {
    id: string;
    name: string;
  };
}

export const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  size = 'medium',
  onDelete,
  onExpand,
  currentUser = { id: 'default', name: 'User' },
}) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPublic, setAnnotationPublic] = useState(true);

  // Load annotations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`annotations_${insight.id}`);
    if (saved) {
      setAnnotations(JSON.parse(saved));
    }
  }, [insight.id]);

  const handleAddAnnotation = () => {
    if (!annotationText.trim()) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      text: annotationText,
      isPublic: annotationPublic,
      timestamp: new Date(),
    };

    const updated = [...annotations, newAnnotation];
    setAnnotations(updated);
    localStorage.setItem(`annotations_${insight.id}`, JSON.stringify(updated));

    setAnnotationText('');
    setIsAddingAnnotation(false);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    const updated = annotations.filter(a => a.id !== annotationId);
    setAnnotations(updated);
    localStorage.setItem(`annotations_${insight.id}`, JSON.stringify(updated));
  };

  const visibleAnnotations = annotations.filter(
    ann => ann.isPublic || ann.userId === currentUser.id
  );

  // Size-based styling
  const sizeClasses = {
    small: 'min-h-[400px]',
    medium: 'min-h-[500px]',
    large: 'min-h-[600px]',
  };

  const chartHeight = {
    small: 200,
    medium: 280,
    large: 400,
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden flex flex-col h-full ${sizeClasses[size]}`}>

      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-start justify-between flex-shrink-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base mb-1 line-clamp-2">
            {insight.question}
          </h3>
          <p className="text-xs text-gray-400">
            {new Date(insight.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-3">
          <button
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Add note"
          >
            <MessageSquare className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => onExpand(insight.id)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="View in Ask Vizier"
          >
            <Maximize2 className="w-4 h-4 text-gray-400 hover:text-white" />
          </button>
          <button
            onClick={() => onDelete(insight.id)}
            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Remove from dashboard"
          >
            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>

      {/* Add Annotation Form */}
      {isAddingAnnotation && (
        <div className="p-4 bg-gray-900/50 border-b border-gray-700">
          <textarea
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Add your note about this insight..."
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-white"
            rows={2}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="radio"
                  checked={annotationPublic}
                  onChange={() => setAnnotationPublic(true)}
                  className="text-white"
                />
                <Globe className="w-4 h-4" />
                <span>Public</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="radio"
                  checked={!annotationPublic}
                  onChange={() => setAnnotationPublic(false)}
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
                className="px-3 py-1.5 bg-white hover:bg-gray-100 text-black text-sm font-medium rounded-lg transition-colors"
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
            <div key={annotation.id} className="flex items-start gap-2 group">
              <div className="flex-shrink-0 mt-0.5">
                {annotation.isPublic ? (
                  <Globe className="w-3 h-3 text-gray-500" />
                ) : (
                  <Lock className="w-3 h-3 text-gray-500" />
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
              {annotation.userId === currentUser.id && (
                <button
                  onClick={() => handleDeleteAnnotation(annotation.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 p-4 min-h-0 bg-white">
        {insight.chartData && insight.chartType ? (
          <div className="h-full">
            <ChartRenderer
              type={insight.chartType as any}
              data={insight.chartData}
              height={chartHeight[size]}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No visualization available</p>
          </div>
        )}
      </div>

      {/* Intelligent Explanation */}
      {insight.explanation && (
        <div className="p-4 border-t border-gray-700 bg-gray-900/50 flex-shrink-0 space-y-3">

          {/* Main Explanation */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              Key Insight
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {insight.explanation}
            </p>
          </div>

          {/* What This Means */}
          <div>
            <h4 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">
              What This Means
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {generateMeaning(insight)}
            </p>
          </div>

          {/* What To Do */}
          <div>
            <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">
              Recommended Actions
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {generateRecommendations(insight)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to generate "What this means" from insight
function generateMeaning(insight: { explanation: string; question: string }): string {
  const explanation = insight.explanation.toLowerCase();
  const question = insight.question.toLowerCase();

  if (explanation.includes('hypertension') || question.includes('diagnos')) {
    return "Your screening and diagnosis processes are working effectively. This patient distribution aligns with expected patterns for your facility type.";
  }

  if (explanation.includes('readmission') && explanation.includes('below')) {
    return "Your care coordination and discharge planning are performing well. This is a positive indicator of care quality and patient engagement.";
  }

  if (explanation.includes('readmission') && explanation.includes('decline')) {
    return "Your care coordination and discharge planning are performing well. This is a positive indicator of care quality and patient engagement.";
  }

  if (explanation.includes('age') || question.includes('age') || question.includes('demographic')) {
    return "Understanding your patient demographics helps tailor care programs and resource allocation to meet the specific needs of your population.";
  }

  if (question.includes('cost') || question.includes('expense')) {
    return "Cost analysis helps identify opportunities for operational efficiency while maintaining quality of care.";
  }

  if (question.includes('encounter') || question.includes('visit')) {
    return "Understanding encounter patterns helps optimize staffing, scheduling, and resource allocation.";
  }

  return "This data point provides important context for clinical and operational decision-making.";
}

// Helper function to generate recommendations
function generateRecommendations(insight: { explanation: string; question: string }): string {
  const explanation = insight.explanation.toLowerCase();
  const question = insight.question.toLowerCase();

  if (explanation.includes('hypertension') || question.includes('diagnos')) {
    return "Consider expanding preventive care programs for at-risk patients. Monitor patients with multiple comorbidities for care coordination opportunities.";
  }

  if ((explanation.includes('readmission') && explanation.includes('below')) ||
      (explanation.includes('readmission') && explanation.includes('decline'))) {
    return "Continue current discharge planning protocols. Document successful practices to replicate across departments. Set up monitoring alerts if rate increases above target.";
  }

  if ((explanation.includes('age') || question.includes('age')) && explanation.includes('older')) {
    return "Focus resources on geriatric care programs and preventive services. Consider specialized care pathways for older adults with complex conditions.";
  }

  if (question.includes('age') || question.includes('demographic')) {
    return "Use demographic insights to tailor patient communication and outreach programs. Consider age-specific care protocols.";
  }

  if (question.includes('cost') || question.includes('expense')) {
    return "Review high-cost areas for optimization opportunities. Compare with industry benchmarks and identify best practices.";
  }

  if (question.includes('encounter') || question.includes('visit')) {
    return "Review scheduling patterns and staffing levels. Consider opportunities to improve patient flow and reduce wait times.";
  }

  return "Use this insight to inform strategic planning and resource allocation decisions. Share with relevant stakeholders for aligned decision-making.";
}

export default InsightCard;
