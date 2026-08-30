import { metrics, company } from '@/data/company';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Reveal } from '@/components/ui/reveal';

export function Metrics() {
  return (
    <section className="border-y border-line bg-slate-900/40" aria-label="Company at a glance">
      <div className="shell grid grid-cols-2 divide-x divide-y divide-line/70 sm:divide-y-0 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 0.06} className="px-1 py-8 first:pl-0 sm:px-6 lg:py-10">
            <p className="font-display text-4xl font-bold tabular-nums text-gold md:text-5xl">
              <AnimatedCounter value={metric.value} suffix={metric.suffix} />
            </p>
            <p className="mt-2 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-mute">{metric.label}</p>
          </Reveal>
        ))}
      </div>
      <p className="shell pb-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute/60">
        Figures shown as “—” are awaiting confirmation from {company.shortName}.
      </p>
    </section>
  );
}
