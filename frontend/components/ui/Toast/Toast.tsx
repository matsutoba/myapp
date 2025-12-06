import React from 'react';
import { Icon } from '../Icon/Icon';
import type { ToastItem } from './ToastContext';

const VARIANT_STYLES: Record<string, string> = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-slate-800 text-white',
};

export const Toast: React.FC<{
  toast: ToastItem;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const cls = VARIANT_STYLES[toast.variant ?? 'info'] ?? VARIANT_STYLES.info;

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-md overflow-hidden ${cls} ring-1 ring-black/10`}
    >
      <div className="p-3 flex items-start gap-3">
        <div className="mt-0.5">
          {toast.variant === 'success' && <Icon name="CheckCircle" />}
          {toast.variant === 'error' && <Icon name="AlertTriangle" />}
          {toast.variant === 'info' && <Icon name="Info" />}
        </div>
        <div className="flex-1">
          {toast.title && (
            <div className="font-semibold text-sm">{toast.title}</div>
          )}
          {toast.message && (
            <div className="text-xs opacity-90">{toast.message}</div>
          )}
        </div>
        <button
          aria-label="Close"
          onClick={() => onClose(toast.id)}
          className="opacity-90 hover:opacity-100"
        >
          <Icon name="X" />
        </button>
      </div>
    </div>
  );
};
