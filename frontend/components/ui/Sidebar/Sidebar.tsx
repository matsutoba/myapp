'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface SidebarItem {
  title: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  isOpen: boolean;
  title?: string;
  items: SidebarItem[];
  onClose: () => void;
  /** true = semi-opaque overlay; false = fully transparent (default) */
  overlayOpaque?: boolean;
}

export function Sidebar({
  isOpen,
  title = 'Menu',
  items,
  onClose,
  overlayOpaque = false,
}: SidebarProps) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');
    container.setAttribute('data-portal', 'sidebar');
    portalRef.current = container;
    document.body.appendChild(container);

    return () => {
      if (portalRef.current && portalRef.current.parentNode) {
        portalRef.current.parentNode.removeChild(portalRef.current);
      }
      portalRef.current = null;
    };
  }, []);

  // Handle focus trap and Esc-to-close when open
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const sidebarEl = sidebarRef.current;

    // focus the first focusable element inside the sidebar, or the sidebar itself
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusFirst = () => {
      if (!sidebarEl) return;
      const first = sidebarEl.querySelector<HTMLElement>(focusableSelector);
      if (first) {
        first.focus();
      } else {
        sidebarEl.focus();
      }
    };

    // small delay to ensure elements are in DOM
    const t = setTimeout(focusFirst, 0);

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      if (!sidebarEl) return;
      const nodes = Array.from(
        sidebarEl.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) {
        e.preventDefault();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }

    document.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      // restore focus
      if (previouslyFocused.current && previouslyFocused.current.focus) {
        previouslyFocused.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const content = (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 ${
            overlayOpaque ? 'bg-black/50' : 'bg-transparent'
          } z-40 transition-opacity`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        role={isOpen ? 'dialog' : undefined}
        aria-modal={isOpen ? true : undefined}
        tabIndex={-1}
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <span className="font-bold text-lg">{title}</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col space-y-1 p-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:bg-gray-700 px-3 py-2 rounded transition-colors flex items-center gap-2"
              onClick={onClose}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );

  if (portalRef.current) {
    return createPortal(content, portalRef.current);
  }

  // Fallback: render inline until portal container is ready
  return content;
}
