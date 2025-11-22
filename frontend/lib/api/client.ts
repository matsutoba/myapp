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
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.API_HOST || 'http://localhost:8080';

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

    // Attach service API key for server-side requests when configured
    const serviceApiKey =
      process.env.SERVICE_API_KEY || process.env.API_KEY || '';
    if (serviceApiKey) {
      headers['X-API-Key'] = serviceApiKey;
    }

    // Add Authorization header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.info('API Server Request:', url);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If unauthorized, try to refresh tokens once (server-side)
    if (response.status === 401) {
      const refreshed = await tryRefreshServerTokens();
      if (refreshed) {
        // re-read token and retry once
        const cookieStore2 = await cookies();
        const newAccess =
          cookieStore2.get('accessToken')?.value ||
          cookieStore2.get('authToken')?.value;
        if (newAccess) {
          headers['Authorization'] = `Bearer ${newAccess}`;
        }
        const retryRes = await fetch(url, { ...options, headers });
        return await handleServerResponse<T>(retryRes);
      }
    }

    if (!response.ok) {
      const errorData: ApiErrorResponse | undefined = await response
        .json()
        .catch(() => undefined);

      if (errorData?.error) {
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

    // 204 No Content の場合はボディが空なのでJSONパースをスキップ
    if (response.status === 204) {
      return {
        success: true,
        data: undefined as T,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
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

async function handleServerResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData: ApiErrorResponse | undefined = await response
      .json()
      .catch(() => undefined);

    if (errorData?.error) {
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
    return { success: true, data: undefined as any };
  }

  const data = await response.json();
  return { success: true, data };
}

// Try to refresh tokens server-side by reading refreshToken cookie and
// calling the refresh endpoint. Returns true if refreshed and cookies updated.
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
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    // In client-side, cookies are handled automatically by browser
    // if credentials: 'include' is set (for cross-origin)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    };

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for cross-origin requests
    });

    // If unauthorized, try client-side refresh once (uses cookies via credentials: 'include')
    if (response.status === 401) {
      const refreshed = await tryRefreshClientTokens();
      if (refreshed) {
        const retryRes = await fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        });
        return await handleClientResponse<T>(retryRes);
      }
    }

    if (!response.ok) {
      const errorData: ApiErrorResponse | undefined = await response
        .json()
        .catch(() => undefined);

      if (errorData?.error) {
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

    // 204 No Content の場合はボディが空なのでJSONパースをスキップ
    if (response.status === 204) {
      return {
        success: true,
        data: undefined as T,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Client Error:', error);
    return {
      success: false,
      error: {
        code: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

async function handleClientResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData: ApiErrorResponse | undefined = await response
      .json()
      .catch(() => undefined);

    if (errorData?.error) {
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
    return { success: true, data: undefined as any };
  }

  const data = await response.json();
  return { success: true, data };
}

// Try to refresh tokens from the client by calling the refresh endpoint
// with credentials: 'include' so that HttpOnly refresh cookie is sent.
async function tryRefreshClientTokens(): Promise<boolean> {
  try {
    const apiHost = process.env.API_HOST || 'http://localhost:8080';
    const resp = await fetch(`${apiHost}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!resp.ok) return false;

    // If the refresh endpoint returns new tokens and sets cookies, we consider it successful.
    // Some backends return JSON with tokens; others set cookies. We accept both.
    const data = await resp.json().catch(() => undefined);
    if (data && (data.token || data.accessToken || data.refreshToken)) {
      // If backend returned tokens in body, nothing to do here because cookies may be HttpOnly;
      // client cannot set HttpOnly cookies—so backend should also set cookies when appropriate.
    }
    return true;
  } catch (e) {
    console.error('refresh client tokens error', e);
    return false;
  }
}
