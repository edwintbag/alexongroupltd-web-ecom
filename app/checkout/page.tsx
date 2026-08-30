import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/shop/checkout-client';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata: Metadata = { title: 'Checkout', robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <section className="shell section">
      <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Cart', href: '/cart' }, { name: 'Checkout', href: '/checkout' }]} />
      <h1 className="mb-10 text-display-md text-bone">Checkout</h1>
      <CheckoutClient />
    </section>
  );
}
