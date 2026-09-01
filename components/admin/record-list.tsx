'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown, FileText, Mail, Phone } from 'lucide-react';
import { cn, formatKES } from '@/lib/utils';

const STATUSES = ['new', 'in-progress', 'quoted', 'won', 'closed'] as const;

const statusColour: Record<string, string> = {
  new: 'border-clay text-clay-400',
  'in-progress': 'border-gold text-gold',
  quoted: 'border-gold/50 text-gold/80',
  won: 'border-success text-success',
  closed: 'border-line text-mute',
};

/**
 * Plain data only.
 *
 * The server components flatten each database row into this shape before
 * passing it across the boundary — functions can't be serialized from a
 * server component to a client one, so all the shaping happens server-side.
 */
export interface AdminItem {
  name: string;
  variant?: string;
  quantity: number;
  unitPrice?: number;
}

export interface AdminRecord {
  id: string;
  createdAt: string;
  status: string;
  title: string;
  reference?: string | null;
  phone?: string | null;
  email?: string | null;
  /** [label, value] pairs, already filtered and formatted. */
  details: [string, string][];
  items?: AdminItem[];
  cvPath?: string | null;
}

export function RecordList({
  table,
  records,
  emptyMessage,
}: {
  table: string;
  records: AdminRecord[];
  emptyMessage: string;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const router = useRouter();

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      await fetch('/api/admin/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id, status }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  };

  if (!records.length) {
    return (
      <div className="border border-line px-6 py-16 text-center">
        <p className="font-display text-lg text-bone">Nothing here yet</p>
        <p className="mt-2 text-sm text-mute">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="border-t border-line">
      {records.map((record) => {
        const expanded = open === record.id;
        return (
          <li key={record.id} className="border-b border-line">
            <div className="flex flex-wrap items-center gap-3 py-4">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : record.id)}
                className="flex flex-1 items-center gap-3 text-left"
                aria-expanded={expanded}
              >
                <ChevronDown
                  className={cn('h-4 w-4 shrink-0 text-mute transition-transform', expanded && 'rotate-180 text-gold')}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-bold uppercase tracking-wide text-bone">
                    {record.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
                    {new Date(record.createdAt).toLocaleString('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {record.reference ? ` · ${record.reference}` : ''}
                  </span>
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-2">
                {record.phone ? (
                  <a
                    href={`tel:${record.phone.replace(/\s/g, '')}`}
                    className="grid h-8 w-8 place-items-center border border-line text-mute hover:border-gold hover:text-gold"
                    aria-label={`Call ${record.title}`}
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                {record.email ? (
                  <a
                    href={`mailto:${record.email}`}
                    className="grid h-8 w-8 place-items-center border border-line text-mute hover:border-gold hover:text-gold"
                    aria-label={`Email ${record.title}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                <select
                  value={record.status}
                  onChange={(e) => setStatus(record.id, e.target.value)}
                  disabled={busy === record.id}
                  aria-label="Status"
                  className={cn(
                    'h-8 border bg-ink px-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] outline-none disabled:opacity-50',
                    statusColour[record.status] ?? 'border-line text-mute',
                  )}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-ink text-bone">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {expanded ? (
              <div className="grid gap-6 pb-6 pl-7 lg:grid-cols-2">
                {record.details.length ? (
                  <dl className="divide-y divide-line/60 border-y border-line/60">
                    {record.details.map(([label, value]) => (
                      <div key={label} className="flex gap-4 py-2.5">
                        <dt className="w-32 shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
                          {label}
                        </dt>
                        <dd className="flex-1 whitespace-pre-wrap text-sm text-bone">{value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {record.items?.length ? (
                  <div>
                    <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">Items</p>
                    <ul className="divide-y divide-line/60 border-y border-line/60">
                      {record.items.map((item, i) => (
                        <li key={i} className="flex items-baseline justify-between gap-4 py-2.5">
                          <span className="text-sm text-bone">
                            {item.name}
                            {item.variant ? <span className="block text-xs text-mute">{item.variant}</span> : null}
                          </span>
                          <span className="shrink-0 text-right font-mono text-sm tabular-nums text-bone">
                            ×{item.quantity}
                            {typeof item.unitPrice === 'number' ? (
                              <span className="block text-xs text-mute">{formatKES(item.unitPrice * item.quantity)}</span>
                            ) : null}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {record.cvPath ? (
                  <a
                    href={`/api/admin/cv?path=${encodeURIComponent(record.cvPath)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 w-fit items-center gap-2 border border-gold/50 px-4 font-display text-[0.625rem] font-bold uppercase tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-void"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Open CV
                  </a>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
