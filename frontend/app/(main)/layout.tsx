'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import GlobalMenu from '../../components/GlobalMenu';
import TitleBar from '../../components/TitleBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 未ログイン時はリダイレクトするので何も表示しない
  if (!isAuthenticated) {
    return null;
  }

  const userName = user?.name || user?.email || 'User';

  return (
    <>
      <TitleBar user={userName} />
      <GlobalMenu />
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}
