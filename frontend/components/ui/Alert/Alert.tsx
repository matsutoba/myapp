import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantMap = {
  info: 'bg-blue-100 border-blue-400 text-blue-700',
  success: 'bg-green-100 border-green-400 text-green-700',
  warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  error: 'bg-red-100 border-red-400 text-red-700',
};

export function Alert({
  children,
  variant = 'info',
  className = '',
}: AlertProps) {
  const variantClass = variantMap[variant];

  return (
    <div className={`p-3 border rounded ${variantClass} ${className}`}>
      {children}
    </div>
  );
}
