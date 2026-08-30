'use client';

import { useState } from 'react';
import { featuredProducts } from '@/data/products';
import { ProductCard } from '@/components/shop/product-card';
import { QuickView } from '@/components/shop/quick-view';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [quick, setQuick] = useState<Product | null>(null);
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="Moving fastest"
          title="What sites order most"
          lede="Priced by the piece, straight from the yard. Bulk aggregates are quoted because the cost moves with the load and the distance."
          action={<ButtonLink href="/shop" variant="outline">Full catalogue</ButtonLink>}
        />
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {featuredProducts.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} onQuickView={setQuick} />
            </Reveal>
          ))}
        </div>
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </section>
  );
}
