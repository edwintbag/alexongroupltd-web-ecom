'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Trash2, Heart } from 'lucide-react';
import { cartSubtotal, useCart } from '@/store/cart';
import { useWishlist } from '@/store/wishlist';
import { useHydrated } from '@/hooks/use-hydrated';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { EmptyState } from '@/components/ui/empty-state';
import { ButtonLink, Button } from '@/components/ui/button';
import { formatKES } from '@/lib/utils';

export function CartClient() {
  const { lines, remove, setQuantity, clear } = useCart();
  const toggleWish = useWishlist((s) => s.toggle);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-28" />
        ))}
      </div>
    );
  }

  if (!lines.length) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-8 w-8" />}
        title="Your cart is empty"
        body="Anything in the catalogue with a printed price can go straight in the cart. Bulk aggregates and haulage go through the quote basket instead."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop">Browse the catalogue</ButtonLink>
            <ButtonLink href="/request-quote" variant="outline">Request a quote</ButtonLink>
          </div>
        }
      />
    );
  }

  const subtotal = cartSubtotal(lines);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div>
        <div className="border-y border-line">
          {lines.map((line) => (
            <div key={line.key} className="flex flex-wrap items-start gap-5 border-b border-line py-5 last:border-b-0 sm:flex-nowrap">
              <Link href={`/shop/${line.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden border border-line">
                <Image src={line.image} alt="" fill sizes="96px" className="object-cover" />
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/shop/${line.slug}`} className="font-display text-base font-bold uppercase tracking-wide text-bone hover:text-gold">
                  {line.name}
                </Link>
                {line.variantLabel ? <p className="mt-1 font-mono text-xs text-gold-300">{line.variantLabel}</p> : null}
                <p className="mt-1 font-mono text-xs text-mute">
                  {formatKES(line.unitPrice)}
                  {line.unit ? ` / ${line.unit}` : ''}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <QuantitySelector size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
                  <button
                    type="button"
                    onClick={() => {
                      toggleWish({ productId: line.productId, slug: line.slug });
                      remove(line.key);
                    }}
                    className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute transition-colors hover:text-gold"
                  >
                    <Heart className="h-3 w-3" /> Save for later
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-mute transition-colors hover:text-error"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>

              <p className="shrink-0 font-mono text-base tabular-nums text-bone">{formatKES(line.unitPrice * line.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <ButtonLink href="/shop" variant="ghost" size="sm">
            Continue shopping
          </ButtonLink>
          <Button variant="ghost" size="sm" onClick={clear} className="text-mute hover:text-error">
            Empty cart
          </Button>
        </div>
      </div>

      <aside className="border border-line p-6 lg:sticky lg:top-28">
        <h2 className="eyebrow mb-5">Order summary</h2>
        <dl className="space-y-3 border-b border-line pb-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-mute">Materials subtotal</dt>
            <dd className="font-mono tabular-nums text-bone">{formatKES(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mute">Delivery</dt>
            <dd className="font-mono text-gold-300">Quoted</dd>
          </div>
        </dl>
        <div className="flex items-baseline justify-between py-5">
          <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-bone">Total</span>
          <span className="font-mono text-xl tabular-nums text-bone">{formatKES(subtotal)}</span>
        </div>
        <p className="mb-5 text-[0.6875rem] leading-relaxed text-mute">
          Excludes delivery. We confirm haulage cost against your location and load before you pay.
        </p>
        <ButtonLink href="/checkout" size="lg" className="w-full">
          Checkout
        </ButtonLink>
      </aside>
    </div>
  );
}
