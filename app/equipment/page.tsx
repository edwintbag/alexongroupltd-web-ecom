import Image from 'next/image';
import Link from 'next/link';
import { equipment } from '@/data/equipment';
import { PageHero } from '@/components/ui/page-hero';
import { Reveal } from '@/components/ui/reveal';
import { MeasureRule } from '@/components/ui/measure-rule';
import { buildMetadata } from '@/lib/seo';
import { formatKES } from '@/lib/utils';

export const metadata = buildMetadata({
  title: 'Equipment hire',
  description:
    'Hire excavators, backhoes, graders, tippers, a lowbed trailer and clean water bowsers from Alexon Group Ltd, with skilled operators and catalogue hourly rates.',
  path: '/equipment',
  image: '/images/equipment/excavator.jpg',
});

export default function EquipmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Plant & fleet"
        title="Hire the machine and the operator together."
        lede="Rates are charged by the hour where the catalogue prints an hourly rate, and quoted per job where the cost depends on distance or load. Operator allowance is shown separately."
        image="/images/equipment/excavator.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Equipment hire', href: '/equipment' }]}
      />
      <section className="pt-[var(--space-section)]">
        <div className="shell">
          <div className="relative aspect-[3/2] overflow-hidden border border-line sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image
              src="/images/site/fleet.jpg"
              alt="Alexon water bowser, tipper, lorry and two JCB backhoes lined up at the yard"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent" />
            <p className="absolute bottom-5 left-5 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-gold">
              Plant, haulage and water — all Alexon-owned
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell space-y-4">
          {equipment.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.04}>
              <Link
                href={`/equipment/${item.slug}`}
                className="group grid gap-0 border border-line transition-colors hover:border-gold/50 md:grid-cols-[20rem_1fr]"
              >
                <span className="relative block aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[15rem]">
                  <Image src={item.images[0]} alt={item.name} fill sizes="(min-width:768px) 20rem, 100vw" className="object-cover transition-transform duration-700 ease-rule group-hover:scale-105" />
                </span>

                <span className="flex flex-col justify-between gap-6 p-6 md:p-8">
                  <span>
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[0.625rem] tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-mute">{item.category}</span>
                    </span>
                    <span className="mt-2 block font-display text-2xl font-bold uppercase tracking-tight text-bone transition-colors group-hover:text-gold md:text-3xl">
                      {item.name}
                    </span>
                    <span className="mt-3 block max-w-2xl text-sm leading-relaxed text-mute">{item.summary}</span>
                  </span>

                  <span>
                    <MeasureRule className="mb-4" />
                    <span className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
                      {item.rates.length ? (
                        item.rates.map((rate) => (
                          <span key={rate.label}>
                            <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-mute">{rate.label}</span>
                            <span className="font-mono text-lg tabular-nums text-bone">
                              {formatKES(rate.price)}
                              <span className="ml-1 text-[0.625rem] text-mute">{rate.unit}</span>
                            </span>
                          </span>
                        ))
                      ) : (
                        <span className="font-mono text-lg text-gold-300">Quoted per job</span>
                      )}
                      {item.operatorAllowance ? (
                        <span>
                          <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-mute">Operator allowance</span>
                          <span className="font-mono text-lg tabular-nums text-bone">{formatKES(item.operatorAllowance)}</span>
                        </span>
                      ) : null}
                      <span className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.16em] text-gold">Request this machine →</span>
                    </span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
