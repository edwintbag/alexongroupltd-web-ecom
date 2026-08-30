import { cn } from '@/lib/utils';

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: string;
  align?: 'left' | 'center';
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, lede, align = 'left', className, action }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gold" aria-hidden />
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-display-md text-bone">{title}</h2>
        {lede ? <p className="mt-5 max-w-prose text-base leading-relaxed text-mute">{lede}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
