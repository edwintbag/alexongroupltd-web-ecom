import Image from 'next/image';
import { company } from '@/data/company';
import { services } from '@/data/services';
import { PageHero } from '@/components/ui/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { MeasureRule } from '@/components/ui/measure-rule';
import { QuoteCTA } from '@/components/home/quote-cta';
import { ButtonLink } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Alexon Group Ltd is a construction, materials, plant and logistics company based at Ugunja on the Kisumu–Busia highway in Siaya County, Kenya.',
  path: '/about',
  image: '/images/site/alexon-yard.jpg',
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Alexon"
        title="Built on trust means one yard answers for all of it."
        image="/images/site/alexon-yard.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }]}
      />

      {/* Opening statement — editorial, no card grid */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <p className="max-w-4xl text-display-sm leading-tight text-bone">
              A construction project fails at the joins. The blocks arrive late, the excavator comes without an operator,
              the water truck belongs to someone else and nobody answers for the delay. Alexon exists to remove those joins.
            </p>
          </Reveal>
          <MeasureRule className="my-14" label="Ugunja · Siaya County" />
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <Reveal>
              <div className="space-y-5 text-base leading-relaxed text-mute">
                <p>
                  {company.legalName} operates from a yard at Ugunja on the Kisumu–Busia highway. What leaves the gate is made
                  there: blocks and cabros pressed on our own line, culverts and coping cured in our own yard, spindles and
                  column tops cast on site.
                </p>
                <p>
                  The same company hires out the excavators, backhoes and graders, runs the tippers and the lowbed, and delivers
                  clean water by bowser. That is the whole proposition — <span className="text-bone">{company.positioning}</span>
                </p>
                <p>
                  It also means a single phone number for the material, the machine and the delivery, and a single company
                  accountable when a date slips.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="relative aspect-[4/5] overflow-hidden border border-line">
                <Image src="/images/site/production-line.jpg" alt="The Alexon block-making line in operation" fill sizes="(min-width:1024px) 38vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
                <p className="absolute bottom-5 left-5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-gold">The block line</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Business verticals */}
      <section className="section border-y border-line bg-slate-900/30">
        <div className="shell">
          <p className="eyebrow mb-5">The ecosystem</p>
          <h2 className="max-w-2xl text-display-md text-bone">Five businesses that only make sense together.</h2>
          <ul className="mt-12 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-5">
            {services.map((service, i) => (
              <li key={service.slug} className="bg-ink p-6">
                <span className="font-mono text-[0.625rem] tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-lg font-bold uppercase leading-tight tracking-tight text-bone">{service.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mute">{service.tagline}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[16/11] overflow-hidden border border-line">
              <Image src="/images/site/site-masonry.jpg" alt="Alexon masons working on a residential build" fill sizes="(min-width:1024px) 48vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <p className="eyebrow mb-5">Our commitment</p>
            <h2 className="text-display-md text-bone">Quality is what survives the rain.</h2>
            <p className="mt-5 max-w-prose text-base leading-relaxed text-mute">
              Precast work is judged years later — by whether the coping kept the wall dry, whether the culvert held under load,
              whether the cabros are still level after two wet seasons. Blocks are pressed and cured properly because the
              alternative shows up long after the invoice is paid.
            </p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-mute">
              {company.tagline}.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/shop">See the catalogue</ButtonLink>
              <ButtonLink href="/contact" variant="outline">Talk to us</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
