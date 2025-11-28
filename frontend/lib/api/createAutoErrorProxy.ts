import { API_ERROR_EVENT } from '@/lib/contexts/ErrorContext';

/**
 * Server Actionの結果をクライアント側で自動的にエラーハンドリングするProxyを作成
 * この関数でラップされたServer Actionsは、クライアント側で呼び出された際に
 * エラーが発生すると自動的にグローバルエラーモーダルを表示する
 */
export function createAutoErrorProxy<
  T extends Record<string, (...args: any[]) => Promise<any>>,
>(
  actions: T,
): {
  [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
} {
  const proxy: Partial<{
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
  }> = {};

  for (const [key, action] of Object.entries(actions)) {
    if (typeof action === 'function') {
      // オリジナルのパラメータと戻り値の型を割り当て時にキャストで保持
      (proxy as any)[key] = async (...args: any[]) => {
        const result = await (action as any)(...args);

        // ApiResponseの形式をチェック
        if (
          result &&
          typeof result === 'object' &&
          'success' in result &&
          !result.success &&
          result.error &&
          typeof window !== 'undefined'
        ) {
          // クライアント側でエラーイベントを発行
          window.dispatchEvent(
            new CustomEvent(API_ERROR_EVENT, { detail: result.error }),
          );
        }

        return result;
      };
    }
  }

  return proxy as {
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
  };
}
