'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { projectJourney } from '@/data/services';
import { cn } from '@/lib/utils';

/**
 * Sticky scroll sequence. The five stages are a real sequence — the order a
 * project actually runs in — which is why they are numbered.
 * Mobile collapses to a plain vertical list rather than faking sticky behaviour.
 */
export function ProjectJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    // Only touch React state when the stage actually changes — this fires on
    // every scroll frame otherwise.
    let last = -1;
    return scrollYProgress.on('change', (v) => {
      const next = Math.min(projectJourney.length - 1, Math.floor(v * projectJourney.length));
      if (next !== last) {
        last = next;
        setIndex(next);
      }
    });
  }, [scrollYProgress]);

  const active = projectJourney[index];

  return (
    <section className="relative border-y border-line bg-slate-900/30">
      {/* Desktop: sticky sequence */}
      <div ref={containerRef} className="hidden lg:block" style={{ height: `${projectJourney.length * 90}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="shell grid w-full gap-16 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-gold" aria-hidden />
                Everything your project needs
              </p>
              <h2 className="max-w-lg text-display-md text-bone">One supplier, from the first load to the last channel.</h2>

              <ol className="mt-12 space-y-1">
                {projectJourney.map((stage, i) => (
                  <li key={stage.step}>
                    <Link
                      href={stage.href}
                      className={cn(
                        'flex items-baseline gap-5 border-b border-line py-4 transition-all duration-500',
                        i === index ? 'border-gold' : 'opacity-45 hover:opacity-80',
                      )}
                    >
                      <span className="font-mono text-xs tabular-nums text-gold">{stage.step}</span>
                      <span className="flex-1">
                        <span className="block font-display text-2xl font-bold uppercase text-bone">{stage.title}</span>
                        <motion.span
                          className="block text-sm text-mute"
                          animate={{ height: i === index ? 'auto' : 0, opacity: i === index ? 1 : 0 }}
                          initial={false}
                          style={{ overflow: 'hidden' }}
                        >
                          <span className="block pt-1">{stage.body}</span>
                        </motion.span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>

              <div className="mt-10 flex items-center gap-4" aria-hidden>
                <div className="relative h-px flex-1 bg-line">
                  <motion.div className="absolute inset-y-0 left-0 origin-left bg-gold" style={{ scaleX: reduced ? 1 : progressScale, width: '100%' }} />
                </div>
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
                  {String(index + 1).padStart(2, '0')} / {String(projectJourney.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden border border-line">
              {projectJourney.map((stage, i) => (
                <motion.div
                  key={stage.step}
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0, scale: i === index ? 1 : 1.05 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={stage.image} alt={stage.title} fill sizes="46vw" className="object-cover" />
                </motion.div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
              <p className="absolute bottom-6 left-6 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-gold">
                {active.step} — {active.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: plain vertical sequence */}
      <div className="shell section lg:hidden">
        <p className="eyebrow mb-5">Everything your project needs</p>
        <h2 className="text-display-sm text-bone">One supplier, from the first load to the last channel.</h2>
        <ol className="mt-10 space-y-8">
          {projectJourney.map((stage) => (
            <li key={stage.step}>
              <Link href={stage.href} className="block">
                <span className="relative block aspect-[16/10] overflow-hidden border border-line">
                  <Image src={stage.image} alt="" fill sizes="100vw" className="object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[0.625rem] tracking-[0.2em] text-gold">{stage.step}</span>
                </span>
                <span className="mt-4 block font-display text-xl font-bold uppercase text-bone">{stage.title}</span>
                <span className="mt-1 block text-sm text-mute">{stage.body}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
