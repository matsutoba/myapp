import React from 'react';
import { IconButton } from '../IconButton/IconButton';

export function HamburgerButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <IconButton
      icon="Menu"
      variant="default"
      aria-label="メニューを開く"
      {...props}
    />
  );
}
