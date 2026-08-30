'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import type { Product } from '@/types';
import { Drawer } from '@/components/ui/drawer';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { Price } from '@/components/ui/price';
import { priceFrom } from '@/data/products';
import { useCart } from '@/store/cart';
import { useQuote } from '@/store/quote';
import { useToast } from '@/components/ui/toast';
import { whatsappEnquiry } from '@/lib/whatsapp';
import { cn } from '@/lib/utils';

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const addQuote = useQuote((s) => s.add);
  const push = useToast((s) => s.push);

  useEffect(() => {
    setVariantIndex(0);
    setQty(1);
  }, [product?.id]);

  if (!product) return <Drawer open={false} onClose={onClose} title="Quick view">{null}</Drawer>;

  const variants = product.variants ?? [];
  const variant = variants[variantIndex];
  const price = variant?.price ?? priceFrom(product);
  const image = variant?.image ?? product.images[0];
  const isQuote = product.commerceMode === 'quote' || typeof price !== 'number';

  const handleAdd = () => {
    if (isQuote) {
      addQuote({ kind: 'product', refId: product.id, slug: product.slug, name: product.name, variantLabel: variant?.label, quantity: qty, image });
      push(`${product.name} added to your quote basket`);
    } else {
      add({ productId: product.id, slug: product.slug, name: product.name, variantId: variant?.id, variantLabel: variant?.label, unitPrice: price as number, unit: product.unit, quantity: qty, image });
      push(`${product.name} added to cart`);
    }
    onClose();
  };

  return (
    <Drawer open={Boolean(product)} onClose={onClose} title="Quick view">
      <div className="p-5">
        <div className="relative aspect-[4/3] overflow-hidden border border-line">
          <Image src={image} alt={product.name} fill sizes="28rem" className="object-cover" />
        </div>

        <p className="eyebrow mt-6">{product.categorySlug.replace(/-/g, ' ')}</p>
        <h3 className="mt-2 text-display-sm text-bone">{product.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-mute">{product.shortDescription}</p>

        {variants.length > 1 ? (
          <div className="mt-6">
            <p className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">Choose an option</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantIndex(i)}
                  aria-pressed={i === variantIndex}
                  className={cn(
                    'border px-3 py-2 font-mono text-[0.6875rem] transition-colors',
                    i === variantIndex ? 'border-gold text-gold' : 'border-line text-mute hover:text-bone',
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex items-center justify-between">
          <Price value={price} unit={product.unit} className="text-xl" />
          <QuantitySelector value={qty} onChange={setQty} />
        </div>

        <div className="mt-6 grid gap-2">
          <Button size="lg" onClick={handleAdd} variant={isQuote ? 'outline' : 'primary'}>
            {isQuote ? 'Add to quote basket' : 'Add to cart'}
          </Button>
          <a
            href={whatsappEnquiry({ name: product.name, variant: variant?.label, quantity: qty, path: `/shop/${product.slug}` })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 border border-success/45 font-display text-xs font-bold uppercase tracking-[0.08em] text-success transition-colors hover:bg-success hover:text-void"
          >
            <MessageCircle className="h-4 w-4" />
            Enquire on WhatsApp
          </a>
          <Link href={`/shop/${product.slug}`} onClick={onClose} className="py-2 text-center font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mute hover:text-gold">
            See full details
          </Link>
        </div>
      </div>
    </Drawer>
  );
}
