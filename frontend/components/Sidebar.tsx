'use client';

import Link from 'next/link';

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
        <Link
          href="/"
          className="hover:bg-gray-700 px-3 py-2 rounded"
          onClick={onClose}
        >
          Home
        </Link>
        <Link
          href="/dashboard"
          className="hover:bg-gray-700 px-3 py-2 rounded"
          onClick={onClose}
        >
          ダッシュボード
        </Link>
        {/* 追加メニュー */}
      </nav>
    </div>
  );
}
