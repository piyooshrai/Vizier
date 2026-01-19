import type { ChartType } from '../types';

// Chart color palette
export const CHART_COLOR_PALETTE = [
  '#2563EB', // primary blue
  '#7C3AED', // secondary purple
  '#059669', // success green
  '#D97706', // warning amber
  '#DC2626', // error red
  '#0891B2', // cyan
  '#DB2777', // pink
  '#4F46E5', // indigo
  '#65A30D', // lime
  '#EA580C', // orange
];

export const getChartColor = (index: number): string => {
  return CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length];
};

export const getChartColors = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => getChartColor(i));
};

// Chart type display names
export const CHART_TYPE_LABELS: Record<ChartType, string> = {
  bar_chart: 'Bar Chart',
  line_chart: 'Line Chart',
  pie_chart: 'Pie Chart',
  donut_chart: 'Donut Chart',
  gauge_chart: 'Gauge Chart',
  big_number: 'Big Number',
  table: 'Table',
  horizontal_bar_chart: 'Horizontal Bar Chart',
  histogram: 'Histogram',
  box_plot: 'Box Plot',
};

// Chart type icons (using emoji as placeholders, could use Lucide icons)
export const CHART_TYPE_ICONS: Record<ChartType, string> = {
  bar_chart: 'bar-chart-2',
  line_chart: 'trending-up',
  pie_chart: 'pie-chart',
  donut_chart: 'circle',
  gauge_chart: 'gauge',
  big_number: 'hash',
  table: 'table',
  horizontal_bar_chart: 'bar-chart',
  histogram: 'activity',
  box_plot: 'box',
};

// Determine best chart type based on data structure
export function suggestChartType(data: Record<string, unknown>[]): ChartType {
  if (!data || data.length === 0) {
    return 'table';
  }

  const keys = Object.keys(data[0]);
  const numericKeys = keys.filter((key) =>
    data.every(
      (row) => typeof row[key] === 'number' || !Number.isNaN(Number(row[key])),
    ),
  );
  const dateKeys = keys.filter((key) =>
    data.every((row) => {
      const val = row[key];
      return typeof val === 'string' && !Number.isNaN(Date.parse(val));
    }),
  );

  // Single row with one numeric value = big number
  if (data.length === 1 && numericKeys.length === 1) {
    return 'big_number';
  }

  // Has date field = likely time series = line chart
  if (dateKeys.length > 0 && numericKeys.length > 0) {
    return 'line_chart';
  }

  // Small number of categories (< 8) with one numeric = pie/donut
  if (data.length <= 7 && numericKeys.length === 1) {
    return 'pie_chart';
  }

  // Multiple categories with numeric values = bar chart
  if (numericKeys.length >= 1) {
    return 'bar_chart';
  }

  // Default to table
  return 'table';
}

// Format data for Recharts based on chart type
export function formatChartData(
  data: Record<string, unknown>[],
  chartType: ChartType,
): Record<string, unknown>[] {
  if (!data || data.length === 0) return [];

  // Most chart types can use the data as-is
  switch (chartType) {
    case 'pie_chart':
    case 'donut_chart':
      // Ensure we have name and value fields
      return data.map((item, index) => {
        const keys = Object.keys(item);
        const numericKey = keys.find(
          (k) => typeof item[k] === 'number' || !Number.isNaN(Number(item[k])),
        );
        const labelKey = keys.find((k) => k !== numericKey);

        return {
          name: item[labelKey || keys[0]] || `Item ${index + 1}`,
          value: Number(item[numericKey || keys[0]]) || 0,
          fill: getChartColor(index),
        };
      });

    case 'big_number': {
      // Return just the first numeric value
      const firstItem = data[0];
      const numKey = Object.keys(firstItem).find(
        (k) =>
          typeof firstItem[k] === 'number' ||
          !Number.isNaN(Number(firstItem[k])),
      );
      return [{ value: numKey ? Number(firstItem[numKey]) : 0 }];
    }

    default:
      return data;
  }
}

// Get axis configuration based on data
export function getAxisConfig(
  data: Record<string, unknown>[],
): { xKey: string; yKey: string } | null {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const numericKey = keys.find((k) =>
    data.every(
      (row) => typeof row[k] === 'number' || !Number.isNaN(Number(row[k])),
    ),
  );
  const labelKey = keys.find((k) => k !== numericKey);

  return {
    xKey: labelKey || keys[0],
    yKey: numericKey || keys[1] || keys[0],
  };
}

// Format large numbers for display
export function formatLargeNumber(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

// Format percentage
export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Calculate percentage change
export function calculatePercentageChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Get trend direction
export function getTrendDirection(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0.5) return 'up';
  if (change < -0.5) return 'down';
  return 'neutral';
}

// Generate chart tooltip formatter
export function createTooltipFormatter(
  _valueKey: string,
  format: 'number' | 'currency' | 'percentage' = 'number',
): (value: number) => string {
  return (value: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'percentage':
        return formatPercentage(value / 100);
      default:
        return new Intl.NumberFormat('en-US').format(value);
    }
  };
}

// Export chart as image (canvas-based)
export async function exportChartAsImage(
  _chartRef: HTMLElement,
  filename: string = 'chart',
): Promise<void> {
  try {
    // This would typically use html2canvas or a similar library
    // For now, we'll just log that the feature was requested
    console.log(`Export chart as image: ${filename}`);

    // In a real implementation:
    // const canvas = await html2canvas(chartRef);
    // const link = document.createElement('a');
    // link.download = `${filename}.png`;
    // link.href = canvas.toDataURL('image/png');
    // link.click();
  } catch (error) {
    console.error('Failed to export chart:', error);
    throw error;
  }
}

// Export chart data as CSV
export function exportDataAsCSV(
  data: Record<string, unknown>[],
  filename: string = 'data',
): void {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : String(value ?? '');
        })
        .join(','),
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
