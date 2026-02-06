import type React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartType } from '../../types';
import { coerceToString, formatNumber } from '../../utils/formatters';

interface ChartRendererProps {
  type: ChartType;
  data: Record<string, unknown>[];
  title?: string;
  height?: number;
}

// Gold-based color palette for brand consistency
const GOLD_COLORS = [
  '#F59E0B', // Primary gold
  '#FB923C', // Orange
  '#FBBF24', // Amber
  '#FDE047', // Yellow
  '#A855F7', // Purple (accent)
  '#3B82F6', // Blue (accent)
  '#10B981', // Green (accent)
  '#EF4444', // Red (accent)
];

// Get the key for the value (numeric) column
function getValueKey(data: Record<string, unknown>[]): string {
  if (data.length === 0) return 'value';
  const firstItem = data[0];
  for (const key of Object.keys(firstItem)) {
    if (typeof firstItem[key] === 'number') {
      return key;
    }
  }
  return Object.keys(firstItem)[1] || 'value';
}

// Get the key for the label column
function getLabelKey(data: Record<string, unknown>[]): string {
  if (data.length === 0) return 'name';
  const firstItem = data[0];
  for (const key of Object.keys(firstItem)) {
    if (typeof firstItem[key] === 'string') {
      return key;
    }
  }
  return Object.keys(firstItem)[0] || 'name';
}

const getLabelMeta = (data: Record<string, unknown>[], labelKey: string) => {
  const labels = data
    .map((row) => coerceToString(row[labelKey]))
    .filter(Boolean);
  const maxLength = labels.reduce(
    (max, label) => Math.max(max, label.length),
    0,
  );
  return { count: data.length, maxLength };
};

const getXAxisLayout = (data: Record<string, unknown>[], labelKey: string) => {
  const { count, maxLength } = getLabelMeta(data, labelKey);
  const shouldRotate = count > 8 || maxLength > 10;
  const angle = shouldRotate ? -35 : 0;
  const height = shouldRotate ? 55 : 30;
  const interval = count > 12 ? Math.ceil(count / 8) - 1 : 0;
  return { angle, height, interval };
};

const formatAxisLabel = (value: unknown) => {
  const text = coerceToString(value);
  if (text.length <= 14) return text;
  return `${text.slice(0, 12)}…`;
};

interface TooltipPayloadItem {
  name: string;
  value: number;
  color?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        {payload.map((entry: TooltipPayloadItem) => (
          <p key={entry.name} className="text-sm text-neutral-600">
            {entry.name}:{' '}
            <span className="font-medium">{formatNumber(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  name: string;
}

// Custom label for pie charts - simpler, no cutoff
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}: PieLabelProps) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show labels for segments > 5%
  if (percent < 0.05) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  type,
  data,
  title,
  height = 300,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-neutral-50 rounded-lg">
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  const valueKey = getValueKey(data);
  const labelKey = getLabelKey(data);
  const xAxisLayout = getXAxisLayout(data, labelKey);
  const yAxisLabelWidth = Math.min(
    Math.max(getLabelMeta(data, labelKey).maxLength * 7, 90),
    180,
  );

  const renderChart = () => {
    switch (type) {
      case 'bar_chart':
      case 'histogram':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: xAxisLayout.height,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={labelKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={xAxisLayout.angle}
                textAnchor={xAxisLayout.angle ? 'end' : 'middle'}
                height={xAxisLayout.height}
                interval={xAxisLayout.interval}
                tickFormatter={formatAxisLabel}
                minTickGap={12}
              />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={valueKey} fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'horizontal_bar_chart':
        return (
          <ResponsiveContainer
            width="100%"
            height={Math.max(height, data.length * 40)}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 20,
                right: 30,
                left: yAxisLabelWidth + 10,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                type="category"
                dataKey={labelKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={yAxisLabelWidth}
                tickFormatter={formatAxisLabel}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={valueKey} fill="#F59E0B" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: xAxisLayout.height,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={labelKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={xAxisLayout.angle}
                textAnchor={xAxisLayout.angle ? 'end' : 'middle'}
                height={xAxisLayout.height}
                interval={xAxisLayout.interval}
                tickFormatter={formatAxisLabel}
                minTickGap={12}
              />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={valueKey}
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#F59E0B' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie_chart':
      case 'donut_chart': {
        // Calculate proper dimensions to prevent cutoff
        const pieHeight = Math.max(height, 350);
        const outerRadius = Math.min(pieHeight * 0.28, 120);
        const innerRadius = type === 'donut_chart' ? outerRadius * 0.5 : 0;

        return (
          <ResponsiveContainer width="100%" height={pieHeight}>
            <PieChart margin={{ top: 20, right: 80, left: 80, bottom: 20 }}>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                paddingAngle={2}
                dataKey={valueKey}
                nameKey={labelKey}
                label={renderCustomizedLabel}
                labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
              >
                {data.map((entry, index) => {
                  const cellKey =
                    typeof entry[labelKey] === 'string'
                      ? entry[labelKey]
                      : `cell-${index}-${entry[valueKey]}`;
                  return (
                    <Cell
                      key={cellKey}
                      fill={GOLD_COLORS[index % GOLD_COLORS.length]}
                    />
                  );
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      }

      case 'big_number': {
        const bigNumValue = data[0]?.[valueKey];
        const bigNumLabel = data[0]?.[labelKey];
        const bigNumLabelText = coerceToString(bigNumLabel);
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-5xl font-bold text-amber-500">
              {typeof bigNumValue === 'number'
                ? formatNumber(bigNumValue)
                : coerceToString(bigNumValue)}
            </p>
            {bigNumLabel !== undefined && bigNumLabel !== null && (
              <p className="text-lg text-neutral-600 mt-2">{bigNumLabelText}</p>
            )}
          </div>
        );
      }

      case 'table': {
        const columns = Object.keys(data[0] || {});
        const formatColumnLabel = (column: string) => {
          const sanitized = column.replaceAll('_', ' ');
          return sanitized
            .split(' ')
            .map((word) =>
              word ? `${word[0].toUpperCase()}${word.slice(1)}` : '',
            )
            .filter(Boolean)
            .join(' ');
        };

        const formatCellValue = (value: unknown) =>
          typeof value === 'number'
            ? formatNumber(value)
            : coerceToString(value);

        const deriveRowKey = (row: Record<string, unknown>) => {
          const labelValue = coerceToString(row[labelKey]);
          const numericValue = coerceToString(row[valueKey]);
          if (labelValue || numericValue) {
            return `${labelValue || 'label'}-${numericValue || 'value'}`;
          }

          const fallback =
            columns.length > 0
              ? columns
                  .map((col) => `${col}:${coerceToString(row[col])}`)
                  .join('|')
              : coerceToString(row);
          return fallback || 'row';
        };

        return (
          <div 
            className="overflow-auto border border-neutral-200 rounded-lg custom-scrollbar"
            style={{ height }}
          >
            <table className="w-full text-sm relative border-collapse">
              <thead className="sticky top-0 z-10 bg-neutral-50 shadow-sm">
                <tr className="border-b border-neutral-200">
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium text-neutral-700 whitespace-nowrap bg-neutral-50"
                    >
                      {formatColumnLabel(col) || col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {data.map((row) => {
                  const rowKey = deriveRowKey(row);
                  return (
                    <tr
                      key={rowKey}
                      className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors"
                    >
                      {columns.map((col) => {
                        const value = row[col];
                        const displayValue = formatCellValue(value);
                        return (
                          <td key={col} className="px-4 py-3 text-neutral-900 whitespace-nowrap">
                            {displayValue}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {data.length === 0 && (
               <div className="flex items-center justify-center h-full text-neutral-500">
                 No data available
               </div>
            )}
          </div>
        );
      }

      default:
        // Default to table for unsupported types
        return (
          <div className="text-center py-8 text-neutral-500">
            Chart type "{type}" is not yet supported
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {title && (
        <h4 className="text-sm font-medium text-neutral-700 mb-4">{title}</h4>
      )}
      {renderChart()}
    </div>
  );
};

export default ChartRenderer;
