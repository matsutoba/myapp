// Icon design tokens
// サイズ・ストローク・カラー（バリアント）を集中管理

export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSizeKey = keyof typeof ICON_SIZES;

export const ICON_STROKES = {
  light: 1,
  normal: 2,
  bold: 3,
} as const;
export type IconStrokeKey = keyof typeof ICON_STROKES;

// Tailwindクラス前提の色バリアント（直接色指定したい場合は従来 color を使用）
export const ICON_COLOR_VARIANTS = {
  default: 'text-foreground',
  muted: 'text-muted',
  info: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
} as const;
export type IconColorVariant = keyof typeof ICON_COLOR_VARIANTS;
