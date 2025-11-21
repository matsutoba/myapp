import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const paddingMap = {
  none: '',
  sm: 'p-sm',
  md: 'p-md',
  lg: 'p-lg',
};

export function Card({ children, padding = 'md', className = '' }: CardProps) {
  const paddingClass = paddingMap[padding];

  return (
    <div
      className={`bg-card text-on-surface shadow-md rounded-lg ${paddingClass} ${className}`}
    >
      {children}
    </div>
  );
}
