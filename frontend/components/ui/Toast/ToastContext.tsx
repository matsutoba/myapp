'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import ToastContainer from './ToastContainer';

export type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  title?: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number; // ms, undefined means persistent
};

type ToastContextType = {
  showToast: (t: Omit<ToastItem, 'id'> & { id?: string }) => string;
  dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (t: Omit<ToastItem, 'id'> & { id?: string }) => {
      const id =
        t.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const item: ToastItem = {
        id,
        title: t.title,
        message: t.message,
        variant: t.variant ?? 'info',
        duration: t.duration,
      };
      setToasts((s) => [...s, item]);

      if (item.duration && item.duration > 0) {
        setTimeout(() => {
          setToasts((s) => s.filter((x) => x.id !== id));
        }, item.duration);
      }

      return id;
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  // cleanup on unmount
  useEffect(() => {
    return () => setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastContext;
