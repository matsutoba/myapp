import React from 'react';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
  /** モーダルのサイズ。デフォルト: 'medium' */
  size?: 'small' | 'medium' | 'large';
  /** オーバーレイがユーザー操作をブロックするか（デフォルト true） */
  blockInteraction?: boolean;
  /** 背景に薄い黒の半透明オーバーレイを表示するか */
  overlay?: boolean;
  /** オーバーレイの不透明度（0.0 - 1.0）。デフォルトは 0.5 */
  overlayOpacity?: number;
  /** 閉じるボタンを表示するか（デフォルト true） */
  showCloseButton?: boolean;
  /** フッターに表示するボタン */
  footer?: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'medium',
  blockInteraction = true,
  overlay = true,
  overlayOpacity = 0.5,
  showCloseButton = true,
  footer,
  className = '',
}: ModalProps) {
  if (!open) return null;

  // サイズに応じたスタイル
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
  };

  const bgStyle: React.CSSProperties = overlay
    ? { backgroundColor: `rgba(0,0,0,${overlayOpacity})` }
    : { backgroundColor: 'transparent' };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        blockInteraction ? 'pointer-events-auto' : 'pointer-events-none'
      } ${className}`}
      style={bgStyle}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full mx-4 ${sizeClasses[size]} pointer-events-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {showCloseButton && onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="閉じる"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* コンテンツ */}
        <div className="px-6 py-4">{children}</div>

        {/* フッター */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
