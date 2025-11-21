import React from 'react';

interface HamburgerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function HamburgerButton({
  className = '',
  ...props
}: HamburgerButtonProps) {
  return (
    <button
      className={`hover:bg-gray-600 rounded p-1 transition-colors ${className}`}
      aria-label="メニューを開く"
      {...props}
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}
