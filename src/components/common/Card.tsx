import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const variantStyles = {
  default: 'bg-white border border-neutral-200',
  glass: 'bg-white/80 backdrop-blur-sm border border-neutral-200/50',
  elevated: 'bg-white shadow-card',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
}) => {
  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover || onClick
    ? {
        whileHover: { scale: 1.01, y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      className={`
        rounded-xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-card-hover transition-shadow cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;
