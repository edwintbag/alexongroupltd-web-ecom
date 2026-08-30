import { cn } from '@/lib/utils';

export function EmptyState({
  icon,
  title,
  body,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  body: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col items-center border border-line px-6 py-16 text-center', className)}>
      {icon ? <div className="mb-6 text-gold/70">{icon}</div> : null}
      <h3 className="text-display-sm text-bone">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">{body}</p>
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  );
}
