'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

interface Entry {
  label: string;
  href: string;
  image: string;
  tagline: string;
}

export function MegaPanel({
  entries,
  title,
  footerHref,
  footerLabel,
  onNavigate,
}: {
  entries: Entry[];
  title: string;
  footerHref: string;
  footerLabel: string;
  onNavigate: () => void;
}) {
  const [active, setActive] = useState(0);
  const preview = entries[active];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-x-0 top-full border-y border-line bg-ink"
    >
      <div className="shell grid gap-10 py-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="eyebrow mb-6">{title}</p>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
            {entries.map((entry, i) => (
              <li key={entry.href}>
                <Link
                  href={entry.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={onNavigate}
                  className="group flex items-baseline justify-between gap-3 border-b border-line/60 py-3 transition-colors hover:border-gold"
                >
                  <span className="font-display text-sm font-bold uppercase tracking-[0.06em] text-bone transition-colors group-hover:text-gold">
                    {entry.label}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-mute opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={footerHref}
            onClick={onNavigate}
            className="mt-8 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-300"
          >
            {footerLabel}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden border border-line lg:block">
          {preview ? (
            <>
              <Image
                key={preview.image}
                src={preview.image}
                alt=""
                fill
                sizes="22rem"
                className="animate-fade-up object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="font-display text-base font-bold uppercase tracking-wide text-bone">{preview.label}</p>
                <p className="mt-1 line-clamp-2 text-xs text-mute">{preview.tagline}</p>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
