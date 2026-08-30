import Image from 'next/image';
import { MeasureRule } from '@/components/ui/measure-rule';
import { Reveal } from '@/components/ui/reveal';

const reasons = [
  {
    title: 'We make what we sell',
    body: 'Blocks, cabros, culverts and coping are pressed and cured at our own yard. No middleman markup, and no waiting on someone else’s production run.',
  },
  {
    title: 'We move it ourselves',
    body: 'Tippers, lorries, pick-ups and a lowbed. Your delivery is not subcontracted to whoever is available that week.',
  },
  {
    title: 'Plant comes with people',
    body: 'Excavators, backhoes and graders are hired with skilled operators, so the machine arrives ready to work.',
  },
  {
    title: 'Water on the same call',
    body: 'Curing water, mixing water and dust suppression are delivered by our own bowsers — one supplier, one phone number.',
  },
];

export function WhyAlexon() {
  return (
    <section className="section border-y border-line bg-slate-900/30">
      <div className="shell grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden border border-line">
            <Image src="/images/site/alexon-yard.jpg" alt="The Alexon yard at Ugunja on the Kisumu–Busia highway" fill sizes="(min-width:1024px) 44vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-gold">
              Ugunja · Kisumu–Busia Highway
            </p>
          </div>
        </Reveal>

        <div>
          <p className="eyebrow mb-5">Why Alexon</p>
          <h2 className="max-w-xl text-display-md text-bone">
            Built on trust means the same yard answers for the material, the machine and the delivery.
          </h2>
          <MeasureRule className="mt-9" />
          <dl className="mt-9 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {reasons.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 0.06}>
                <dt className="flex items-baseline gap-3 font-display text-base font-bold uppercase tracking-tight text-bone">
                  <span className="font-mono text-[0.625rem] font-normal text-gold">{String(i + 1).padStart(2, '0')}</span>
                  {reason.title}
                </dt>
                <dd className="mt-2 pl-8 text-sm leading-relaxed text-mute">{reason.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
