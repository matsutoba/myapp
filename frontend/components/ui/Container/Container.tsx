import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

const paddingMap = {
  none: '',
  sm: 'p-sm',
  md: 'p-md',
  lg: 'p-lg',
};

export function Container({
  children,
  size = 'full',
  padding = 'md',
  className = '',
}: ContainerProps) {
  const sizeClass = sizeMap[size];
  const paddingClass = paddingMap[padding];

  return (
    <div className={`${sizeClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}
