'use client';

import { IconButton } from '../IconButton/IconButton';

interface User {
  name?: string;
  email?: string;
  role?: string;
}

interface TitleBarProps {
  user: User | null;
  appName?: string;
  adminRole?: string;
  onLogout?: () => void;
  className?: string;
}

export function TitleBar({
  user,
  appName = 'MyApp',
  adminRole = 'admin',
  onLogout,
  className = '',
}: TitleBarProps) {
  const { name, role } = user || {};
  const bgColor = role === adminRole ? 'bg-indigo-900' : 'bg-gray-800';
  const displayName = name || user?.email || 'User';

  return (
    <div
      className={`h-8 ${bgColor} text-white flex justify-between items-center px-3 ${className}`}
    >
      <div className="font-bold">{appName}</div>
      <div className="flex items-center gap-2">
        {user && <span className="text-sm">{displayName}</span>}
        {onLogout && (
          <IconButton
            icon="LogOut"
            size="sm"
            onClick={onLogout}
            aria-label="ログアウト"
            className="text-white hover:bg-gray-700"
          />
        )}
      </div>
    </div>
  );
}
