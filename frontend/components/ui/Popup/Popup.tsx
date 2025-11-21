'use client';

import { flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { IconButton } from '../IconButton/IconButton';

export type PopupSize = 'small' | 'medium' | 'large';

interface PopupProps {
  isOpen: boolean;
  referenceElement: Element | null;
  children?: React.ReactNode;
  onClose: () => void;
  size?: PopupSize;
  className?: string;
}

export function Popup({
  isOpen,
  referenceElement,
  children,
  size = 'medium',
  onClose,
  className = '',
}: PopupProps) {
  const { x, y, refs, strategy } = useFloating({
    middleware: [offset(10), flip(), shift()],
  });

  const popupSize = useMemo(() => {
    switch (size) {
      case 'small':
        return 'w-96 h-74';
      case 'medium':
        return 'w-128 h-96';
      case 'large':
        return 'w-192 h-144';
    }
  }, [size]);

  useEffect(() => {
    if (isOpen && referenceElement) {
      refs.setReference(referenceElement);
    }
  }, [isOpen, referenceElement, refs]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={refs.setFloating}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`absolute bg-card text-on-surface rounded-lg shadow-lg p-md ${popupSize} origin-center border border-surface ${className}`}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          <div className="grid">
            <div className="flex justify-end">
              <IconButton
                icon="X"
                size="sm"
                onClick={onClose}
                aria-label="閉じる"
              />
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
