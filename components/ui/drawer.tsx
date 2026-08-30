'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useLockScroll } from '@/hooks/use-lock-scroll';
import { cn } from '@/lib/utils';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  side?: 'right' | 'left' | 'bottom';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function Drawer({ open, onClose, title, side = 'right', children, footer, className }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useLockScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector<HTMLElement>('button, a, input')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const offscreen = side === 'right' ? { x: '100%' } : side === 'left' ? { x: '-100%' } : { y: '100%' };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={{ type: 'tween', duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'absolute flex flex-col bg-ink shadow-panel',
              side === 'right' && 'right-0 top-0 h-full w-full max-w-md border-l border-line',
              side === 'left' && 'left-0 top-0 h-full w-full max-w-sm border-r border-line',
              side === 'bottom' && 'bottom-0 left-0 w-full max-h-[85vh] rounded-t-lg border-t border-line',
              className,
            )}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-bone">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 place-items-center text-mute transition-colors hover:text-gold"
                aria-label={`Close ${title.toLowerCase()}`}
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer ? <div className="border-t border-line bg-slate-900/60 p-5 safe-bottom">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
