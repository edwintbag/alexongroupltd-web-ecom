import { Truck, MapPin, PackageCheck, Scale } from 'lucide-react';
import { PageHero } from '@/components/ui/page-hero';
import { ButtonLink } from '@/components/ui/button';
import { MeasureRule } from '@/components/ui/measure-rule';
import { company } from '@/data/company';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Delivery',
  description:
    'How Alexon Group Ltd delivers construction materials — pickup from Ugunja, local delivery, site delivery and quoted haulage.',
  path: '/delivery',
  image: '/images/site/tipper-fleet.jpg',
});

const options = [
  {
    icon: PackageCheck,
    title: 'Pick up from the yard',
    body: 'Collect from Ugunja on the Kisumu–Busia highway. No haulage charge — you bring the vehicle and we load it.',
  },
  {
    icon: MapPin,
    title: 'Local delivery',
    body: 'Short runs around Ugunja on our own tippers, lorries and pick-ups. Cost depends on the load size and the vehicle needed.',
  },
  {
    icon: Truck,
    title: 'Site delivery',
    body: 'Materials taken straight to a live site. We ask for a landmark or pinned location because access matters as much as distance.',
  },
  {
    icon: Scale,
    title: 'Quoted haulage',
    body: 'Bulk aggregates, plant moves on the lowbed and long-distance runs are priced per job against the route and the load.',
  },
];

const factors = ['Your location and the route', 'Quantity ordered', 'Product weight', 'Vehicle required', 'Site access and offloading'];

export default function DeliveryPage() {
  return (
    <>
      <PageHero
        eyebrow="Delivery"
        title="Heavy materials need a real delivery answer."
        lede="There is no flat shipping rate on this site, because there is no honest flat rate for concrete. Here is how it actually works."
        image="/images/site/tipper-fleet.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Delivery', href: '/delivery' }]}
      />

      <section className="section">
        <div className="shell">
          <ul className="grid gap-px bg-line sm:grid-cols-2">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <li key={option.title} className="bg-ink p-8">
                  <Icon className="h-5 w-5 text-gold" aria-hidden />
                  <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-bone">{option.title}</h2>
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-mute">{option.body}</p>
                </li>
              );
            })}
          </ul>

          <MeasureRule className="my-14" label="What sets the price" />

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="eyebrow mb-5">Delivery cost depends on</h2>
              <ul className="space-y-2">
                {factors.map((f) => (
                  <li key={f} className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-bone">
                    <span className="h-1 w-4 shrink-0 bg-gold" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow mb-5">Getting a delivery price</h2>
              <p className="max-w-prose text-sm leading-relaxed text-mute">
                Add what you need to the cart or the quote basket and send it through with your location. We come back with the
                haulage cost before you pay anything, so you are never guessing at the total.
              </p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-mute">
                For anything urgent, call {company.phones[0]} — the fleet is dispatched from the same yard the materials come from.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/request-quote">Request a delivery quote</ButtonLink>
                <ButtonLink href="/shop" variant="outline">Back to the shop</ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
