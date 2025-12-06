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

  const keys = Object.keys(actions) as Array<keyof T>;
  for (const key of keys) {
    const action = actions[key];
    if (typeof action !== 'function') continue;

    const wrapped = (async (...args: Parameters<T[typeof key]>) => {
      const fn = action as unknown as (
        ...a: Parameters<T[typeof key]>
      ) => ReturnType<T[typeof key]>;
      const result = await fn(...args);

      if (result && typeof result === 'object' && result !== null) {
        const resObj = result as Record<string, unknown>;
        if (
          'success' in resObj &&
          resObj['success'] === false &&
          resObj['error'] !== undefined &&
          typeof window !== 'undefined'
        ) {
          window.dispatchEvent(
            new CustomEvent(API_ERROR_EVENT, { detail: resObj['error'] }),
          );
        }
      }

      return result as ReturnType<T[typeof key]>;
    }) as (...args: Parameters<T[typeof key]>) => ReturnType<T[typeof key]>;

    proxy[key as keyof T] = wrapped;
  }

  return proxy as {
    [K in keyof T]: (...args: Parameters<T[K]>) => ReturnType<T[K]>;
  };
}
