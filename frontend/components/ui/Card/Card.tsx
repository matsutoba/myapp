import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({ children, padding = 'md', className = '' }: CardProps) {
  const paddingClass = paddingMap[padding];

  return (
    <div className={`bg-white shadow rounded-lg ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}
