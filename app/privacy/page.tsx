import { PageHero } from '@/components/ui/page-hero';
import { company } from '@/data/company';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Privacy',
  description: `How ${company.legalName} handles the information you submit through this website.`,
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy"
        image="/images/site/alexon-yard.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Privacy', href: '/privacy' }]}
      />
      <section className="section">
        <div className="shell max-w-prose space-y-6 text-sm leading-relaxed text-mute">
          <p className="border border-warning/40 bg-warning/5 p-4 text-warning">
            <strong className="font-display uppercase tracking-wide">Draft — </strong>
            this page is a working outline. {company.legalName} should have it reviewed against the Kenya Data Protection Act
            2019 before the site goes live.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">What we collect</h2>
          <p>
            When you send a quote request, place an order, book equipment, apply for a job or use the contact form, we collect
            the details you type in — your name, phone number, email address, site location and any notes or attachments you add.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">What stays in your browser</h2>
          <p>
            Your cart, quote basket, wishlist and recent searches are stored in your own browser, not on our servers. Clearing
            your browser data removes them.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">CVs and applications</h2>
          <p>
            Documents you attach to a job application are treated as confidential and used only to assess your application.
          </p>
          <h2 className="font-display text-lg font-bold uppercase tracking-tight text-bone">Contact</h2>
          <p>
            Questions about your information can go to <a href={`mailto:${company.email}`} className="text-gold hover:underline">{company.email}</a> or {company.phones[0]}.
          </p>
        </div>
      </section>
    </>
  );
}
