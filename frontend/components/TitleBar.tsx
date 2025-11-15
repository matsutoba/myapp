'use client';
import { logoutAction } from '@/features/auth/actions/login';
import { LogOut } from 'lucide-react';

export default function TitleBar({ user }: { user: string }) {
  return (
    <div className="h-8 bg-gray-800 text-white flex justify-between items-center px-3">
      <div className="font-bold">MyApp</div>
      <div className="flex items-center gap-2">
        <span>{user}</span>
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
