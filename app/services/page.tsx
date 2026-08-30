import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/data/services';
import { PageHero } from '@/components/ui/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { QuoteCTA } from '@/components/home/quote-cta';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'Concrete products, construction, machine hire, clean water supply and logistics from Alexon Group Ltd in Ugunja, Siaya County.',
  path: '/services',
  image: '/images/site/production-line.jpg',
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Five service lines, one yard."
        lede="Most projects juggle three or four suppliers. Alexon carries materials, construction, plant, water and haulage from a single site on the Kisumu–Busia highway."
        image="/images/site/production-line.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]}
      />

      <section className="section">
        <div className="shell space-y-4">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <Link
                href={`/services/${service.slug}`}
                className={`group grid border border-line transition-colors hover:border-gold/50 lg:grid-cols-2 ${i % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}
              >
                <span className="relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                  <Image src={service.image} alt={service.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-rule group-hover:scale-105" />
                </span>
                <span className="flex flex-col justify-center p-8 md:p-12">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-gold">
                    {String(i + 1).padStart(2, '0')} — {service.tagline}
                  </span>
                  <span className="mt-3 flex items-center gap-3 font-display text-3xl font-bold uppercase tracking-tight text-bone group-hover:text-gold md:text-4xl">
                    {service.name}
                    <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
                  </span>
                  <span className="mt-4 max-w-md text-base leading-relaxed text-mute">{service.summary}</span>
                  <span className="mt-6 flex flex-wrap gap-2">
                    {service.bullets.map((b) => (
                      <span key={b} className="border border-line px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
                        {b}
                      </span>
                    ))}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
