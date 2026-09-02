import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { services, getService } from '@/data/services';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ButtonLink } from '@/components/ui/button';
import { MeasureRule } from '@/components/ui/measure-rule';
import { QuoteCTA } from '@/components/home/quote-cta';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) return {};
  return buildMetadata({ title: service.name, description: service.summary, path: `/services/${service.slug}`, image: service.image });
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src={service.image} alt="" fill sizes="100vw" className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-void/10 to-transparent" />
        <div className="shell relative py-16 md:py-24">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }, { name: service.name, href: `/services/${service.slug}` }]} />
          <p className="eyebrow mb-4">{service.tagline}</p>
          <h1 className="max-w-3xl text-display-lg text-bone">{service.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">{service.summary}</p>
          <ButtonLink href={service.cta.href} size="lg" className="mt-8">
            {service.cta.label}
          </ButtonLink>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div>
            <h2 className="eyebrow mb-5">What this covers</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {service.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 border border-line px-4 py-4 font-display text-sm font-bold uppercase tracking-wide text-bone">
                  <span className="h-1 w-5 shrink-0 bg-gold" aria-hidden />
                  {b}
                </li>
              ))}
            </ul>
            <MeasureRule className="my-10" label={service.name} />
            <p className="max-w-prose text-sm leading-relaxed text-mute">
              This page lists only what the Alexon banner and catalogue confirm for this service line. Detailed capability notes, coverage areas and case studies can be added here once supplied.
            </p>
          </div>

          <aside>
            <h2 className="eyebrow mb-5">Other services</h2>
            <ul className="space-y-1">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link href={`/services/${other.slug}`} className="flex items-baseline justify-between gap-3 border-b border-line py-3 text-sm text-mute transition-colors hover:text-gold">
                    {other.name}
                    <span className="font-mono text-[0.625rem] text-mute/60">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
