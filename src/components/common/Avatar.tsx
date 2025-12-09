import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    'bg-primary-500',
    'bg-success-500',
    'bg-warning-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = React.useState(false);

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt || name || 'Avatar'}
        className={`
          ${sizeStyles[size]}
          rounded-full object-cover
          ${className}
        `}
        onError={() => setImageError(true)}
      />
    );
  }

  if (name) {
    return (
      <div
        className={`
          ${sizeStyles[size]}
          ${getColorFromName(name)}
          rounded-full flex items-center justify-center text-white font-medium
          ${className}
        `}
        role="img"
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500
        ${className}
      `}
      role="img"
      aria-label="User avatar"
    >
      <User className={iconSizes[size]} />
    </div>
  );
};

export default Avatar;
