'use client';

import { USER_ROLES } from '@/constants';
import { User } from '@/features/auth/types';
import Link from 'next/link';

export default function Sidebar({
  isOpen,
  user,
  onClose,
}: {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
}) {
  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const menuItems = [
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
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="p-4 flex justify-between items-center">
        <span className="font-bold text-lg">Menu</span>
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded">
          ✕
        </button>
      </div>
      <nav className="flex flex-col space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:bg-gray-700 px-3 py-2 rounded"
            onClick={onClose}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
