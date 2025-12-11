// src/components/dashboard/InsightsGrid.tsx
import React, { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import { GridInsightCard } from './GridInsightCard';
import { RotateCcw } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Define layout item interface
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

interface SavedInsight {
  id: string;
  question: string;
  answer: string;
  chartType: string;
  chartData: any;
  explanation: string;
  timestamp: Date;
}

interface InsightsGridProps {
  insights: SavedInsight[];
  onDeleteInsight: (id: string) => void;
  onExpandInsight: (id: string) => void;
}

export const InsightsGrid: React.FC<InsightsGridProps> = ({
  insights,
  onDeleteInsight,
  onExpandInsight,
}) => {
  const [layouts, setLayouts] = useState<LayoutItem[]>([]);
  const [width, setWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const cols = 12;
  const rowHeight = 100;

  // Measure container width
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Generate default layout for insights
  const generateDefaultLayout = (insightsList: SavedInsight[]): LayoutItem[] => {
    return insightsList.map((insight, index) => ({
      i: insight.id,
      x: (index % 3) * 4, // 3 columns
      y: Math.floor(index / 3) * 3, // 3 rows tall
      w: 4, // Width: 4 grid units (1/3 of 12)
      h: 3, // Height: 3 row units
      minW: 3,
      minH: 2,
      maxW: 12,
      maxH: 6,
    }));
  };

  // Load saved layout from localStorage or generate default
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
        const newLayouts = generateDefaultLayout(newInsights).map((layout, idx) => ({
          ...layout,
          y: Math.max(...validLayouts.map((l) => l.y + l.h), 0) + Math.floor(idx / 3) * 3,
          x: (idx % 3) * 4,
        }));
        setLayouts([...validLayouts, ...newLayouts]);
      } catch {
        setLayouts(generateDefaultLayout(insights));
      }
    } else {
      setLayouts(generateDefaultLayout(insights));
    }
  }, [insights]);

  // Save layout when it changes
  const handleLayoutChange = (newLayout: LayoutItem[]) => {
    setLayouts(newLayout);
    localStorage.setItem('dashboard_layout', JSON.stringify(newLayout));
  };

  // Reset to default layout
  const handleResetLayout = () => {
    const defaultLayout = generateDefaultLayout(insights);
    setLayouts(defaultLayout);
    localStorage.setItem('dashboard_layout', JSON.stringify(defaultLayout));
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
    <div ref={containerRef}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">
          <p>Drag to reorder &bull; Drag corners to resize</p>
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
        layout={layouts as any}
        cols={cols}
        rowHeight={rowHeight}
        width={width}
        onLayoutChange={handleLayoutChange as any}
        draggableHandle=".drag-handle"
        compactType="vertical"
        preventCollision={false}
        margin={[16, 16]}
      >
        {insights.map((insight) => (
          <div key={insight.id}>
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
