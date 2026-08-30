import { PageHero } from '@/components/ui/page-hero';
import { company } from '@/data/company';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Terms',
  description: `Terms covering orders, quotations, hire and delivery with ${company.legalName}.`,
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms"
        image="/images/products/concrete-blocks.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Terms', href: '/terms' }]}
      />
      <section className="section">
        <div className="shell max-w-prose space-y-6 text-sm leading-relaxed text-mute">
          <p className="border border-warning/40 bg-warning/5 p-4 text-warning">
            <strong className="font-display uppercase tracking-wide">Draft — </strong>
            these terms are an outline for {company.legalName} to review and complete with its own counsel before launch.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">Prices</h2>
          <p>
            Catalogue prices are shown in Kenyan shillings and reflect the current Alexon catalogue. Whether a price includes
            taxes is confirmed on your quotation or invoice. Prices may change without notice.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">Quotations</h2>
          <p>
            A quotation covers the items, quantities and site location it was issued against. Changing any of those means the
            quotation is re-priced.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">Delivery</h2>
          <p>
            Delivery is charged separately and depends on location, quantity, product weight and the vehicle required. Delivery
            dates are estimates and depend on site access.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">Equipment hire</h2>
          <p>
            Hire is charged from the rate shown, with operator allowance where it applies. The hirer is responsible for safe
            site access and for confirming the working area is suitable for the machine.
          </p>
        </div>
      </section>
    </>
  );
}
