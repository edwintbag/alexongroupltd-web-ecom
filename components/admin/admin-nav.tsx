'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/admin', label: 'Quotes', key: 'quotes' },
  { href: '/admin/orders', label: 'Orders', key: 'orders' },
  { href: '/admin/bookings', label: 'Equipment', key: 'bookings' },
  { href: '/admin/applications', label: 'Applications', key: 'applications' },
  { href: '/admin/enquiries', label: 'Enquiries', key: 'enquiries' },
] as const;

export function AdminNav({ counts }: { counts: Record<string, number> }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <nav className="no-scrollbar flex gap-1 overflow-x-auto" aria-label="Admin sections">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const count = counts[tab.key] ?? 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex shrink-0 items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 font-display text-[0.6875rem] font-bold uppercase tracking-[0.1em] transition-colors',
                active ? 'border-gold text-gold' : 'border-transparent text-mute hover:text-bone',
              )}
            >
              {tab.label}
              {count > 0 ? (
                <span className="grid h-4 min-w-4 place-items-center bg-clay px-1 font-mono text-[0.5625rem] tabular-nums text-bone">
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={signOut}
        className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute transition-colors hover:text-gold"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sign out
      </button>
    </div>
  );
}
