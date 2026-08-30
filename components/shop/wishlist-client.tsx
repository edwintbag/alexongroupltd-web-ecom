'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/store/wishlist';
import { useCart } from '@/store/cart';
import { useQuote } from '@/store/quote';
import { useHydrated } from '@/hooks/use-hydrated';
import { products, priceFrom } from '@/data/products';
import { ProductCard } from './product-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button, ButtonLink } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export function WishlistClient() {
  const entries = useWishlist((s) => s.entries);
  const clear = useWishlist((s) => s.clear);
  const add = useCart((s) => s.add);
  const addQuote = useQuote((s) => s.add);
  const push = useToast((s) => s.push);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4]" />
        ))}
      </div>
    );
  }

  const saved = entries.map((e) => products.find((p) => p.id === e.productId)).filter(Boolean) as typeof products;

  if (!saved.length) {
    return (
      <EmptyState
        icon={<Heart className="h-8 w-8" />}
        title="Nothing saved yet"
        body="Tap the heart on any product to keep it here while you work out quantities."
        action={<ButtonLink href="/shop">Browse the catalogue</ButtonLink>}
      />
    );
  }

  const moveAll = () => {
    let cartCount = 0;
    let quoteCount = 0;
    saved.forEach((product) => {
      const price = priceFrom(product);
      const variant = product.variants?.[0];
      if (product.commerceMode === 'quote' || typeof price !== 'number') {
        addQuote({ kind: 'product', refId: product.id, slug: product.slug, name: product.name, variantLabel: variant?.label, quantity: 1, image: product.images[0] });
        quoteCount += 1;
      } else {
        add({ productId: product.id, slug: product.slug, name: product.name, variantId: variant?.id, variantLabel: variant?.label, unitPrice: price, unit: product.unit, quantity: 1, image: product.images[0] });
        cartCount += 1;
      }
    });
    push(`${cartCount} to cart, ${quoteCount} to the quote basket`);
  };

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute">{saved.length} saved</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={moveAll}>
            Move all
          </Button>
          <Button size="sm" variant="ghost" onClick={clear} className="text-mute hover:text-error">
            Clear
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {saved.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
