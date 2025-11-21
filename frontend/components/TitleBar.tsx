'use client';
import { USER_ROLES } from '@/constants';
import { logoutAction } from '@/features/auth/actions/login';
import { User } from '@/features/auth/types';
import { LogOut } from 'lucide-react';

export default function TitleBar({ user }: { user: User | null }) {
  const { name, role } = user || {};
  const bgColor = role === USER_ROLES.ADMIN ? 'bg-indigo-900' : 'bg-gray-800';

  return (
    <div
      className={`h-8 ${bgColor} text-white flex justify-between items-center px-3`}
    >
      <div className="font-bold">MyApp</div>
      <div className="flex items-center gap-2">
        <span>{name}</span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm hover:bg-gray-500 text-white px-2 py-1 rounded"
            aria-label="ログアウト"
          >
            <LogOut />
          </button>
        </form>
      </div>
    </div>
  );
}
