import { formatKES } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function Price({
  value,
  from,
  unit,
  className,
}: {
  value?: number;
  from?: boolean;
  unit?: string;
  className?: string;
}) {
  if (typeof value !== 'number') {
    return <span className={cn('font-mono text-sm text-gold-300', className)}>Price on request</span>;
  }
  return (
    <span className={cn('font-mono tabular-nums text-bone', className)}>
      {from ? <span className="mr-1 text-[0.6875rem] uppercase tracking-widest text-mute">from</span> : null}
      {formatKES(value)}
      {unit ? <span className="ml-1 text-[0.6875rem] text-mute">/ {unit}</span> : null}
    </span>
  );
}
