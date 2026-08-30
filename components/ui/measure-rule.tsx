import { cn } from '@/lib/utils';

/**
 * The site's signature device. Alexon prices everything by dimension,
 * so section breaks are drawn as a measuring rule rather than a plain line.
 */
export function MeasureRule({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex items-end gap-4', className)} aria-hidden>
      <div className="rule-ticks-lg flex-1" />
      {label ? <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-mute">{label}</span> : null}
    </div>
  );
}

/** Dimension callout with extension lines, as on a technical drawing. */
export function DimCallout({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('dim-callout', className)}>{children}</span>;
}
