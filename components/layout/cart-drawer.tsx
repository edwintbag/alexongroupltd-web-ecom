'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Drawer } from '@/components/ui/drawer';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { EmptyState } from '@/components/ui/empty-state';
import { cartSubtotal, useCart } from '@/store/cart';
import { formatKES } from '@/lib/utils';

export function CartDrawer() {
  const { lines, isOpen, close, remove, setQuantity } = useCart();
  const subtotal = cartSubtotal(lines);

  return (
    <Drawer
      open={isOpen}
      onClose={close}
      title={`Cart (${lines.length})`}
      footer={
        lines.length ? (
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mute">Subtotal</span>
              <span className="font-mono text-lg tabular-nums text-bone">{formatKES(subtotal)}</span>
            </div>
            <p className="text-[0.6875rem] leading-relaxed text-mute">
              Delivery is quoted separately — the cost depends on your location, the quantity and the vehicle needed.
            </p>
            <div className="grid gap-2">
              <ButtonLink href="/checkout" onClick={close} size="lg" className="w-full">
                Checkout
              </ButtonLink>
              <Button variant="ghost" size="sm" onClick={close} className="w-full">
                Continue shopping
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={<ShoppingBag className="h-8 w-8" />}
            title="Your cart is empty"
            body="Add blocks, cabros, culverts or any catalogue item with a listed price and it will show up here."
            action={
              <ButtonLink href="/shop" onClick={close} size="md">
                Browse the catalogue
              </ButtonLink>
            }
            className="border-0"
          />
        </div>
      ) : (
        <ul>
          {lines.map((line) => (
            <li key={line.key} className="flex gap-4 border-b border-line px-5 py-4">
              <Link href={`/shop/${line.slug}`} onClick={close} className="relative h-20 w-20 shrink-0 overflow-hidden border border-line">
                <Image src={line.image} alt="" fill sizes="80px" className="object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/shop/${line.slug}`} onClick={close} className="block font-display text-sm font-bold uppercase tracking-wide text-bone hover:text-gold">
                  {line.name}
                </Link>
                {line.variantLabel ? <p className="mt-0.5 font-mono text-[0.6875rem] text-gold-300">{line.variantLabel}</p> : null}
                <p className="mt-1 font-mono text-xs text-mute">
                  {formatKES(line.unitPrice)}
                  {line.unit ? ` / ${line.unit}` : ''}
                </p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <QuantitySelector size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="grid h-8 w-8 place-items-center text-mute transition-colors hover:text-error"
                    aria-label={`Remove ${line.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <span className="shrink-0 font-mono text-sm tabular-nums text-bone">{formatKES(line.unitPrice * line.quantity)}</span>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
