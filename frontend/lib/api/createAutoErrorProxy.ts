import { API_ERROR_EVENT } from '@/lib/contexts/ErrorContext';

/**
 * Server Actionの結果をクライアント側で自動的にエラーハンドリングするProxyを作成
 * この関数でラップされたServer Actionsは、クライアント側で呼び出された際に
 * エラーが発生すると自動的にグローバルエラーモーダルを表示する
 */
export function createAutoErrorProxy<T extends Record<string, any>>(
  actions: T,
): T {
  const proxy: any = {};

  for (const [key, action] of Object.entries(actions)) {
    if (typeof action === 'function') {
      proxy[key] = async (...args: any[]) => {
        const result = await action(...args);

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

  return proxy as T;
}
