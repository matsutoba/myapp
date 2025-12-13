'use client';

import { ErrorModal } from '@/components/ui';
import type { ApiErrorDetail } from '@/lib/api/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface ErrorContextType {
  showError: (error: ApiErrorDetail | null | undefined) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// グローバルAPIエラーイベント名
export const API_ERROR_EVENT = 'api-error';

// セッション無効エラーコード
const SESSION_INVALID_ERROR_CODES = [3002, 3004];

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ApiErrorDetail | null>(null);
  const [isSessionInvalid, setIsSessionInvalid] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ログイン画面に遷移したときにセッション無効フラグをリセット
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePathChange = () => {
        if (window.location.pathname === '/login' && isSessionInvalid) {
          // マイクロタスクキューで遅延実行して setState のタイミングを調整
          resetTimerRef.current = setTimeout(() => {
            setIsSessionInvalid(false);
            setError(null);
          }, 0);
        }
      };

      window.addEventListener('popstate', handlePathChange);
      return () => {
        window.removeEventListener('popstate', handlePathChange);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      };
    }
  }, [isSessionInvalid]);

  const showError = useCallback((error: ApiErrorDetail | null | undefined) => {
    if (error) {
      // セッション無効エラーの場合
      if (SESSION_INVALID_ERROR_CODES.includes(error.code)) {
        setIsSessionInvalid(true);
        setError({
          code: error.code,
          message: 'ログインセッションが無効です',
        });
      } else {
        setError(error);
      }
    } else {
      setError({
        code: 0,
        message: '予期しないエラーが発生しました。',
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // グローバルAPIエラーイベントをリスン
  useEffect(() => {
    const handleApiError = (event: Event) => {
      const customEvent = event as CustomEvent<ApiErrorDetail>;
      showError(customEvent.detail);
    };

    window.addEventListener(API_ERROR_EVENT, handleApiError);
    return () => {
      window.removeEventListener(API_ERROR_EVENT, handleApiError);
    };
  }, [showError]);

  return (
    <ErrorContext.Provider value={{ showError, clearError }}>
      {children}
      <ErrorModal
        open={!!error}
        onClose={clearError}
        error={error || undefined}
        isSessionInvalid={isSessionInvalid}
      />
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}
