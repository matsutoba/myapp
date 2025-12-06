import { API_ERROR_EVENT } from '@/lib/contexts/ErrorContext';

/**
 * Server Actionの結果をクライアント側で自動的にエラーハンドリングするProxyを作成
 * この関数でラップされたServer Actionsは、クライアント側で呼び出された際に
 * エラーが発生すると自動的にグローバルエラーモーダルを表示する
 */
// このモジュールはランタイムでサーバーアクションをラップし、既存のアクション
// の形状との互換性を保つためにジェネリック制約で意図的に `any` を使用しています。
// 将来的に型を厳密化できるよう、ここで `no-explicit-any` ルールを無効化し、
// 保守者が後で型を強化できるよう明確な注釈を残しています。
/* eslint-disable @typescript-eslint/no-explicit-any -- 意図的な互換性シム */
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
      // `action` は外部から渡される関数であり、型情報が呼び出し元で
      // 異なる可能性があるためここで一度 `unknown` を挟んでから目的の
      // 関数型にキャストしています。これはランタイムでラップを行うための
      // 実用的かつ非破壊的な手段で、呼び出し側の互換性を維持するために必要です。
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
/* eslint-enable @typescript-eslint/no-explicit-any */
