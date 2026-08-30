import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';
import { company } from '@/data/company';
import { whatsappGeneral } from '@/lib/whatsapp';

export function QuoteCTA() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image src="/images/site/site-masonry.jpg" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-void/88" />
      <div className="grain absolute inset-0" />
      <div className="shell relative py-20 text-center md:py-28">
        <p className="eyebrow mb-6">Start your project</p>
        <h2 className="mx-auto max-w-3xl text-display-lg text-bone">
          Tell us what you are building. We will price the materials, the plant and the delivery together.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-mute">
          Bulk orders, site deliveries and plant hire are quoted against your location and quantities — send the details once and get one number back.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/request-quote" size="lg">
            Request a quote
          </ButtonLink>
          <a
            href={whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2 border border-bone/25 px-8 font-display text-sm font-bold uppercase tracking-[0.08em] text-bone transition-colors hover:border-gold hover:text-gold"
          >
            Chat on WhatsApp
          </a>
        </div>
        <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-mute">
          {company.phones.join('  ·  ')}
        </p>
      </div>
    </section>
  );
}
