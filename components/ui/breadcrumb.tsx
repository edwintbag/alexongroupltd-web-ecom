import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {last ? (
                <span className="text-gold" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="transition-colors hover:text-bone">
                  {item.name}
                </Link>
              )}
              {!last ? <ChevronRight className="h-3 w-3 text-mute/50" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
