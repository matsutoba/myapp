import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantMap: Record<string, string> = {
  info: 'bg-primary text-on-primary border-surface',
  success: 'bg-success text-on-success border-surface',
  warning: 'bg-warning text-on-warning border-surface',
  error: 'bg-danger text-on-danger border-surface',
};

export function Alert({
  children,
  variant = 'info',
  className = '',
}: AlertProps) {
  const variantClass = variantMap[variant];

  return (
    <div className={`p-md border rounded ${variantClass} ${className}`}>
      {children}
    </div>
  );
}
