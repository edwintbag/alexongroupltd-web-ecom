import type { Metadata } from 'next';
import { WishlistClient } from '@/components/shop/wishlist-client';
import { PageHero } from '@/components/ui/page-hero';

export const metadata: Metadata = { title: 'Wishlist', robots: { index: false } };

export default function WishlistPage() {
  return (
    <>
      <PageHero
        eyebrow="Saved"
        title="Wishlist"
        lede="Items you are still working out quantities for. Move them to the cart when you are ready, or send them all as one quote request."
        image="/images/products/cabros-coloured.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Wishlist', href: '/wishlist' }]}
      />
      <section className="section">
        <div className="shell">
          <WishlistClient />
        </div>
      </section>
    </>
  );
}
