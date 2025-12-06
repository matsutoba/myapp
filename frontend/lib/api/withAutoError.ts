import type { ApiResponse } from '@/lib/api/client';
import { API_ERROR_EVENT } from '@/lib/contexts/ErrorContext';

/**
 * Server Actionをラップして、エラー時に自動的にグローバルエラーモーダルを表示する
 *
 * @example
 * const wrappedGetUsers = withAutoError(getUsers);
 * const result = await wrappedGetUsers(); // エラー時は自動的にモーダル表示
 */
export function withAutoError<TArgs extends unknown[], TResult>(
  serverAction: (...args: TArgs) => Promise<ApiResponse<TResult>>,
) {
  return async (...args: TArgs): Promise<ApiResponse<TResult>> => {
    const result = await serverAction(...args);

    // エラー時にグローバルイベントを発行
    if (!result.success && result.error && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(API_ERROR_EVENT, { detail: result.error }),
      );
    }

    return result;
  };
}
