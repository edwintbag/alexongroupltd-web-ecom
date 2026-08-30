'use client';

import Image from 'next/image';
import { FileText, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { EmptyState } from '@/components/ui/empty-state';
import { useQuote } from '@/store/quote';

export function QuoteDrawer() {
  const { lines, isOpen, close, remove, setQuantity } = useQuote();

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title={`Quote basket (${lines.length})`}
      footer={
        lines.length ? (
          <div className="space-y-3">
            <p className="text-[0.6875rem] leading-relaxed text-mute">
              Send these items as one request. We price against your site and quantities, then come back with a written quotation.
            </p>
            <ButtonLink href="/request-quote" onClick={close} size="lg" className="w-full">
              Request pricing
            </ButtonLink>
            <Button variant="ghost" size="sm" onClick={close} className="w-full">
              Keep browsing
            </Button>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<FileText className="h-8 w-8" />}
            title="No items to quote yet"
            body="Bulk aggregates, plant hire and haulage are priced against your site. Add them here and send one request."
            action={
              <ButtonLink href="/shop" onClick={close} size="md">
                Find something to quote
              </ButtonLink>
            }
            className="border-0"
          />
        </div>
      ) : (
        <ul>
          {lines.map((line) => (
            <li key={line.key} className="flex gap-4 border-b border-line px-5 py-4">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden border border-line">
                <Image src={line.image} alt="" fill sizes="64px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-wide text-bone">{line.name}</p>
                <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-gold/80">
                  {line.kind === 'equipment' ? 'Hire' : 'Materials'}
                  {line.variantLabel ? ` · ${line.variantLabel}` : ''}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <QuantitySelector size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="grid h-8 w-8 place-items-center text-mute transition-colors hover:text-error"
                    aria-label={`Remove ${line.name} from the quote basket`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
