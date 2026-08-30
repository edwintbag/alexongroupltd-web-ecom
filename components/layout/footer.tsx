import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { company } from '@/data/company';
import { categories } from '@/data/categories';
import { services } from '@/data/services';
import { whatsappGeneral } from '@/lib/whatsapp';
import { MeasureRule } from '@/components/ui/measure-rule';

const columns = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Products',
    links: categories.slice(0, 6).map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` })),
  },
  {
    title: 'Services',
    links: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    title: 'Support',
    links: [
      { label: 'Request a quote', href: '/request-quote' },
      { label: 'Equipment hire', href: '/equipment' },
      { label: 'Delivery', href: '/delivery' },
      { label: 'Cart', href: '/cart' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-void">
      <div className="shell pb-10 pt-16 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/brand/alexon-logo.png" alt="" width={52} height={52} className="h-13 w-13 object-contain" />
              <span className="font-display text-base font-bold uppercase leading-none tracking-[0.14em] text-bone">
                Alexon
                <span className="mt-1 block font-mono text-[0.5625rem] font-normal tracking-[0.2em] text-gold">GROUP LTD</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm font-display text-xl font-bold leading-tight text-bone">{company.positioning}</p>
            <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-gold">{company.values}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute">{company.tagline}</p>

            <address className="mt-8 space-y-3 not-italic text-sm text-mute">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  {company.address.line1}, {company.address.line2}
                  <br />
                  {company.address.county}, {company.address.country}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span className="font-mono">
                  {company.phones.map((p, i) => (
                    <span key={p}>
                      {i > 0 ? <span className="text-mute/50"> · </span> : null}
                      <a href={`tel:+254${p.replace(/\D/g, '').slice(1)}`} className="hover:text-gold">
                        {p}
                      </a>
                    </span>
                  ))}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href={`mailto:${company.email}`} className="hover:text-gold">
                  {company.email}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  Chat on WhatsApp
                </a>
              </p>
            </address>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="eyebrow mb-5">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-sm text-mute transition-colors hover:text-gold">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <MeasureRule label="Alexon Group Ltd" className="mt-14" />

        <div className="mt-6 flex flex-col gap-4 text-[0.6875rem] text-mute md:flex-row md:items-center md:justify-between">
          <p className="font-mono uppercase tracking-[0.14em]">
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono uppercase tracking-[0.14em]">
            {company.socials.map((s) => (
              <a key={s.name} href={s.href} className="transition-colors hover:text-gold" title={s.todo}>
                {s.name}
              </a>
            ))}
          </div>
          <div className="flex gap-5 font-mono uppercase tracking-[0.14em]">
            <Link href="/privacy" className="hover:text-gold">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
