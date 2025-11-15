'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { LoginRequest, LoginResponse } from '../types';

const API_BASE_URL = process.env.API_HOST || 'http://localhost:8080';

export async function loginAction(formData: LoginRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || errorData.message || 'ログインに失敗しました',
      };
    }

    const data: LoginResponse = await response.json();

    // トークンをhttpOnlyクッキーに保存（有効期限は環境変数で調整可能）
    const cookieStore = await cookies();
    const accessHours = parseInt(process.env.ACCESS_TOKEN_TTL_HOURS || '1', 10);
    const refreshHours = parseInt(
      process.env.REFRESH_TOKEN_TTL_HOURS || '168',
      10,
    );
    const accessMaxAge = accessHours * 60 * 60;
    const refreshMaxAge = refreshHours * 60 * 60;

    // 後方互換のためauthTokenも残しつつ、新たにaccessToken/refreshTokenを設定
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
    cookieStore.set('refreshToken', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshMaxAge,
    });

    // ユーザー情報も保存（httpOnlyではない、クライアントから読める）
    cookieStore.set('user', JSON.stringify(data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'ログイン処理中にエラーが発生しました',
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // バックエンドのlogout APIを呼び出してリフレッシュトークンを失効
  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      // エラーでもCookie削除は続行（ベストエフォート）
    } catch (error) {
      console.error('Logout API error:', error);
    }
  }

  // Cookie削除
  cookieStore.delete('authToken');
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('user');

  // ログインページへリダイレクト
  redirect('/login');
}
