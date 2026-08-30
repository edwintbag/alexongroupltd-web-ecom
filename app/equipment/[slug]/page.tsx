import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, MessageCircle, UserCheck } from 'lucide-react';
import { equipment, getEquipment } from '@/data/equipment';
import { ProductGallery } from '@/components/product/product-gallery';
import { BookingForm } from '@/components/equipment/booking-form';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MeasureRule } from '@/components/ui/measure-rule';
import { SectionHeading } from '@/components/ui/section-heading';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { whatsappEnquiry } from '@/lib/whatsapp';
import { formatKES } from '@/lib/utils';

export function generateStaticParams() {
  return equipment.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const item = getEquipment(params.slug);
  if (!item) return {};
  return buildMetadata({ title: `${item.name} hire`, description: item.summary, path: `/equipment/${item.slug}`, image: item.images[0] });
}

export default function EquipmentDetailPage({ params }: { params: { slug: string } }) {
  const item = getEquipment(params.slug);
  if (!item) notFound();

  const others = equipment.filter((e) => e.slug !== item.slug).slice(0, 3);
  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Equipment hire', href: '/equipment' },
    { name: item.name, href: `/equipment/${item.slug}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />

      <section className="shell section">
        <Breadcrumb items={crumbs} />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={item.images} name={item.name} />

          <div>
            <p className="eyebrow">{item.category} · hire</p>
            <h1 className="mt-3 text-display-md text-bone">{item.name}</h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-mute">{item.description}</p>

            <MeasureRule className="my-8" label="Rates" />

            {item.rates.length ? (
              <dl className="grid gap-px bg-line sm:grid-cols-2">
                {item.rates.map((rate) => (
                  <div key={rate.label} className="bg-ink p-5">
                    <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-mute">
                      {rate.label} {rate.note ? <span className="text-mute/60">· {rate.note}</span> : null}
                    </dt>
                    <dd className="mt-2 font-mono text-2xl tabular-nums text-bone">
                      {formatKES(rate.price)}
                      <span className="ml-1.5 text-xs text-mute">{rate.unit}</span>
                    </dd>
                  </div>
                ))}
                {item.operatorAllowance ? (
                  <div className="bg-ink p-5">
                    <dt className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-mute">Operator allowance</dt>
                    <dd className="mt-2 font-mono text-2xl tabular-nums text-bone">{formatKES(item.operatorAllowance)}</dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="border border-line p-5 font-mono text-lg text-gold-300">
                Quoted per job — the rate depends on the machine, the route and the distance.
              </p>
            )}

            {item.operatorIncluded ? (
              <p className="mt-5 flex items-center gap-3 text-sm text-mute">
                <UserCheck className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                Supplied with a skilled Alexon operator.
              </p>
            ) : null}

            {item.todo ? (
              <p className="mt-6 flex gap-3 border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-warning">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <strong className="font-display uppercase tracking-wide">To confirm — </strong>
                  {item.todo}
                </span>
              </p>
            ) : null}

            <div className="mt-8">
              <h2 className="eyebrow mb-4">What it is used for</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {item.applications.map((app) => (
                  <li key={app} className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-bone">
                    <span className="h-1 w-4 shrink-0 bg-gold" aria-hidden />
                    {app}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={whatsappEnquiry({ name: `${item.name} hire`, path: `/equipment/${item.slug}` })}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex h-12 items-center gap-2 border border-success/45 px-6 font-display text-xs font-bold uppercase tracking-[0.08em] text-success transition-colors hover:bg-success hover:text-void"
            >
              <MessageCircle className="h-4 w-4" />
              Check availability on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-16 max-w-3xl">
          <BookingForm item={item} />
        </div>

        {others.length ? (
          <div className="mt-20">
            <SectionHeading eyebrow="Also available" title="Other plant and fleet" />
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {others.map((other) => (
                <li key={other.id}>
                  <Link href={`/equipment/${other.slug}`} className="group block border border-line p-5 transition-colors hover:border-gold/50">
                    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-gold">{other.category}</span>
                    <span className="mt-1.5 block font-display text-lg font-bold uppercase text-bone group-hover:text-gold">{other.name}</span>
                    <span className="mt-2 block line-clamp-2 text-sm text-mute">{other.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </>
  );
}
