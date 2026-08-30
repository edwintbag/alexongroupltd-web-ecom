import type { Metadata } from 'next';
import { CartClient } from '@/components/shop/cart-client';
import { PageHero } from '@/components/ui/page-hero';

export const metadata: Metadata = { title: 'Cart', robots: { index: false } };

export default function CartPage() {
  return (
    <>
      <PageHero
        eyebrow="Your order"
        title="Cart"
        lede="Materials priced from the catalogue. Delivery is quoted separately because it moves with your location, quantity and the vehicle needed."
        image="/images/products/concrete-blocks.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Cart', href: '/cart' }]}
      />
      <section className="section">
        <div className="shell">
          <CartClient />
        </div>
      </section>
    </>
  );
}
