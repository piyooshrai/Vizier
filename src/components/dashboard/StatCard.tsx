import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../common';
import { formatNumber } from '../../utils/formatters';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend = 'neutral',
}) => {
  const displayValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-neutral-900"
          >
            {displayValue}
          </motion.p>

          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              {trend === 'up' && (
                <TrendingUp className="w-4 h-4 text-success-500" />
              )}
              {trend === 'down' && (
                <TrendingDown className="w-4 h-4 text-error-500" />
              )}
              <span
                className={`
                  text-sm font-medium
                  ${trend === 'up' ? 'text-success-600' : ''}
                  ${trend === 'down' ? 'text-error-600' : ''}
                  ${trend === 'neutral' ? 'text-neutral-500' : ''}
                `}
              >
                {change > 0 ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-sm text-neutral-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
