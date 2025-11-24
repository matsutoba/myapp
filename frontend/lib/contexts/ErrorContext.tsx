'use client';

import { ErrorModal } from '@/components/ui';
import type { ApiErrorDetail } from '@/lib/api/client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ErrorContextType {
  showError: (error: ApiErrorDetail | null | undefined) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// グローバルAPIエラーイベント名
export const API_ERROR_EVENT = 'api-error';

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<ApiErrorDetail | null>(null);

  const showError = useCallback((error: ApiErrorDetail | null | undefined) => {
    if (error) {
      setError(error);
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
