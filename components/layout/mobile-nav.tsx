'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, X, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { primaryNav, megaProducts, megaServices, megaEquipment } from './nav-data';
import { company } from '@/data/company';
import { whatsappGeneral } from '@/lib/whatsapp';
import { useLockScroll } from '@/hooks/use-lock-scroll';
import { ButtonLink } from '@/components/ui/button';

const subMap = { products: megaProducts, services: megaServices, equipment: megaEquipment };

export function MobileNav({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  useLockScroll(open);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col bg-ink xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line px-5">
            <Link href="/" onClick={onClose} className="flex items-center gap-3">
              <Image src="/images/brand/alexon-logo.png" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-bone">Alexon</span>
            </Link>
            <div className="flex items-center gap-1">
              <button type="button" onClick={onSearch} className="grid h-11 w-11 place-items-center text-bone" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
              <button type="button" onClick={onClose} className="grid h-11 w-11 place-items-center text-bone" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-4" aria-label="Mobile">
            <ul>
              {primaryNav.map((item, i) => {
                const sub = item.mega ? subMap[item.mega] : null;
                const isOpen = expanded === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line/60"
                  >
                    <div className="flex items-stretch">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex-1 py-4 font-display text-lg font-bold uppercase tracking-[0.04em] text-bone"
                      >
                        <span className="mr-3 font-mono text-[0.625rem] font-normal tracking-widest text-gold/60">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {item.label}
                      </Link>
                      {sub ? (
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : item.href)}
                          className="grid w-12 place-items-center text-mute"
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-gold' : ''}`} />
                        </button>
                      ) : null}
                    </div>
                    <AnimatePresence initial={false}>
                      {sub && isOpen ? (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          {sub.map((entry) => (
                            <li key={entry.href}>
                              <Link
                                href={entry.href}
                                onClick={onClose}
                                className="flex items-center gap-3 py-3 pl-9 pr-2 text-sm text-mute transition-colors hover:text-gold"
                              >
                                <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-line">
                                  <Image src={entry.image} alt="" fill sizes="36px" className="object-cover" />
                                </span>
                                {entry.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      ) : null}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-8 space-y-3">
              <ButtonLink href="/request-quote" onClick={onClose} size="lg" className="w-full">
                Request a quote
              </ButtonLink>
              <ButtonLink href="/shop" onClick={onClose} variant="outline" size="lg" className="w-full">
                Shop products
              </ButtonLink>
            </div>

            <div className="mt-8 space-y-3 border-t border-line pt-6 font-mono text-xs text-mute">
              <a href={`tel:${company.phoneIntl[0]}`} className="flex items-center gap-3 hover:text-gold">
                <Phone className="h-4 w-4 text-gold" aria-hidden />
                {company.phones[0]}
              </a>
              <a href={whatsappGeneral} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold">
                <MessageCircle className="h-4 w-4 text-gold" aria-hidden />
                Chat on WhatsApp
              </a>
              <p className="pt-1 leading-relaxed">{company.address.full}</p>
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
