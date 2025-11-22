import React from 'react';

export interface SpinnerProps {
  open: boolean;
  /** 短いメッセージを表示する（省略可） */
  message?: string;
  /** オーバーレイがユーザー操作をブロックするか（デフォルト true） */
  blockInteraction?: boolean;
  /** 全画面マスク表示にするか。指定がない（false）場合は親コンテナ内で表示される */
  mask?: boolean;
  /** 背景に薄い黒の半透明オーバーレイを表示するか（mask時や親内表示で使える） */
  overlay?: boolean;
  /** オーバーレイの不透明度（0.0 - 1.0）。デフォルトは 0.3 */
  overlayOpacity?: number;
  className?: string;
  /** スピナーのサイズ。数値(px) または 'sm'|'md'|'lg' を指定可能。デフォルト: 'md' */
  size?: number | 'sm' | 'md' | 'lg';
}

export function Spinner({
  open,
  message,
  blockInteraction = true,
  mask = false,
  overlay = false,
  overlayOpacity = 0.3,
  size = 'md',
  className = '',
}: SpinnerProps) {
  if (!open) return null;

  // size が数値かキーワードかを判定してピクセルに変換
  const numericSize: number =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 24
      : size === 'lg'
      ? 72
      : 48;

  const thickness = Math.max(2, Math.round(numericSize * 0.08));

  const commonContent = (
    <div
      role="status"
      aria-live="polite"
      className="relative z-10 flex flex-col items-center gap-3"
    >
      <div
        className="rounded-full animate-spin"
        style={{
          width: numericSize,
          height: numericSize,
          border: `${thickness}px solid var(--primary)`,
          borderTopColor: 'transparent',
        }}
        aria-hidden="true"
      />
      {message && (
        <div className="text-sm" style={{ color: 'var(--on-surface)' }}>
          {message}
        </div>
      )}
    </div>
  );

  if (mask) {
    const bgStyle: React.CSSProperties = overlay
      ? { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }
      : { backgroundColor: 'transparent' };

    return (
      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          blockInteraction ? 'pointer-events-auto' : 'pointer-events-none'
        } ${className}`}
      >
        {/* 背景: overlay が指定されたら薄い黒の半透明、それ以外は透明 */}
        <div className="absolute inset-0" style={bgStyle} />

        {commonContent}
      </div>
    );
  }

  // 親コンテナ内での表示（親要素に position: relative を指定してください）
  // 親コンテナ内での表示。overlay が true の場合は親領域を覆う透明レイヤーを敷く
  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-0 flex items-center justify-center ${
        blockInteraction ? 'pointer-events-auto' : 'pointer-events-none'
      } ${className}`}
    >
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      )}
      {commonContent}
    </div>
  );
}

export default Spinner;
