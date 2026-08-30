import Link from 'next/link';
import { Phone, MapPin, Mail } from 'lucide-react';
import { company } from '@/data/company';

export function TopBar() {
  return (
    <div className="hidden border-b border-line bg-void/60 lg:block">
      <div className="shell flex h-9 items-center justify-between font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute">
        <p className="flex items-center gap-2">
          <MapPin className="h-3 w-3 text-gold" aria-hidden />
          {company.address.full}
        </p>
        <div className="flex items-center gap-6">
          <a href={`tel:${company.phoneIntl[0]}`} className="flex items-center gap-2 transition-colors hover:text-gold">
            <Phone className="h-3 w-3 text-gold" aria-hidden />
            {company.phones.join(' · ')}
          </a>
          <a href={`mailto:${company.email}`} className="flex items-center gap-2 transition-colors hover:text-gold">
            <Mail className="h-3 w-3 text-gold" aria-hidden />
            {company.email}
          </a>
          <Link href="/request-quote" className="text-gold transition-colors hover:text-gold-300">
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
