import React from 'react';
import { IconButton } from '../IconButton/IconButton';

interface HamburgerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function HamburgerButton({
  className = '',
  ...props
}: HamburgerButtonProps) {
  return (
    <IconButton
      icon="Menu"
      variant="default"
      aria-label="メニューを開く"
      {...props}
    />
  );
}
