import {
  Download,
  Edit2,
  ExternalLink,
  Globe,
  Lock,
  MessageSquare,
  RefreshCw,
  Trash2,
  X,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { annotationsService, getErrorMessage } from '../../services';
import type { PinnedChart } from '../../services/charts.service';
import type { NotePublic, VisibilityScope } from '../../types';
import { ChartRenderer } from '../insights/ChartRenderer';

type ChartSize = 'small' | 'medium' | 'large';
type DensityOption = 'comfortable' | 'compact' | 'dense';

interface Annotation {
  id: string;
  userId: string;
  userName: string;
  text: string;
  isPublic: boolean;
  timestamp: string;
  edited?: boolean;
}

interface CurrentUser {
  id: string;
  name: string;
}

interface DashboardCardProps {
  chart: PinnedChart & { size?: ChartSize };
  onUnpin: (id: string) => void;
  onResize: (id: string, size: ChartSize) => void;
  onExpand: (id: string) => void;
  onDownload?: (chart: PinnedChart) => void;
  onRefresh?: (id: string) => void;
  onDrillDown?: (chart: PinnedChart) => void;
  currentUser: CurrentUser;
  density?: DensityOption;
}

// Density-based chart heights
function getChartHeight(
  size: ChartSize | undefined,
  density: DensityOption,
): number {
  const heights = {
    comfortable: { small: 320, medium: 420, large: 550 },
    compact: { small: 240, medium: 320, large: 420 },
    dense: { small: 180, medium: 260, large: 340 },
  };
  const densityHeights =
    heights[density as keyof typeof heights] || heights.compact;
  return (
    densityHeights[size as keyof typeof densityHeights] || densityHeights.medium
  );
}

// Density-based padding classes
function getPaddingClasses(density: DensityOption) {
  const padding = {
    comfortable: {
      header: 'p-4',
      chart: 'p-4',
      explanation: 'p-4',
      annotation: 'p-4',
    },
    compact: {
      header: 'px-3 py-2.5',
      chart: 'p-3',
      explanation: 'px-3 py-2.5',
      annotation: 'px-3 py-2',
    },
    dense: {
      header: 'px-2.5 py-2',
      chart: 'p-2',
      explanation: 'px-2.5 py-2',
      annotation: 'px-2.5 py-1.5',
    },
  };
  return padding[density as keyof typeof padding] || padding.compact;
}

// Density-based text sizes
function getTextClasses(density: DensityOption) {
  const sizes = {
    comfortable: { title: 'text-base', body: 'text-sm', label: 'text-xs' },
    compact: { title: 'text-sm', body: 'text-xs', label: 'text-xs' },
    dense: { title: 'text-sm', body: 'text-xs', label: 'text-xs' },
  };
  return sizes[density as keyof typeof sizes] || sizes.compact;
}

// Density-based icon sizes
function getIconSize(density: DensityOption): string {
  const sizes = {
    comfortable: 'w-4 h-4',
    compact: 'w-3.5 h-3.5',
    dense: 'w-3 h-3',
  };
  return sizes[density as keyof typeof sizes] || sizes.compact;
}

// Density-based button padding
function getButtonPadding(density: DensityOption): string {
  const padding = { comfortable: 'p-2', compact: 'p-1.5', dense: 'p-1' };
  return padding[density as keyof typeof padding] || padding.compact;
}

// Generate Key Insight based on chart question
function generateKeyInsight(chart: PinnedChart): string {
  if (chart.explanation) return chart.explanation;
  const question = (chart.title || chart.query_text || '').toLowerCase();

  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return 'Your most common diagnosis is Essential Hypertension, affecting approximately 25% of your patient population.';
  }
  if (question.includes('age') || question.includes('demographic')) {
    return 'Your patient population skews older, with 63% of patients over 45 years old.';
  }
  if (question.includes('readmission')) {
    return 'Your 30-day readmission rate has declined from 14.2% to 12.3%, below national average.';
  }
  if (question.includes('encounter') || question.includes('volume')) {
    return 'Encounter volume remains stable at approximately 4,000 encounters per month.';
  }
  if (question.includes('cost')) {
    return 'Average encounter cost is $4,250, consistent with expected ranges.';
  }
  if (question.includes('patient') && question.includes('count')) {
    return 'Your patient population shows healthy growth patterns with consistent engagement.';
  }
  return 'Analysis reveals important patterns for clinical and operational decision-making.';
}

// Generate What This Means - Clinical significance
function generateMeaning(chart: PinnedChart): string {
  const question = (chart.title || chart.query_text || '').toLowerCase();

  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return 'This indicates effective screening processes. High hypertension prevalence suggests need for chronic disease management.';
  }
  if (question.includes('age') || question.includes('demographic')) {
    return 'Older population requires different care pathways and specialized geriatric protocols.';
  }
  if (question.includes('readmission')) {
    return 'Declining rates indicate improving care coordination and discharge planning.';
  }
  if (question.includes('encounter') || question.includes('volume')) {
    return 'Stable volume provides predictability for staffing and resource planning.';
  }
  if (question.includes('cost')) {
    return 'Cost metrics within expected ranges suggest appropriate resource utilization.';
  }
  if (question.includes('patient') && question.includes('count')) {
    return 'Volume metrics essential for capacity planning and resource allocation.';
  }
  return 'Use these insights to inform strategic resource allocation decisions.';
}

// Generate Recommended Actions
function generateRecommendations(chart: PinnedChart): string {
  const question = (chart.title || chart.query_text || '').toLowerCase();

  if (question.includes('diagnosis') || question.includes('diagnoses')) {
    return 'Expand preventive care programs. Implement care coordination for comorbidities.';
  }
  if (question.includes('age') || question.includes('demographic')) {
    return 'Develop age-appropriate care pathways. Consider Medicare Advantage partnerships.';
  }
  if (question.includes('readmission')) {
    return 'Continue discharge planning protocols. Set alerts if rate exceeds 13%.';
  }
  if (question.includes('encounter') || question.includes('volume')) {
    return 'Optimize staffing schedules based on volume patterns.';
  }
  if (question.includes('cost')) {
    return 'Monitor cost outliers. Compare costs across diagnosis groups.';
  }
  if (question.includes('patient') && question.includes('count')) {
    return 'Track acquisition sources. Monitor retention rates.';
  }
  return 'Share insights with stakeholders for aligned decision-making.';
}

const getSizeLabel = (size: ChartSize) => {
  if (size === 'small') return 'S';
  if (size === 'medium') return 'M';
  return 'L';
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  chart,
  onUnpin,
  onResize,
  onExpand,
  onDownload,
  onRefresh,
  onDrillDown,
  currentUser,
  density = 'compact',
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [annotationText, setAnnotationText] = useState('');
  const [annotationPublic, setAnnotationPublic] = useState(true);
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(
    null,
  );
  const [editText, setEditText] = useState('');
  const [annotationsError, setAnnotationsError] = useState('');
  const [isSavingAnnotation, setIsSavingAnnotation] = useState(false);
  const [isDeletingAnnotationId, setIsDeletingAnnotationId] = useState<
    string | null
  >(null);
  const isDemoMode = localStorage.getItem('is_demo') === 'true';

  // Load annotations from localStorage
  useEffect(() => {
    let isMounted = true;

    const mapNoteToAnnotation = (note: NotePublic): Annotation => ({
      id: note.id,
      userId: note.user_id,
      userName: note.author_name,
      text: note.note_content,
      isPublic: note.visibility_scope !== 'Private',
      timestamp: note.created_at,
    });

    const getDemoAnnotations = (): Annotation[] => {
      const key = `annotations_${chart.id}`;
      const saved = localStorage.getItem(key);
      if (!saved) return [];
      try {
        return JSON.parse(saved) as Annotation[];
      } catch {
        return [];
      }
    };

    const loadAnnotations = async () => {
      setAnnotationsError('');

      if (isDemoMode) {
        if (isMounted) setAnnotations(getDemoAnnotations());
        return;
      }

      try {
        const response = await annotationsService.getAnnotations(chart.id);
        if (isMounted) {
          setAnnotations(response.map(mapNoteToAnnotation));
        }
      } catch (error) {
        if (isMounted) {
          setAnnotationsError(getErrorMessage(error));
        }
      }
    };

    loadAnnotations();

    return () => {
      isMounted = false;
    };
  }, [chart.id, isDemoMode]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    if (onRefresh) onRefresh(chart.id);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAddAnnotation = async () => {
    if (!annotationText.trim()) return;
    setAnnotationsError('');
    setIsSavingAnnotation(true);

    try {
      if (isDemoMode) {
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
        localStorage.setItem(
          `annotations_${chart.id}`,
          JSON.stringify(updated),
        );
      } else {
        const visibility: VisibilityScope = annotationPublic
          ? 'Public'
          : 'Private';
        const created = await annotationsService.createAnnotation({
          note_content: annotationText.trim(),
          saved_chart_id: chart.id,
          visibility_scope: visibility,
        });
        const newAnnotation: Annotation = {
          id: created.id,
          userId: created.user_id,
          userName: created.author_name,
          text: created.note_content,
          isPublic: created.visibility_scope !== 'Private',
          timestamp: created.created_at,
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
      }

      setAnnotationText('');
      setIsAddingAnnotation(false);
    } catch (error) {
      setAnnotationsError(getErrorMessage(error));
    } finally {
      setIsSavingAnnotation(false);
    }
  };

  // Edit annotation handler
  const handleEditAnnotation = (annotation: Annotation) => {
    if (!isDemoMode) return;
    setEditingAnnotationId(annotation.id);
    setEditText(annotation.text);
    setIsAddingAnnotation(false); // Close add form if open
  };

  // Save edit handler
  const handleSaveEdit = () => {
    if (!isDemoMode) return;
    if (!editText.trim()) return;

    const updated = annotations.map((ann) =>
      ann.id === editingAnnotationId
        ? {
          ...ann,
          text: editText.trim(),
          timestamp: new Date().toISOString(),
          edited: true,
        }
        : ann,
    );

    setAnnotations(updated);
    localStorage.setItem(`annotations_${chart.id}`, JSON.stringify(updated));

    setEditingAnnotationId(null);
    setEditText('');
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    if (!isDemoMode) return;
    setEditingAnnotationId(null);
    setEditText('');
  };

  // Delete annotation handler
  const handleDeleteAnnotation = async (annotationId: string) => {
    const confirmed = globalThis.confirm(
      'Delete this note? This cannot be undone.',
    );
    if (!confirmed) return;

    setAnnotationsError('');
    setIsDeletingAnnotationId(annotationId);
    try {
      if (isDemoMode) {
        const updated = annotations.filter((ann) => ann.id !== annotationId);
        setAnnotations(updated);
        localStorage.setItem(
          `annotations_${chart.id}`,
          JSON.stringify(updated),
        );
      } else {
        await annotationsService.deleteAnnotation(annotationId);
        setAnnotations((prev) =>
          prev.filter((annotation) => annotation.id !== annotationId),
        );
      }
    } catch (error) {
      setAnnotationsError(getErrorMessage(error));
    } finally {
      setIsDeletingAnnotationId(null);
    }
  };

  const visibleAnnotations = annotations.filter(
    (ann) => ann.isPublic || ann.userId === currentUser.id,
  );

  const chartHeight = getChartHeight(chart.size, density);
  const padding = getPaddingClasses(density);
  const text = getTextClasses(density);
  const iconSize = getIconSize(density);
  const btnPadding = getButtonPadding(density);
  const currentSize = chart.size || 'medium';

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div
        className={`${padding.header} border-b border-gray-700 flex items-start justify-between flex-shrink-0`}
      >
        <div className="flex-1 min-w-0">
          <h3
            className={`text-white font-semibold ${text.title} mb-0.5 line-clamp-2`}
          >
            {chart.title || chart.query_text}
          </h3>
          <p className={`${text.label} text-gray-400`}>
            {new Date(chart.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center gap-0.5 ml-2">
          {/* Add Note Button */}
          <button
            type="button"
            onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            className={`${btnPadding} rounded-lg transition-colors ${isAddingAnnotation
                ? 'bg-amber-500/20 text-amber-400'
                : 'hover:bg-gray-700 text-gray-400 hover:text-white'
              }`}
            title="Add note"
          >
            <MessageSquare className={iconSize} />
          </button>

          {/* Size toggle */}
          <div className="flex items-center gap-0.5 bg-gray-800/70 border border-gray-700 rounded-lg p-0.5">
            {(['small', 'medium', 'large'] as ChartSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onResize(chart.id, size)}
                className={`${text.label} px-1.5 py-0.5 rounded transition-colors ${currentSize === size
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                title={`Resize to ${size}`}
              >
                {getSizeLabel(size)}
              </button>
            ))}
          </div>

          {/* Download */}
          {onDownload && (
            <button
              type="button"
              onClick={() => onDownload(chart)}
              className={`${btnPadding} hover:bg-gray-700 rounded-lg transition-colors`}
              title="Download spreadsheet"
            >
              <Download
                className={`${iconSize} text-gray-400 hover:text-white`}
              />
            </button>
          )}

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`${btnPadding} hover:bg-gray-700 rounded-lg transition-colors`}
            title="Refresh data"
          >
            <RefreshCw
              className={`${iconSize} text-gray-400 hover:text-white ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>

          {/* Expand */}
          <button
            type="button"
            onClick={() => onExpand(chart.id)}
            className={`${btnPadding} hover:bg-gray-700 rounded-lg transition-colors`}
            title="View in Ask Vizier"
          >
            <ExternalLink
              className={`${iconSize} text-gray-400 hover:text-white`}
            />
          </button>

          {/* Unpin */}
          <button
            type="button"
            onClick={() => onUnpin(chart.id)}
            className={`${btnPadding} hover:bg-red-500/10 rounded-lg transition-colors`}
            title="Remove from dashboard"
          >
            <X className={`${iconSize} text-gray-400 hover:text-red-400`} />
          </button>
        </div>
      </div>

      {/* Annotation Form */}
      {isAddingAnnotation && (
        <div
          className={`${padding.annotation} bg-gray-900/50 border-b border-gray-700`}
        >
          <textarea
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
            placeholder="Add your note..."
            className={`w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white ${text.body} resize-none focus:outline-none focus:border-amber-500`}
            rows={2}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <label
                className={`flex items-center gap-1.5 ${text.label} text-gray-400 cursor-pointer`}
              >
                <input
                  type="radio"
                  name={`visibility-${chart.id}`}
                  checked={annotationPublic}
                  onChange={() => setAnnotationPublic(true)}
                  className="accent-amber-500 w-3 h-3"
                />
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </label>
              <label
                className={`flex items-center gap-1.5 ${text.label} text-gray-400 cursor-pointer`}
              >
                <input
                  type="radio"
                  name={`visibility-${chart.id}`}
                  checked={!annotationPublic}
                  onChange={() => setAnnotationPublic(false)}
                  className="accent-amber-500 w-3 h-3"
                />
                <Lock className="w-3 h-3" />
                <span>Private</span>
              </label>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setIsAddingAnnotation(false)}
                className={`px-2 py-1 ${text.label} text-gray-400 hover:text-white transition-colors`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAnnotation}
                disabled={!annotationText.trim() || isSavingAnnotation}
                className={`px-2 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 text-black ${text.label} font-medium rounded transition-colors`}
              >
                {isSavingAnnotation ? 'Saving...' : 'Add'}
              </button>
            </div>
          </div>
          {annotationsError && (
            <p className="mt-2 text-xs text-red-400">{annotationsError}</p>
          )}
        </div>
      )}

      {/* Annotations Display */}
      {visibleAnnotations.length > 0 && (
        <div
          className={`${padding.annotation} bg-gray-900/30 border-b border-gray-700 space-y-1.5 max-h-28 overflow-y-auto`}
        >
          {visibleAnnotations.map((annotation) => (
            <div key={annotation.id} className="group">
              {editingAnnotationId === annotation.id ? (
                // EDIT MODE
                <div className="flex items-start gap-1.5">
                  <div className="flex-shrink-0 mt-2">
                    {annotation.isPublic ? (
                      <Globe className="w-2.5 h-2.5 text-gray-500" />
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit();
                        }
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleSaveEdit();
                        }
                      }}
                      className={`w-full px-2 py-1.5 bg-gray-800 border border-gray-600 rounded-lg text-white ${text.label} resize-none focus:outline-none focus:border-white`}
                      rows={2}
                    />
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={!editText.trim()}
                        className={`px-2.5 py-1 bg-white hover:bg-gray-100 disabled:bg-gray-600 disabled:text-gray-400 text-black ${text.label} font-medium rounded-lg transition-colors`}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className={`px-2 py-1 ${text.label} text-gray-400 hover:text-white transition-colors`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // DISPLAY MODE
                <div className="flex items-start gap-1.5">
                  <div className="flex-shrink-0 mt-0.5">
                    {annotation.isPublic ? (
                      <Globe className="w-2.5 h-2.5 text-gray-500" />
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${text.label} text-gray-300 leading-tight`}>
                      <span className="font-semibold text-white">
                        {annotation.userName}:
                      </span>{' '}
                      {annotation.text}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`${text.label} text-gray-500`}>
                        {new Date(annotation.timestamp).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </span>
                      {annotation.edited && (
                        <span className={`${text.label} text-gray-500 italic`}>
                          (edited)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Edit/Delete buttons - only for current user's annotations */}
                  {annotation.userId === currentUser.id && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      {isDemoMode && (
                        <button
                          type="button"
                          onClick={() => handleEditAnnotation(annotation)}
                          className="p-1 hover:bg-gray-700 rounded transition-colors"
                          title="Edit note"
                        >
                          <Edit2 className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                        className="p-1 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                        title="Delete note"
                        disabled={
                          isDeletingAnnotationId === annotation.id ||
                          isSavingAnnotation
                        }
                      >
                        <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-400" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Chart - Clickable for drill-down */}
      <button
        type="button"
        onClick={() => onDrillDown?.(chart)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onDrillDown?.(chart);
          }
        }}
        className={`flex-1 ${padding.chart} min-h-0 bg-white cursor-pointer hover:bg-gray-50 transition-colors`}
        title="Click for detailed drill-down report"
      >
        <div style={{ height: chartHeight }}>
          {chart.chart_data && chart.chart_type ? (
            <ChartRenderer
              type={chart.chart_type}
              data={chart.chart_data}
              height={chartHeight}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">
                No visualization available
              </p>
            </div>
          )}
        </div>
      </button>

      {/* Explanations - Three Sections */}
      <div
        className={`${padding.explanation} border-t border-gray-700 bg-gray-900/50 space-y-2 flex-shrink-0`}
      >
        {/* Key Insight */}
        <div>
          <h4
            className={`${text.label} font-semibold text-gray-400 uppercase tracking-wide mb-0.5`}
          >
            Key Insight
          </h4>
          <p
            className={`${text.body} text-gray-300 leading-relaxed line-clamp-2`}
          >
            {generateKeyInsight(chart)}
          </p>
        </div>

        {/* What This Means */}
        <div>
          <h4
            className={`${text.label} font-semibold text-green-400 uppercase tracking-wide mb-0.5`}
          >
            What This Means
          </h4>
          <p
            className={`${text.body} text-gray-300 leading-relaxed line-clamp-2`}
          >
            {generateMeaning(chart)}
          </p>
        </div>

        {/* Recommended Actions */}
        <div>
          <h4
            className={`${text.label} font-semibold text-blue-400 uppercase tracking-wide mb-0.5`}
          >
            Recommended Actions
          </h4>
          <p
            className={`${text.body} text-gray-300 leading-relaxed line-clamp-2`}
          >
            {generateRecommendations(chart)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
