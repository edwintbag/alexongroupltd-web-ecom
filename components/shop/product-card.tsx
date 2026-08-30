'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Heart, Plus, FileText } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/types';
import { priceFrom } from '@/data/products';
import { Price } from '@/components/ui/price';
import { DimCallout } from '@/components/ui/measure-rule';
import { useCart } from '@/store/cart';
import { useQuote } from '@/store/quote';
import { useWishlist } from '@/store/wishlist';
import { useToast } from '@/components/ui/toast';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const add = useCart((s) => s.add);
  const addQuote = useQuote((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wishEntries = useWishlist((s) => s.entries);
  const push = useToast((s) => s.push);
  const hydrated = useHydrated();

  const variants = product.variants ?? [];
  const variant = variants[variantIndex];
  const price = variant?.price ?? priceFrom(product);
  const image = variant?.image ?? product.images[0];
  const hoverImage = product.images[1];
  const isQuote = product.commerceMode === 'quote' || typeof price !== 'number';
  const saved = hydrated && wishEntries.some((e) => e.productId === product.id);

  const handleAdd = () => {
    if (isQuote) {
      addQuote({
        kind: 'product',
        refId: product.id,
        slug: product.slug,
        name: product.name,
        variantLabel: variant?.label,
        quantity: 1,
        image,
      });
      push(`${product.name} added to your quote basket`);
      return;
    }
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantId: variant?.id,
      variantLabel: variant?.label,
      unitPrice: price as number,
      unit: product.unit,
      quantity: 1,
      image,
    });
    push(`${product.name} added to cart`);
  };

  return (
    <motion.article
      className="group relative flex flex-col border border-line bg-slate-900/30 transition-colors duration-300 hover:border-gold/50"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-void">
        <Link href={`/shop/${product.slug}`} aria-label={product.name} className="absolute inset-0 z-10" />
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width:1280px) 24vw, (min-width:768px) 33vw, 50vw"
          className={cn(
            'object-cover transition-all duration-700 ease-rule',
            hoverImage ? 'group-hover:scale-105 group-hover:opacity-0' : 'group-hover:scale-105',
          )}
        />
        {hoverImage ? (
          <Image
            src={hoverImage}
            alt=""
            fill
            sizes="(min-width:1280px) 24vw, (min-width:768px) 33vw, 50vw"
            className="scale-105 object-cover opacity-0 transition-opacity duration-700 ease-rule group-hover:opacity-100"
          />
        ) : null}

        <span className="absolute left-0 top-0 z-20 bg-void/85 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-gold">
          {isQuote ? 'Quoted' : product.availability === 'in-stock' ? 'In stock' : 'To order'}
        </span>

        <div className="absolute right-2 top-2 z-20 flex flex-col gap-1.5 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleWish({ productId: product.id, slug: product.slug })}
            className={cn(
              'grid h-9 w-9 place-items-center border border-line bg-void/85 backdrop-blur transition-colors hover:border-gold hover:text-gold',
              saved ? 'text-clay-400' : 'text-bone',
            )}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={saved}
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-current')} />
          </button>
          {onQuickView ? (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="grid h-9 w-9 place-items-center border border-line bg-void/85 text-bone backdrop-blur transition-colors hover:border-gold hover:text-gold"
              aria-label={`Quick view ${product.name}`}
            >
              <Eye className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-mute">{product.categorySlug.replace(/-/g, ' ')}</p>
        <h3 className="mt-1.5 font-display text-base font-bold uppercase leading-tight tracking-tight text-bone">
          <Link href={`/shop/${product.slug}`} className="transition-colors hover:text-gold">
            {product.name}
          </Link>
        </h3>

        {variants.length > 1 ? (
          <div className="mt-3 flex flex-wrap gap-1" role="group" aria-label={`${product.name} options`}>
            {variants.slice(0, 4).map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantIndex(i)}
                aria-pressed={i === variantIndex}
                className={cn(
                  'border px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.08em] transition-colors',
                  i === variantIndex ? 'border-gold text-gold' : 'border-line text-mute hover:border-bone/40 hover:text-bone',
                )}
              >
                {v.dimension ?? v.label}
              </button>
            ))}
            {variants.length > 4 ? (
              <Link href={`/shop/${product.slug}`} className="border border-line px-2 py-1 font-mono text-[0.5625rem] text-mute hover:text-gold">
                +{variants.length - 4}
              </Link>
            ) : null}
          </div>
        ) : variant?.dimension ? (
          <DimCallout className="mt-3 self-start">{variant.dimension}</DimCallout>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Price value={price} from={variants.length > 1 && !variant} unit={product.unit} className="text-base" />
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 px-3 font-display text-[0.625rem] font-bold uppercase tracking-[0.1em] transition-all duration-200 active:scale-95',
              isQuote ? 'border border-gold/50 text-gold hover:bg-gold hover:text-void' : 'bg-gold text-void hover:bg-gold-300',
            )}
          >
            {isQuote ? <FileText className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isQuote ? 'Quote' : 'Add'}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
