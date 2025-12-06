'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ToastContainer } from './ToastContainer';

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
  // トースト ID -> タイマー ID の Map。
  // トーストが早期に閉じられた場合や Provider がアンマウントされる際に
  // タイマーをキャンセルして、アンマウント後の setState を防ぎメモリリークを避けます。
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

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
        const timer = setTimeout(() => {
          // トーストを削除し、対応するタイマー情報を Map から削除
          setToasts((s) => s.filter((x) => x.id !== id));
          timersRef.current.delete(id);
        }, item.duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  // アンマウント時のクリーンアップ: 保留中のタイマーを全てクリアし、トーストを空にする
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      setToasts([]);
    };
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

export { ToastContext };
