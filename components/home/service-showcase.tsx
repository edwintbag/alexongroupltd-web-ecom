import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/data/services';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

export function ServiceShowcase() {
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Five service lines"
          title="Alexon is a supplier, a builder and a fleet"
          lede="Most projects need three or four suppliers. Alexon carries all five lines from one yard on the Kisumu–Busia highway."
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 0.06}
              className={i === 0 ? 'md:col-span-2 xl:col-span-2' : undefined}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group relative flex h-full min-h-[19rem] flex-col justify-end overflow-hidden border border-line p-6 transition-colors hover:border-gold/60"
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-rule group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10" />
                <span className="relative">
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-gold">
                    {String(i + 1).padStart(2, '0')} — {service.tagline}
                  </span>
                  <span className="mt-2 flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-tight text-bone">
                    {service.name}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                  </span>
                  <span className="mt-2 block max-w-md text-sm leading-relaxed text-bone/70">{service.summary}</span>
                  <span className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
                    {service.bullets.map((b) => (
                      <span key={b}>{b}</span>
                    ))}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
