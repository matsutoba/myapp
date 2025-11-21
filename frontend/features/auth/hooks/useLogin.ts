'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginAction } from '../actions/login';
import type { LoginRequest } from '../types';

export function useLogin() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (formData: LoginRequest) => {
    setError('');
    setIsLoading(true);

    try {
      const result = await loginAction(formData);
      if (!result.success) {
        setError('メールアドレスまたはパスワードが違います');
        throw new Error(result.error?.message || 'ログインに失敗しました');
      }

      // ホームページにリダイレクト
      router.push('/');
      router.refresh();
    } catch (err) {
      // エラーは既にsetErrorで設定済み
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    error,
    isLoading,
  };
}
