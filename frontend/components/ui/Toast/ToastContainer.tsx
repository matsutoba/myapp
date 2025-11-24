import React from 'react';
import Toast from './Toast';
import type { ToastItem } from './ToastContext';

const ToastContainer: React.FC<{
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {toasts.map((t) => (
        <div key={t.id} className="animate-slide-up">
          <Toast toast={t} onClose={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
