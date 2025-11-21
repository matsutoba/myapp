import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'admin'
  | 'user';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  border?: boolean;
}

export function Badge({
  children,
  variant = 'default',
  className = '',
  border = false,
}: BadgeProps) {
  const baseStyles = 'px-2 py-1 rounded text-xs font-medium inline-block';
  const variantColors: Record<BadgeVariant, string> = {
    default: 'bg-badge-muted text-foreground',
    primary: 'bg-badge-primary text-primary',
    success: 'bg-badge-success text-success',
    warning: 'bg-badge-warning text-warning',
    danger: 'bg-badge-danger text-danger',
    admin: 'bg-secondary text-on-secondary',
    user: 'bg-badge-muted text-foreground',
  };

  const variantBorders: Record<BadgeVariant, string> = {
    default: 'border border-surface',
    primary: 'border border-primary/20',
    success: 'border border-success/20',
    warning: 'border border-warning/20',
    danger: 'border border-danger/20',
    admin: 'border border-surface',
    user: 'border border-surface',
  };

  const borderClass = border ? variantBorders[variant] : '';

  return (
    <span
      className={`${baseStyles} ${variantColors[variant]} ${borderClass} ${className}`}
    >
      {children}
    </span>
  );
}
