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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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

    // Add Authorization header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error || errorData.message || `HTTP ${response.status}`,
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
      error: error instanceof Error ? error.message : 'Unknown error',
    };
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error:
          errorData.error || errorData.message || `HTTP ${response.status}`,
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
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
