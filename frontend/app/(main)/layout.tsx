'use client';

import { Sidebar, SidebarItem, TitleBar } from '@/components/ui';
import { USER_ROLES } from '@/constants';
import { logoutAction } from '@/features/auth/actions/login';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: SidebarItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    ...(user?.role === USER_ROLES.ADMIN
      ? [
          {
            title: '管理者メニュー',
            href: '/admin',
          },
        ]
      : []),
    {
      title: '日本の天気',
      href: '/weather-graph',
    },
  ];

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

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <>
      <TitleBar
        user={user}
        onLogout={handleLogout}
        onClickHamburger={() => setIsOpen(!isOpen)}
      />
      <Sidebar
        isOpen={isOpen}
        items={menuItems}
        onClose={() => setIsOpen(false)}
      />
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}
