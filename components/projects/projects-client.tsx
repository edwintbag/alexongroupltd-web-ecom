'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { projects, projectFilters } from '@/data/projects';
import { cn } from '@/lib/utils';

export function ProjectsClient() {
  const [filter, setFilter] = useState<string>('all');
  const items = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)), [filter]);
  const available = useMemo(
    () => projectFilters.filter((f) => f.id === 'all' || projects.some((p) => p.category === f.id)),
    [],
  );

  return (
    <>
      <div className="no-scrollbar -mx-[var(--shell-x)] mb-8 flex gap-2 overflow-x-auto px-[var(--shell-x)]">
        {available.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              'shrink-0 whitespace-nowrap border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors',
              filter === f.id ? 'border-gold text-gold' : 'border-line text-mute hover:border-bone/30 hover:text-bone',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((project) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/projects/${project.slug}`} className="group flex h-full flex-col border border-line transition-colors hover:border-gold/50">
                <span className="relative block aspect-[4/3] overflow-hidden">
                  <Image src={project.cover} alt={project.name} fill sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-rule group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void to-transparent" />
                  {project.placeholder ? (
                    <span className="absolute left-0 top-0 bg-warning px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-void">
                      Placeholder
                    </span>
                  ) : null}
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="flex items-center gap-3 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-gold">
                    {project.category.replace(/-/g, ' ')}
                    {project.year ? <span className="text-mute">· {project.year}</span> : null}
                  </span>
                  <span className="mt-2 font-display text-xl font-bold uppercase leading-tight tracking-tight text-bone group-hover:text-gold">
                    {project.name}
                  </span>
                  <span className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute">{project.location}</span>
                  <span className="mt-3 line-clamp-2 text-sm leading-relaxed text-mute">{project.summary}</span>
                  <span className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {project.supplied.map((s) => (
                      <span key={s} className="border border-line px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.1em] text-mute">
                        {s}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
