import Image from 'next/image';
import Link from 'next/link';
import { equipment } from '@/data/equipment';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { formatKES } from '@/lib/utils';

export function EquipmentShowcase() {
  return (
    <section className="section border-y border-line bg-slate-900/30">
      <div className="shell">
        <SectionHeading
          eyebrow="Plant & fleet"
          title="Hire the machine and the operator together"
          lede="Charged by the hour, so a two-day footing job is not billed like a two-week one. Operator allowance is quoted separately where it applies."
          action={<ButtonLink href="/equipment" variant="outline">All equipment</ButtonLink>}
        />

        <ul className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
          {equipment.map((item) => {
            const rate = item.rates[0];
            return (
              <li key={item.id} className="w-[78vw] shrink-0 snap-start sm:w-[48vw] lg:w-auto">
                <Link href={`/equipment/${item.slug}`} className="group flex h-full flex-col border border-line bg-void transition-colors hover:border-gold/50">
                  <span className="relative block aspect-[16/10] overflow-hidden">
                    <Image src={item.images[0]} alt={item.name} fill sizes="(min-width:1024px) 33vw, 78vw" className="object-cover transition-transform duration-700 ease-rule group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void to-transparent" />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-gold">{item.category}</span>
                    <span className="mt-1.5 font-display text-xl font-bold uppercase tracking-tight text-bone transition-colors group-hover:text-gold">{item.name}</span>
                    <span className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">{item.summary}</span>
                    <span className="mt-auto flex items-baseline justify-between gap-3 border-t border-line pt-4">
                      {rate ? (
                        <span className="font-mono text-sm tabular-nums text-bone">
                          {formatKES(rate.price)}
                          <span className="ml-1 text-[0.625rem] text-mute">{rate.unit}</span>
                        </span>
                      ) : (
                        <span className="font-mono text-sm text-gold-300">Quoted per job</span>
                      )}
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-gold">Request →</span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
