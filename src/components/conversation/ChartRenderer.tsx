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
import { formatNumber } from '../../utils/formatters';

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
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        {payload.map((entry: TooltipPayloadItem, index: number) => (
          <p key={index} className="text-sm text-neutral-600">
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

  const renderChart = () => {
    switch (type) {
      case 'bar_chart':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={labelKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={60}
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
              margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis
                type="category"
                dataKey={labelKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={90}
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
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey={labelKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={60}
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
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={GOLD_COLORS[index % GOLD_COLORS.length]}
                  />
                ))}
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
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-5xl font-bold text-amber-500">
              {typeof bigNumValue === 'number'
                ? formatNumber(bigNumValue)
                : String(bigNumValue)}
            </p>
            {bigNumLabel !== undefined && bigNumLabel !== null && (
              <p className="text-lg text-neutral-600 mt-2">
                {String(bigNumLabel)}
              </p>
            )}
          </div>
        );
      }

      case 'table': {
        const columns = Object.keys(data[0] || {});
        return (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left font-medium text-neutral-700 bg-neutral-50"
                    >
                      {col
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 20).map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    {columns.map((col) => (
                      <td key={col} className="px-4 py-3 text-neutral-900">
                        {typeof row[col] === 'number'
                          ? formatNumber(row[col] as number)
                          : String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 20 && (
              <p className="text-sm text-neutral-500 text-center py-3">
                Showing 20 of {data.length} rows
              </p>
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
