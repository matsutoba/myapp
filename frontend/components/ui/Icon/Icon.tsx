import * as Icons from 'lucide-react';
import React from 'react';
import {
  ICON_COLOR_VARIANTS,
  ICON_SIZES,
  ICON_STROKES,
  type IconColorVariant,
  type IconSizeKey,
  type IconStrokeKey,
} from './tokens';

export type IconName = keyof typeof Icons;

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'ref'> {
  /** lucide-reactのアイコン名 */
  name: IconName;
  /** アイコンのサイズ（px or size key)。デフォルト: lg(24) */
  size?: number | IconSizeKey;
  /** 色 (直接指定) */
  color?: string;
  /** 色バリアント (Tailwindクラス) */
  colorVariant?: IconColorVariant;
  /** 線の太さ（数値 or stroke key）。デフォルト: normal(2) */
  strokeWidth?: number | IconStrokeKey;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * lucide-reactをラップした汎用アイコンコンポーネント
 *
 * @example
 * ```tsx
 * <Icon name="User" size={24} color="blue" />
 * <Icon name="Check" size={16} strokeWidth={3} />
 * <Icon name="AlertCircle" className="text-red-500" />
 * ```
 */
export function Icon({
  name,
  size = 'lg',
  color,
  colorVariant,
  strokeWidth = 'normal',
  className = '',
  ...props
}: IconProps) {
  const IconComponent = Icons[name] as React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
  }>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const resolvedSize = typeof size === 'number' ? size : ICON_SIZES[size];
  const resolvedStroke =
    typeof strokeWidth === 'number' ? strokeWidth : ICON_STROKES[strokeWidth];
  const variantClass = colorVariant
    ? ICON_COLOR_VARIANTS[colorVariant]
    : undefined;

  const mergedClassName = [variantClass, className].filter(Boolean).join(' ');

  return (
    <IconComponent
      size={resolvedSize}
      color={color}
      strokeWidth={resolvedStroke}
      className={mergedClassName}
      {...props}
    />
  );
}
