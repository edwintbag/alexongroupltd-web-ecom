'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { categories } from '@/data/categories';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Desktop: hovering a category swaps the large plate on the right. Mobile: a swipeable rail. */
export function CategoryShowcase() {
  const [active, setActive] = useState(0);
  const current = categories[active];

  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="The catalogue"
          title="Everything cast, stacked and ready in Ugunja"
          lede="Eleven product lines pressed and cured at our own yard, priced by the piece and loaded onto our own fleet."
          action={<ButtonLink href="/shop" variant="outline">View all products</ButtonLink>}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <ul className="hidden lg:block">
            {categories.map((category, i) => (
              <li key={category.slug}>
                <Link
                  href={`/shop?category=${category.slug}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={cn(
                    'group flex items-center gap-5 border-b border-line py-4 transition-colors',
                    i === active && 'border-gold',
                  )}
                >
                  <span className="font-mono text-[0.625rem] tabular-nums text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">
                    <span
                      className={cn(
                        'block font-display text-xl font-bold uppercase tracking-tight transition-colors md:text-2xl',
                        i === active ? 'text-gold' : 'text-bone/70 group-hover:text-bone',
                      )}
                    >
                      {category.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-mute">{category.tagline}</span>
                  </span>
                  <ArrowUpRight
                    className={cn('h-4 w-4 shrink-0 transition-all', i === active ? 'text-gold' : 'text-mute/40')}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative hidden aspect-[4/5] overflow-hidden border border-line lg:block lg:sticky lg:top-28">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.slug}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image src={current.image} alt={current.name} fill sizes="(min-width:1024px) 46vw, 100vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="font-display text-2xl font-bold uppercase text-bone">{current.name}</p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-bone/70">{current.description}</p>
            </div>
          </div>

          {/* Mobile rail */}
          <ul className="no-scrollbar -mx-[var(--shell-x)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--shell-x)] pb-2 lg:hidden">
            {categories.map((category) => (
              <li key={category.slug} className="w-[68vw] shrink-0 snap-start sm:w-[44vw]">
                <Link href={`/shop?category=${category.slug}`} className="group block">
                  <span className="relative block aspect-[4/5] overflow-hidden border border-line">
                    <Image src={category.image} alt="" fill sizes="68vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                  </span>
                  <span className="mt-3 block font-display text-sm font-bold uppercase tracking-wide text-bone">{category.name}</span>
                  <span className="mt-0.5 block text-xs text-mute">{category.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
