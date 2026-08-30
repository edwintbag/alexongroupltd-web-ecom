import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { company } from '@/data/company';
import { PageHero } from '@/components/ui/page-hero';
import { ContactForm } from '@/components/forms/contact-form';
import { enquiryCategories } from '@/data/enquiry-categories';
import { MeasureRule } from '@/components/ui/measure-rule';
import { whatsappGeneral } from '@/lib/whatsapp';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Contact',
  description: `Contact Alexon Group Ltd at Ugunja on the Kisumu–Busia highway, Siaya County. Call ${company.phones[0]} or email ${company.email}.`,
  path: '/contact',
  image: '/images/site/alexon-yard.jpg',
});

/** Map embed uses a place query rather than a fabricated pin. */
const mapSrc = 'https://www.google.com/maps?q=Ugunja,+Siaya+County,+Kenya&output=embed';

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the yard directly."
        lede="One number reaches materials, plant hire, water and haulage. Tell us what you are building and we will point you at the right person."
        image="/images/site/alexon-yard.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }]}
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <h2 className="eyebrow mb-6">Where to find us</h2>
            <address className="space-y-6 not-italic">
              <p className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-bone">Yard</span>
                  <span className="mt-1 block text-sm leading-relaxed text-mute">
                    {company.address.line1}, {company.address.line2}
                    <br />
                    {company.address.county}, {company.address.country}
                  </span>
                </span>
              </p>
              <p className="flex items-start gap-4">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-bone">Phone</span>
                  <span className="mt-1 block font-mono text-sm text-mute">
                    {company.phones.map((p) => (
                      <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="mr-4 hover:text-gold">
                        {p}
                      </a>
                    ))}
                  </span>
                </span>
              </p>
              <p className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-bone">Email</span>
                  <a href={`mailto:${company.email}`} className="mt-1 block text-sm text-mute hover:text-gold">
                    {company.email}
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-4">
                <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-gold" aria-hidden />
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-bone">WhatsApp</span>
                  <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-mute hover:text-gold">
                    Start a chat
                  </a>
                </span>
              </p>
              <p className="flex items-start gap-4">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-mute/50" aria-hidden />
                <span>
                  <span className="block font-display text-sm font-bold uppercase tracking-wide text-mute">Opening hours</span>
                  <span className="mt-1 block text-sm text-mute/70">
                    Not stated in the supplied documents — add them in <code className="font-mono">data/company.ts</code>.
                  </span>
                </span>
              </p>
            </address>

            <MeasureRule className="my-10" label="Enquiry types" />

            <ul className="flex flex-wrap gap-2">
              {enquiryCategories.map((c) => (
                <li key={c} className="border border-line px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <ContactForm />
            <div className="relative aspect-[16/10] overflow-hidden border border-line">
              <iframe
                src={mapSrc}
                title="Map showing Ugunja, Siaya County"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
