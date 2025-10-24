'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import HamburgerButton from './HamburgerButton';
import Sidebar from './Sidebar';

export default function GlobalMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <Sidebar isOpen={isOpen} onClose={closeSidebar} />
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
