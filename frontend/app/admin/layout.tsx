'use client';

import GlobalMenu from '@/components/GlobalMenu';
import TitleBar from '@/components/TitleBar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const userName = user?.name || user?.email || 'User';

  return (
    <>
      <TitleBar user={user} />
      <GlobalMenu user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}
