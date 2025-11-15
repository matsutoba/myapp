'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { logoutAction } from '../actions/login';
import type { User } from '../types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初期化時に認証状態をチェック
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Cookieからユーザー情報を取得
      const userCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('user='));

      if (userCookie) {
        const userStr = decodeURIComponent(userCookie.split('=')[1]);
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('認証チェックエラー:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await logoutAction();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
    router.refresh();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    checkAuth,
    logout,
  };
}
