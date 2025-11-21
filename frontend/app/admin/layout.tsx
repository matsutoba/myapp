'use client';

import { Sidebar, SidebarItem, TitleBar } from '@/components/ui';
import { logoutAction } from '@/features/auth/actions/login';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems: SidebarItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: '管理者メニュー',
    href: '/admin',
  },
  {
    title: '日本の天気',
    href: '/weather-graph',
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
