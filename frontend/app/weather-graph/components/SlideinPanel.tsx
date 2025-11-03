'use client';

import { type ReactNode } from 'react';

interface SlideinPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
}

export const SlideinPanel = ({
  children,
  isOpen,
  onClose,
}: SlideinPanelProps) => {
  return (
    <div
      className={`absolute top-0 right-0 h-full w-1/2 bg-white
          transform transition-transform duration-300 ease-out shadow-lg
          ${isOpen ? '-translate-x-0' : 'translate-x-full'}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex justify-end items-center p-4">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-4/5">{children}</div>
    </div>
  );
};
