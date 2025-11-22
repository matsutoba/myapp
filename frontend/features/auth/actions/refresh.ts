'use server';

import { cookies } from 'next/headers';
import type { LoginResponse } from '../types';

// リフレッシュトークンを使ってアクセストークンを更新
export async function refreshTokensAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    if (!refreshToken) {
      return { success: false, error: 'no refresh token' };
    }

    const apiHost = process.env.API_HOST || 'http://localhost:8080';

    const serviceApiKey =
      process.env.SERVICE_API_KEY || process.env.API_KEY || '';
    const response = await fetch(`${apiHost}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // httpOnlyのCookieは自動送信されないため、明示的に付与
        // Server ActionsではCookie値を取得できるので安全にヘッダーへ載せる
        Authorization: `Bearer ${refreshToken}`,
        ...(serviceApiKey ? { 'X-API-Key': serviceApiKey } : {}),
      },
    });

    if (!response.ok) {
      return { success: false, error: `refresh failed: ${response.status}` };
    }

    const data: LoginResponse = await response.json();

    // 新しいトークンでクッキーを更新（有効期限は環境変数で調整可能）
    const accessHours = parseInt(process.env.ACCESS_TOKEN_TTL_HOURS || '1', 10);
    const refreshHours = parseInt(
      process.env.REFRESH_TOKEN_TTL_HOURS || '168',
      10,
    );
    const accessMaxAge = accessHours * 60 * 60;
    const refreshMaxAge = refreshHours * 60 * 60;

    cookieStore.set('authToken', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessMaxAge,
    });
    cookieStore.set('accessToken', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: accessMaxAge,
    });
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshMaxAge,
    });

    // ユーザー情報も更新（必要に応じて）
    cookieStore.set('user', JSON.stringify(data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (e) {
    console.error('refresh error', e);
    return { success: false, error: 'exception during refresh' };
  }
}
