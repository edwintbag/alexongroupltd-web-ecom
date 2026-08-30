'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { searchSite, type SearchResult } from '@/lib/search';
import { useLockScroll } from '@/hooks/use-lock-scroll';
import { cn } from '@/lib/utils';

const RECENT_KEY = 'alexon-recent-searches';

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  useLockScroll(open);

  const results = useMemo(() => searchSite(query), [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setCursor(0);
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]'));
    } catch {
      setRecent([]);
    }
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  const go = (result: SearchResult) => {
    const next = [result.title, ...recent.filter((r) => r !== result.title)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    onClose();
    router.push(result.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => (c + 1) % results.length);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % results.length);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[cursor];
      if (target) go(target);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[105]" role="dialog" aria-modal="true" aria-label="Search">
          <motion.div className="absolute inset-0 bg-void/85 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 mx-auto flex h-full w-full max-w-2xl flex-col border-line bg-ink sm:top-[8vh] sm:h-auto sm:max-h-[76vh] sm:border sm:shadow-panel"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="h-4.5 w-4.5 shrink-0 text-gold" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCursor(0);
                }}
                placeholder="Search products, equipment, services…"
                aria-label="Search products, equipment and services"
                className="w-full bg-transparent text-base text-bone outline-none placeholder:text-mute/70"
              />
              <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center text-mute hover:text-gold" aria-label="Close search">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {query.length < 2 ? (
                <div className="px-5 py-6">
                  {recent.length ? (
                    <>
                      <p className="eyebrow mb-3">Recent</p>
                      <ul className="space-y-1">
                        {recent.map((r) => (
                          <li key={r}>
                            <button type="button" onClick={() => setQuery(r)} className="text-sm text-mute transition-colors hover:text-gold">
                              {r}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="text-sm text-mute">
                      Try <span className="font-mono text-gold">cabros</span>, <span className="font-mono text-gold">excavator</span> or{' '}
                      <span className="font-mono text-gold">fencing poles</span>.
                    </p>
                  )}
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="font-display text-lg text-bone">Nothing matched “{query}”</p>
                  <p className="mt-2 text-sm text-mute">Check the spelling, or ask us directly — we quote anything we do not stock.</p>
                </div>
              ) : (
                <ul role="listbox" aria-label="Search results">
                  {results.map((result, i) => (
                    <li key={result.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={i === cursor}
                        onMouseEnter={() => setCursor(i)}
                        onClick={() => go(result)}
                        className={cn(
                          'flex w-full items-center gap-4 border-b border-line/50 px-5 py-3 text-left transition-colors',
                          i === cursor ? 'bg-slate-800' : 'hover:bg-slate-900',
                        )}
                      >
                        {result.image ? (
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden border border-line">
                            <Image src={result.image} alt="" fill sizes="44px" className="object-cover" />
                          </span>
                        ) : null}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-sm font-bold uppercase tracking-wide text-bone">{result.title}</span>
                          <span className="block truncate text-xs text-mute">{result.subtitle}</span>
                        </span>
                        <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-gold">{result.kind}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="hidden items-center gap-4 border-t border-line px-5 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute sm:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="border border-line px-1.5 py-0.5">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="border border-line px-1.5 py-0.5">
                  <CornerDownLeft className="h-2.5 w-2.5" />
                </kbd>
                open
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="border border-line px-1.5 py-0.5">esc</kbd> close
              </span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
