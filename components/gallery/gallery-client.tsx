'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Info } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gallery, galleryFilters } from '@/data/gallery';
import type { GalleryMedia } from '@/types';
import { useLockScroll } from '@/hooks/use-lock-scroll';
import { cn } from '@/lib/utils';

const spans: Record<GalleryMedia['aspect'], string> = {
  portrait: 'row-span-2',
  landscape: '',
  square: 'sm:col-span-2 row-span-2',
};

export function GalleryClient() {
  const [filter, setFilter] = useState<string>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showMeta, setShowMeta] = useState(true);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const reduced = useReducedMotion();
  const touchStart = useRef<number | null>(null);

  const items = useMemo(() => (filter === 'all' ? gallery : gallery.filter((g) => g.category === filter)), [filter]);
  const available = useMemo(() => galleryFilters.filter((f) => f.id === 'all' || gallery.some((g) => g.category === f.id)), []);

  useLockScroll(openIndex !== null);

  const step = useCallback(
    (delta: number) => setOpenIndex((i) => (i === null ? null : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, step]);

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <>
      <div className="no-scrollbar -mx-[var(--shell-x)] mb-8 flex gap-2 overflow-x-auto px-[var(--shell-x)]">
        {available.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setFilter(f.id);
              setOpenIndex(null);
            }}
            aria-pressed={filter === f.id}
            className={cn(
              'shrink-0 whitespace-nowrap border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors',
              filter === f.id ? 'border-gold text-gold' : 'border-line text-mute hover:border-bone/30 hover:text-bone',
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto hidden shrink-0 items-center pl-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute sm:flex">
          {items.length} images
        </span>
      </div>

      <motion.div
        layout
        className="group/wall grid auto-rows-[11rem] grid-cols-2 gap-3 sm:grid-cols-4 md:auto-rows-[13rem] md:gap-4"
        onMouseLeave={() => setCursor(null)}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              layout
              type="button"
              onClick={() => setOpenIndex(i)}
              onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'group relative overflow-hidden border border-line transition-opacity duration-500 focus-visible:z-10 md:group-hover/wall:opacity-45 md:hover:!opacity-100',
                spans[item.aspect],
              )}
              aria-label={`Open ${item.caption}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width:640px) 25vw, 50vw"
                loading={i < 6 ? 'eager' : 'lazy'}
                className="object-cover transition-transform duration-[900ms] ease-rule group-hover:scale-[1.06]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
              <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-gold">{item.category.replace(/-/g, ' ')}</span>
                <span className="mt-1 block font-display text-sm font-bold uppercase tracking-wide text-bone">{item.caption}</span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Desktop cursor label */}
      {cursor && !reduced ? (
        <div
          className="pointer-events-none fixed z-[60] hidden -translate-x-1/2 -translate-y-1/2 border border-gold bg-void/90 px-3 py-1.5 font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-gold backdrop-blur md:block"
          style={{ left: cursor.x, top: cursor.y }}
          aria-hidden
        >
          Open
        </div>
      ) : null}

      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col bg-void/98"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
              touchStart.current = null;
            }}
          >
            <div className="flex items-center justify-between gap-4 border-b border-line/50 px-4 py-3 md:px-6">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-gold">
                {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setShowMeta((s) => !s)} className="grid h-11 w-11 place-items-center text-bone hover:text-gold md:hidden" aria-label="Toggle caption">
                  <Info className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setOpenIndex(null)} className="grid h-11 w-11 place-items-center text-bone hover:text-gold" aria-label="Close viewer">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex-1" onClick={() => setShowMeta((s) => !s)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={active.src} alt={active.alt} fill sizes="100vw" className="object-contain" priority />
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
                className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-line bg-void/70 text-bone backdrop-blur transition-colors hover:border-gold hover:text-gold md:grid"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
                className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center border border-line bg-void/70 text-bone backdrop-blur transition-colors hover:border-gold hover:text-gold md:grid"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <AnimatePresence>
              {showMeta ? (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="border-t border-line/50 px-4 py-4 safe-bottom md:px-6">
                  <p className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-gold">{active.category.replace(/-/g, ' ')}</p>
                  <p className="mt-1 font-display text-base font-bold uppercase tracking-wide text-bone">{active.caption}</p>
                  <ul className="no-scrollbar mt-4 hidden gap-2 overflow-x-auto md:flex">
                    {items.map((thumb, i) => (
                      <li key={thumb.id}>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(i)}
                          className={cn('relative block h-14 w-20 overflow-hidden border transition-colors', i === openIndex ? 'border-gold' : 'border-line opacity-50 hover:opacity-100')}
                          aria-label={`Show ${thumb.caption}`}
                        >
                          <Image src={thumb.src} alt="" fill sizes="80px" className="object-cover" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
