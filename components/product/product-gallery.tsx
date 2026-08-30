'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLockScroll } from '@/hooks/use-lock-scroll';
import { cn } from '@/lib/utils';

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [full, setFull] = useState(false);
  useLockScroll(full);

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFull(false);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [full, step]);

  const current = images[index];

  return (
    <div>
      <div
        className="group relative aspect-[4/3] overflow-hidden border border-line bg-void"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <Image
          src={current}
          alt={`${name} — view ${index + 1} of ${images.length}`}
          fill
          priority
          sizes="(min-width:1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 ease-out"
          style={zoom ? { transform: 'scale(1.7)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
        />
        <button
          type="button"
          onClick={() => setFull(true)}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center border border-line bg-void/80 text-bone backdrop-blur transition-colors hover:border-gold hover:text-gold"
          aria-label="Open full-screen viewer"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        <span className="absolute bottom-3 left-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-bone/70">
          {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </span>
      </div>

      {images.length > 1 ? (
        <ul className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'relative block h-20 w-20 overflow-hidden border transition-colors',
                  i === index ? 'border-gold' : 'border-line hover:border-bone/40',
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <AnimatePresence>
        {full ? (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col bg-void/98"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} image viewer`}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold">
                {name} · {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </p>
              <button type="button" onClick={() => setFull(false)} className="grid h-11 w-11 place-items-center text-bone hover:text-gold" aria-label="Close viewer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={current} alt={`${name} — view ${index + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
            {images.length > 1 ? (
              <div className="flex items-center justify-center gap-6 py-6">
                <button type="button" onClick={() => step(-1)} className="grid h-12 w-12 place-items-center border border-line text-bone hover:border-gold hover:text-gold" aria-label="Previous image">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => step(1)} className="grid h-12 w-12 place-items-center border border-line text-bone hover:border-gold hover:text-gold" aria-label="Next image">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
