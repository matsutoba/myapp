import * as Icons from 'lucide-react';
import React from 'react';

export type IconButtonVariant = 'default' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconName = keyof typeof Icons;

interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  iconSize?: number;
  active?: boolean;
}

export function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  iconSize,
  active = false,
  className = '',
  disabled,
  ...props
}: IconButtonProps) {
  const baseStyles =
    'rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 inline-flex items-center justify-center';

  const variantStyles: Record<IconButtonVariant, string> = {
    default: active
      ? 'bg-primary text-on-primary hover-bg-primary'
      : 'bg-transparent text-muted hover-bg-surface',
    primary: 'bg-primary text-on-primary hover-bg-primary focus-ring-primary',
    danger: 'bg-danger text-on-danger hover-bg-danger',
  };

  const sizeStyles: Record<IconButtonSize, string> = {
    sm: 'p-sm',
    md: 'p-md',
    lg: 'p-lg',
  };

  const defaultIconSizes: Record<IconButtonSize, number> = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed hover:bg-transparent'
    : '';

  const IconComponent = Icons[icon] as Icons.LucideIcon;

  if (!IconComponent) {
    console.warn(`Icon "${icon}" not found in lucide-react`);
    return null;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      <IconComponent size={iconSize || defaultIconSizes[size]} />
    </button>
  );
}
