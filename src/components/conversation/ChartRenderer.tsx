import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartType } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface ChartRendererProps {
  type: ChartType;
  data: Record<string, unknown>[];
  title?: string;
}

// Healthcare-appropriate color palette
const COLORS = [
  '#2563eb', // Primary blue
  '#10b981', // Success green
  '#f59e0b', // Warning amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#84cc16', // Lime
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 shadow-lg rounded-lg border border-neutral-200">
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm text-neutral-600">
            {entry.name}: <span className="font-medium">{formatNumber(entry.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({
  type,
  data,
  title,
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
              <Bar dataKey={valueKey} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'horizontal_bar_chart':
        return (
          <ResponsiveContainer width="100%" height={Math.max(300, data.length * 40)}>
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
              <Bar dataKey={valueKey} fill={COLORS[0]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={{ fill: COLORS[0], strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie_chart':
      case 'donut_chart':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={type === 'donut_chart' ? 60 : 0}
                outerRadius={100}
                paddingAngle={2}
                dataKey={valueKey}
                nameKey={labelKey}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={{ stroke: '#6b7280' }}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'big_number': {
        const bigNumValue = data[0]?.[valueKey];
        const bigNumLabel = data[0]?.[labelKey];
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-5xl font-bold text-primary-600">
              {typeof bigNumValue === 'number' ? formatNumber(bigNumValue) : String(bigNumValue)}
            </p>
            {bigNumLabel !== undefined && bigNumLabel !== null && (
              <p className="text-lg text-neutral-600 mt-2">{String(bigNumLabel)}</p>
            )}
          </div>
        );
      }

      case 'table':
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
                      {col.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
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
