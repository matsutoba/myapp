import React from 'react';

export interface NotificationProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

// 旧Alert互換のための内部マップ
const variantMap: Record<string, string> = {
  info: 'bg-primary text-on-primary border-surface',
  success: 'bg-success text-on-success border-surface',
  warning: 'bg-warning text-on-warning border-surface',
  error: 'bg-danger text-on-danger border-surface',
};

/**
 * Notification: 状態メッセージ表示用コンポーネント (旧: Alert)
 * - 情報 / 成功 / 警告 / エラー を色分け表示
 * - 子要素にはテキストや任意の要素を配置可能
 *
 * 旧 `Alert` からの移行:
 * <Alert variant="error">内容</Alert>
 * → <Notification variant="error">内容</Notification>
 */
export function Notification({
  children,
  variant = 'info',
  className = '',
}: NotificationProps) {
  const variantClass = variantMap[variant];

  return (
    <div className={`p-md border rounded ${variantClass} ${className}`}>
      {children}
    </div>
  );
}

// 一時的な移行エイリアス (必要なら使用可能)
// export const Alert = Notification;
