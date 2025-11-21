'use client';

import { USER_ROLES } from '@/constants';
import { User } from '@/features/auth/types';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { HamburgerButton, Sidebar, SidebarItem } from './ui';

interface GlobalMenuProps {
  user: User | null;
}

export default function GlobalMenu({ user }: GlobalMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const menuItems: SidebarItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    ...(isAdmin
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

  return (
    <>
      <Sidebar isOpen={isOpen} items={menuItems} onClose={closeSidebar} />
      <div className="h-10 bg-gray-700 text-white flex items-center px-2 space-x-4">
        <HamburgerButton onClick={toggleSidebar} />
        <Link href="/" className="hover:opacity-80">
          <Home size={24} />
        </Link>
        {/* 他のメニュー */}
      </div>
    </>
  );
}
