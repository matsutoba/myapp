'use client';

import { flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';

interface AnimationPopupProps {
  isOpen: boolean;
  referenceElement: Element | null;
  children?: React.ReactNode;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const AnimationPopup: React.FC<AnimationPopupProps> = ({
  isOpen,
  referenceElement,
  children,
  size = 'medium',
  onClose,
}) => {
  const { x, y, refs, strategy, floatingStyles } = useFloating({
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
          className={`absolute bg-white rounded-2xl shadow-xl p-4 ${popupSize} origin-center border border-gray-100`}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
          }}
        >
          <div className="grid">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="hover:bg-gray-200 rounded-full cursor-pointer p-1"
              >
                <X />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
