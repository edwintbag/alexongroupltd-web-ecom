'use client';

import { useState } from 'react';
import { MessageCircle, Heart, FileText, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { priceFrom } from '@/data/products';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Price } from '@/components/ui/price';
import { useCart } from '@/store/cart';
import { useQuote } from '@/store/quote';
import { useWishlist } from '@/store/wishlist';
import { useToast } from '@/components/ui/toast';
import { useHydrated } from '@/hooks/use-hydrated';
import { whatsappEnquiry } from '@/lib/whatsapp';
import { cn, formatKES } from '@/lib/utils';

export function ProductPurchase({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);

  const add = useCart((s) => s.add);
  const addQuote = useQuote((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const entries = useWishlist((s) => s.entries);
  const push = useToast((s) => s.push);
  const hydrated = useHydrated();

  const variant = variants[variantIndex];
  const price = variant?.price ?? priceFrom(product);
  const image = variant?.image ?? product.images[0];
  const isQuote = product.commerceMode === 'quote' || typeof price !== 'number';
  const saved = hydrated && entries.some((e) => e.productId === product.id);

  const handleAdd = () => {
    if (isQuote) {
      addQuote({ kind: 'product', refId: product.id, slug: product.slug, name: product.name, variantLabel: variant?.label, quantity: qty, image });
      push(`${product.name} added to your quote basket`);
      return;
    }
    add({ productId: product.id, slug: product.slug, name: product.name, variantId: variant?.id, variantLabel: variant?.label, unitPrice: price as number, unit: product.unit, quantity: qty, image });
    push(`${product.name} added to cart`);
  };

  return (
    <div>
      {variants.length > 0 ? (
        <fieldset className="mb-8">
          <legend className="eyebrow mb-3">
            {product.slug === 'sand-and-aggregates' ? 'Material' : 'Size & option'}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantIndex(i)}
                aria-pressed={i === variantIndex}
                className={cn(
                  'flex min-w-[6rem] flex-col items-start border px-3 py-2 text-left transition-colors',
                  i === variantIndex ? 'border-gold bg-gold/5' : 'border-line hover:border-bone/40',
                )}
              >
                <span className={cn('font-display text-xs font-bold uppercase tracking-wide', i === variantIndex ? 'text-gold' : 'text-bone')}>
                  {v.label}
                </span>
                <span className="mt-0.5 font-mono text-[0.625rem] text-mute">
                  {typeof v.price === 'number' ? formatKES(v.price) : 'Quoted'}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4 border-y border-line py-5">
        <div>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">
            {isQuote ? 'Priced per job' : 'Catalogue price'}
          </p>
          <Price value={price} unit={product.unit} className="mt-1 block text-3xl" />
        </div>
        <QuantitySelector value={qty} onChange={setQty} />
      </div>

      {!isQuote ? (
        <p className="mt-3 font-mono text-[0.6875rem] text-mute">
          Line total <span className="text-bone">{formatKES((price as number) * qty)}</span> · delivery quoted separately
        </p>
      ) : null}

      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        <Button size="lg" onClick={handleAdd} className="sm:col-span-2" variant={isQuote ? 'outline' : 'primary'}>
          {isQuote ? <FileText className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {isQuote ? 'Add to quote basket' : 'Add to cart'}
        </Button>
        {!isQuote ? (
          <ButtonLink href="/checkout" variant="solid" size="lg" onClick={handleAdd}>
            Buy now
          </ButtonLink>
        ) : (
          <ButtonLink href="/request-quote" variant="solid" size="lg">
            Request pricing
          </ButtonLink>
        )}
        <a
          href={whatsappEnquiry({ name: product.name, variant: variant?.label, quantity: qty, path: `/shop/${product.slug}` })}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-14 items-center justify-center gap-2 border border-success/45 font-display text-sm font-bold uppercase tracking-[0.08em] text-success transition-colors hover:bg-success hover:text-void"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>

      <button
        type="button"
        onClick={() => toggleWish({ productId: product.id, slug: product.slug })}
        className={cn('mt-4 inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] transition-colors', saved ? 'text-clay-400' : 'text-mute hover:text-gold')}
        aria-pressed={saved}
      >
        <Heart className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
        {saved ? 'Saved to wishlist' : 'Save to wishlist'}
      </button>

      {/* Sticky mobile purchase bar */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 z-[70] flex items-center gap-3 border-t border-line bg-ink/97 px-4 pt-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-mute">{variant?.label ?? product.name}</p>
          <Price value={price} unit={product.unit} className="text-sm" />
        </div>
        <Button size="md" onClick={handleAdd} variant={isQuote ? 'outline' : 'primary'} className="shrink-0">
          {isQuote ? 'Quote' : 'Add to cart'}
        </Button>
        <a
          href={whatsappEnquiry({ name: product.name, variant: variant?.label, quantity: qty, path: `/shop/${product.slug}` })}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-11 w-11 shrink-0 place-items-center border border-success/45 text-success"
          aria-label="Enquire on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
