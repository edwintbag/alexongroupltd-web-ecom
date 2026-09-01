'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { company } from '@/data/company';

/**
 * Cinematic hero. Frames cross-dissolve with a slow scale so there are no
 * arrows sitting on the image; the only visible control is the frame index,
 * set as a measurement readout to match the rest of the site.
 */
const frames = [
    { src: '/images/site/fleet.jpg', label: 'The fleet', alt: 'Alexon water bowser, tipper, lorry and two JCB backhoes lined up at the yard with the team' },
  { src: '/images/site/hero-backhoe.jpg', label: 'Plant & machinery', alt: 'Alexon backhoe loader working on a site' },
  { src: '/images/site/block1.JPG', label: 'The block line', alt: 'Concrete blocks being pressed at the Alexon yard' },
  { src: '/images/site/construction1.jpg', label: 'Construction', alt: 'Masons building blockwork columns on site' },
  { src: '/images/site/tipper-fllet.jpg', label: 'Logistics', alt: 'Alexon tipper truck ready to load' },
  { src: '/images/site/construction.jpg', label: 'Construction', alt: 'Masons building blockwork columns on site' },
  { src: '/images/site/site-masonry.jpg', label: 'Construction', alt: 'Masons building blockwork columns on site' },
  { src: '/images/site/alexon5.JPG', label: 'Construction', alt: 'Masons building blockwork columns on site' },
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % frames.length), 6000);
    return () => clearInterval(timer);
  }, [reduced]);

  const frame = frames[index];

  return (
    <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={frame.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: reduced ? 1 : 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 7, ease: 'linear' } }}
          >
            <Image src={frame.src} alt={frame.alt} fill priority={index === 0} sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/75 to-void/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/85 via-transparent to-transparent" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="shell pb-14 pt-28 md:pb-20 md:pt-32">
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block h-px w-10 bg-gold" aria-hidden />
          {company.values}
        </motion.p>

        <h1 className="max-w-[16ch] text-display-xl font-bold text-bone">
          {['Your Ever Ready', 'Construction', 'Partner.'].map((line, i) => (
            <motion.span
              key={line}
              className="block overflow-hidden"
              initial={{ opacity: 0, y: '55%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              {i === 2 ? (
                <>
                  Partner<span className="text-gold">.</span>
                </>
              ) : (
                line
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="mt-7 max-w-xl text-base leading-relaxed text-bone/75 md:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
        >
          {company.intro}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
        >
          <ButtonLink href="/shop" size="lg">
            Shop products
          </ButtonLink>
          <ButtonLink href="/request-quote" variant="outline" size="lg">
            Request a quote
          </ButtonLink>
          <ButtonLink href="/services" variant="ghost" size="lg">
            Explore our services
          </ButtonLink>
        </motion.div>
      </div>

      {/* Frame readout, drawn as a measurement scale rather than a carousel control */}
      <div className="shell relative z-10 border-t border-line/60 pb-6 pt-4">
        <div className="flex items-end justify-between gap-6">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {frames.map((f, i) => (
              <li key={f.src}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${f.label}`}
                  aria-current={i === index}
                  className="group flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] transition-colors"
                >
                  <span className={i === index ? 'text-gold' : 'text-mute/60 group-hover:text-mute'}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={i === index ? 'text-bone' : 'text-mute/60 group-hover:text-mute'}>{f.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute sm:block">
            {company.address.full}
          </span>
        </div>
      </div>
    </section>
  );
}
