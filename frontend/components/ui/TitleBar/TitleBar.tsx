'use client';

import { HamburgerButton } from '../HamburgerButton/HamburgerButton';
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
  onClickHamburger?: () => void;
  onLogout?: () => void;
  className?: string;
}

export function TitleBar({
  user,
  appName = 'MyApp',
  adminRole = 'admin',
  onClickHamburger,
  onLogout,
  className = '',
}: TitleBarProps) {
  const { name, role } = user || {};
  const displayName = name || user?.email || 'User';

  return (
    <div
      className={`h-10 ${
        role === adminRole
          ? 'bg-indigo-900 text-on-primary'
          : 'bg-surface text-on-surface'
      } flex justify-between items-center px-md ${className}`}
    >
      <div className="flex items-center gap-2">
        {onClickHamburger && <HamburgerButton onClick={onClickHamburger} />}
        <div className="font-bold">{appName}</div>
      </div>

      <div className="flex items-center gap-2">
        {user && <span className="text-sm">{displayName}</span>}
        {onLogout && (
          <IconButton
            icon="LogOut"
            onClick={onLogout}
            aria-label="ログアウト"
          />
        )}
      </div>
    </div>
  );
}
