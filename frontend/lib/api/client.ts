/*
  APIクライアントモジュール

  このモジュールは、Next.jsのApp Router環境で使用するための統一されたAPIクライアントを提供します。
  サーバーサイドとクライアントサイドの両方で動作し、以下の機能を自動的に処理します：

  - サーバーサイドでは、httpOnlyクッキーからアクセストークンを取得し、Authorizationヘッダーに設定します。
  - APIのベースURLを環境変数から設定します。
  - エラーハンドリングを統一し、成功・失敗のレスポンス形式を提供します。
  - TypeScriptの型安全性を確保します。

  使用方法：
  - サーバーサイドでAPIを呼び出す場合は `apiServer` 関数を使用します（サーバーアクションやサーバーコンポーネント用）。
  - クライアントサイドでAPIを呼び出す場合は `apiClient` 関数を使用します（クライアントコンポーネント用）。
*/
import { API_ERROR_EVENT } from '@/lib/contexts/ErrorContext';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_HOST || 'http://localhost:8080';

// グローバルエラーイベントを発行（クライアントサイドのみ）
function dispatchGlobalError(error: ApiErrorDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail: error }));
  }
}

// 共通ヘルパー関数
function isApiKeyError(errorData?: ApiErrorResponse): boolean {
  console.warn('isApiKeyError called with:', errorData);
  return errorData?.error?.message?.toLowerCase().includes('api key') || false;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData: ApiErrorResponse | undefined = await response
      .json()
      .catch(() => undefined);

    if (errorData?.error) {
      console.warn('API Error Response:', errorData);
      return {
        success: false,
        error: errorData.error,
      };
    }

    return {
      success: false,
      error: {
        code: response.status,
        message: response.statusText || `HTTP ${response.status}`,
      },
    };
  }

  if (response.status === 204) {
    return { success: true, data: undefined as T };
  }

  const data = await response.json();
  return { success: true, data };
}

export interface ApiErrorDetail {
  code: number;
  message: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorDetail;
}

export interface ApiClientOptions extends RequestInit {
  /** エラー時に自動的にグローバルエラーモーダルを表示するか（デフォルト: false） */
  autoShowError?: boolean;
}

/*
  サーバーサイドAPIクライアント（サーバーアクションおよびサーバーコンポーネント用）
  httpOnlyクッキーからAuthorizationヘッダーを自動的に注入します
*/
export async function apiServer<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const cookieStore = await cookies();
    const accessToken =
      cookieStore.get('accessToken')?.value ||
      cookieStore.get('authToken')?.value;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    // サーバーサイドリクエスト用のAPI keyを設定（環境変数で設定されている場合）
    const serviceApiKey =
      process.env.SERVICE_API_KEY || process.env.API_KEY || '';
    if (serviceApiKey) {
      headers['X-API-Key'] = serviceApiKey;
    }

    // トークンが存在する場合、Authorizationヘッダーを追加
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.debug('API Server Response:', response);

    // 401エラー時、APIキーエラーでなければトークンリフレッシュを試行
    if (response.status === 401) {
      const clonedResponse = response.clone();
      const errorData: ApiErrorResponse | undefined = await clonedResponse
        .json()
        .catch(() => undefined);

      if (!isApiKeyError(errorData)) {
        const refreshed = await tryRefreshServerTokens();
        if (refreshed) {
          const cookieStore2 = await cookies();
          const newAccess =
            cookieStore2.get('accessToken')?.value ||
            cookieStore2.get('authToken')?.value;
          if (newAccess) {
            headers['Authorization'] = `Bearer ${newAccess}`;
          }
          const retryRes = await fetch(url, { ...options, headers });
          return await handleResponse<T>(retryRes);
        }
      }
    }

    return await handleResponse<T>(response);
  } catch (error) {
    console.error('API Server Error:', error);
    return {
      success: false,
      error: {
        code: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

// サーバーサイドでトークンをリフレッシュする
// refreshTokenクッキーを読み取り、リフレッシュエンドポイントを呼び出す
// リフレッシュが成功してクッキーが更新された場合はtrueを返す
async function tryRefreshServerTokens(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) return false;

    const apiHost = process.env.API_HOST || 'http://localhost:8080';
    const serviceApiKey =
      process.env.SERVICE_API_KEY || process.env.API_KEY || '';
    const resp = await fetch(`${apiHost}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
        ...(serviceApiKey ? { 'X-API-Key': serviceApiKey } : {}),
      },
    });

    if (!resp.ok) return false;
    const data = await resp.json();

    const accessHours = parseInt(process.env.ACCESS_TOKEN_TTL_HOURS || '1', 10);
    const refreshHours = parseInt(
      process.env.REFRESH_TOKEN_TTL_HOURS || '168',
      10,
    );
    const accessMaxAge = accessHours * 60 * 60;
    const refreshMaxAge = refreshHours * 60 * 60;

    if (data.token || data.accessToken) {
      const tokenVal = data.accessToken || data.token;
      cookieStore.set('authToken', tokenVal, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: accessMaxAge,
        path: '/',
      });
      cookieStore.set('accessToken', tokenVal, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: accessMaxAge,
        path: '/',
      });
    }
    if (data.refreshToken) {
      cookieStore.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: refreshMaxAge,
        path: '/',
      });
    }
    if (data.user) {
      cookieStore.set('user', JSON.stringify(data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return true;
  } catch (e) {
    console.error('refresh server tokens error', e);
    return false;
  }
}

/*
  クライアントサイドAPIクライアント（クライアントコンポーネント用）
  ブラウザが自動的にクッキーを処理します
*/
export async function apiClient<T>(
  endpoint: string,
  options?: ApiClientOptions,
): Promise<ApiResponse<T>> {
  const { autoShowError = false, ...fetchOptions } = options || {};

  try {
    // クライアントサイドでは、credentials: 'include'を設定することで
    // ブラウザが自動的にクッキーを処理する（クロスオリジンリクエストの場合）
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions?.headers as Record<string, string>),
    };

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials: 'include', // クロスオリジンリクエストでクッキーを含める
    });

    // 401エラー時、APIキーエラーでなければトークンリフレッシュを試行
    if (response.status === 401) {
      const clonedResponse = response.clone();
      const errorData: ApiErrorResponse | undefined = await clonedResponse
        .json()
        .catch(() => undefined);

      if (!isApiKeyError(errorData)) {
        const refreshed = await tryRefreshClientTokens();
        if (refreshed) {
          const retryRes = await fetch(url, {
            ...fetchOptions,
            headers,
            credentials: 'include',
          });
          const result = await handleResponse<T>(retryRes);

          // エラー時に自動表示
          if (!result.success && autoShowError && result.error) {
            dispatchGlobalError(result.error);
          }

          return result;
        }
      }
    }

    const result = await handleResponse<T>(response);

    // エラー時に自動表示
    if (!result.success && autoShowError && result.error) {
      dispatchGlobalError(result.error);
    }

    return result;
  } catch (error) {
    console.error('API Client Error:', error);
    const errorDetail: ApiErrorDetail = {
      code: 0,
      message: error instanceof Error ? error.message : 'Unknown error',
    };

    // エラー時に自動表示
    if (autoShowError) {
      dispatchGlobalError(errorDetail);
    }

    return {
      success: false,
      error: errorDetail,
    };
  }
}

// クライアントサイドでトークンをリフレッシュする
// credentials: 'include'を指定してリフレッシュエンドポイントを呼び出し、
// HttpOnlyのrefreshクッキーが送信されるようにする
async function tryRefreshClientTokens(): Promise<boolean> {
  try {
    const apiHost = process.env.API_HOST || 'http://localhost:8080';
    const resp = await fetch(`${apiHost}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!resp.ok) return false;

    // リフレッシュエンドポイントが新しいトークンを返してクッキーを設定すれば成功とみなす
    // バックエンドによってはJSONでトークンを返す場合と、クッキーを設定する場合がある。両方に対応
    const data = await resp.json().catch(() => undefined);
    if (data && (data.token || data.accessToken || data.refreshToken)) {
      // バックエンドがボディでトークンを返した場合、クッキーがHttpOnlyの可能性があるためここでは何もしない
      // クライアントはHttpOnlyクッキーを設定できないため、バックエンド側で適切にクッキーを設定する必要がある
    }
    return true;
  } catch (e) {
    console.error('refresh client tokens error', e);
    return false;
  }
}
