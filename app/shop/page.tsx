import { Suspense } from 'react';
import Image from 'next/image';
import { ShopClient } from '@/components/shop/shop-client';
import { ProductCardSkeleton } from '@/components/shop/product-card-skeleton';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Shop building materials',
  description:
    'Concrete blocks, cabros, fencing poles, culverts, kerbs, coping, slabs, spindles and aggregates from Alexon Group Ltd in Ugunja, with catalogue prices in KES.',
  path: '/shop',
  image: '/images/products/concrete-blocks.jpg',
});

export default function ShopPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src="/images/site/alexon-yard.jpg" alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-void/60" />
        <div className="shell relative py-16 md:py-24">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Shop', href: '/shop' }]} />
          <p className="eyebrow mb-4">The catalogue</p>
          <h1 className="max-w-2xl text-display-lg text-bone">Building materials, priced as printed.</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">
            Every price on this page comes straight from the Alexon catalogue, in Kenyan shillings. Bulk aggregates and anything needing haulage are quoted against your site instead.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ShopClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
