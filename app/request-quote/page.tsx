import { Suspense } from 'react';
import { QuoteForm } from '@/components/forms/quote-form';
import { PageHero } from '@/components/ui/page-hero';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Request a quote',
  description:
    'Send Alexon Group Ltd one request covering materials, plant hire, water delivery and haulage. Priced against your site and quantities.',
  path: '/request-quote',
  image: '/images/site/tipper-fleet.jpg',
});

export default function RequestQuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Quotations"
        title="One request. One price for the whole job."
        lede="Bulk materials, plant hire and haulage are priced against your site, your quantities and the distance — so they are quoted rather than sold off a shelf."
        image="/images/site/tipper-fleet.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Request a quote', href: '/request-quote' }]}
      />
      <section className="section">
        <div className="shell">
          <Suspense fallback={<div className="skeleton h-96" />}>
            <QuoteForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
