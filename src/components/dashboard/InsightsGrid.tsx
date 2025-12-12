// src/components/dashboard/InsightsGrid.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GridLayout as RGLGridLayout } from 'react-grid-layout';
import { GridInsightCard } from './GridInsightCard';
import { RotateCcw } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Cast GridLayout to any to avoid TypeScript type mismatches with the library
const GridLayout = RGLGridLayout as any;

// Define our own Layout interface to avoid type conflicts
interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

interface InsightsGridProps {
  insights: any[];
  onDeleteInsight: (id: string) => void;
  onExpandInsight: (id: string) => void;
}

export const InsightsGrid: React.FC<InsightsGridProps> = ({
  insights,
  onDeleteInsight,
  onExpandInsight,
}) => {
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);
  const [containerWidth, setContainerWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  const cols = 12;
  const rowHeight = 100;

  // Measure container width for responsive grid
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Generate default layout
  const generateDefaultLayout = (): LayoutItem[] => {
    return insights.map((insight, index) => ({
      i: insight.id,
      x: (index % 3) * 4,
      y: Math.floor(index / 3) * 4,
      w: 4,
      h: 4,
      minW: 3,
      minH: 3,
      maxW: 12,
      maxH: 6,
    }));
  };

  // Load saved layout from localStorage
  useEffect(() => {
    const savedLayout = localStorage.getItem('dashboard_layout');
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout) as LayoutItem[];
        // Filter out layouts for insights that no longer exist
        const validLayouts = parsed.filter((layout) =>
          insights.some((insight) => insight.id === layout.i)
        );
        // Add layouts for new insights
        const existingIds = new Set(validLayouts.map((l) => l.i));
        const newInsights = insights.filter((i) => !existingIds.has(i.id));
        if (newInsights.length > 0) {
          const newLayouts = newInsights.map((insight, idx) => ({
            i: insight.id,
            x: (idx % 3) * 4,
            y: Math.max(...validLayouts.map((l) => l.y + l.h), 0) + Math.floor(idx / 3) * 4,
            w: 4,
            h: 4,
            minW: 3,
            minH: 3,
            maxW: 12,
            maxH: 6,
          }));
          setLayouts([...validLayouts, ...newLayouts]);
        } else {
          setLayouts(validLayouts.length > 0 ? validLayouts : generateDefaultLayout());
        }
      } catch (e) {
        console.error('Failed to parse saved layout:', e);
        setLayouts(generateDefaultLayout());
      }
    } else {
      setLayouts(generateDefaultLayout());
    }
  }, [insights]);

  // Save layout when it changes
  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayouts(newLayout);
    localStorage.setItem('dashboard_layout', JSON.stringify(newLayout));
  };

  // Reset to default layout
  const handleResetLayout = () => {
    const defaultLayout = generateDefaultLayout();
    setLayouts(defaultLayout);
    localStorage.removeItem('dashboard_layout');
  };

  if (insights.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">No saved insights yet</p>
        <p className="text-gray-500 text-sm">
          Ask Vizier a question and save insights to see them here
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          <p>Drag to reorder • Drag corners to resize</p>
        </div>
        <button
          onClick={handleResetLayout}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Layout
        </button>
      </div>

      {/* Grid */}
      <GridLayout
        className="layout"
        layout={layouts}
        cols={cols}
        rowHeight={rowHeight}
        width={containerWidth}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        isDraggable={true}
        isResizable={true}
        margin={[16, 16]}
      >
        {insights.map((insight) => (
          <div key={insight.id} className="h-full">
            <GridInsightCard
              insight={insight}
              onDelete={onDeleteInsight}
              onExpand={onExpandInsight}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default InsightsGrid;
