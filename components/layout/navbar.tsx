'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Heart, Menu, Search, ShoppingBag, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { primaryNav, megaProducts, megaServices, megaEquipment } from './nav-data';
import { MegaPanel } from './mega-panel';
import { MobileNav } from './mobile-nav';
import { SearchDialog } from './search-dialog';
import { ButtonLink } from '@/components/ui/button';
import { cartCount, useCart } from '@/store/cart';
import { useQuote } from '@/store/quote';
import { useWishlist } from '@/store/wishlist';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';

const megaMap = {
  products: { entries: megaProducts, title: 'Product categories', footerHref: '/shop', footerLabel: 'View the full catalogue' },
  services: { entries: megaServices, title: 'What we do', footerHref: '/services', footerLabel: 'All services' },
  equipment: { entries: megaEquipment, title: 'Plant & fleet', footerHref: '/equipment', footerLabel: 'All equipment' },
} as const;

export function Navbar() {
  const pathname = usePathname();
  const [openMega, setOpenMega] = useState<keyof typeof megaMap | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hydrated = useHydrated();
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const quoteLines = useQuote((s) => s.lines);
  const openQuote = useQuote((s) => s.open);
  const wishlist = useWishlist((s) => s.entries);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMega(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') setOpenMega(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const count = hydrated ? cartCount(lines) : 0;
  const quoteCount = hydrated ? quoteLines.length : 0;
  const wishCount = hydrated ? wishlist.length : 0;

  return (
    <header
      className={cn(
        'sticky top-0 z-[80] transition-colors duration-300',
        scrolled || openMega ? 'border-b border-line bg-ink/[0.97]' : 'bg-transparent',
      )}
      onMouseLeave={() => setOpenMega(null)}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:uppercase focus:text-void"
      >
        Skip to content
      </a>

      <nav className="shell flex h-[4.5rem] items-center justify-between gap-4" aria-label="Main">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Alexon Group Ltd — home">
          <Image src="/images/brand/alexon-logo.png" alt="" width={44} height={44} className="h-11 w-11 object-contain" priority />
          <span className="hidden font-display text-sm font-bold uppercase leading-none tracking-[0.14em] text-bone sm:block">
            Alexon
            <span className="mt-1 block font-mono text-[0.5625rem] font-normal tracking-[0.2em] text-gold">GROUP LTD</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {primaryNav.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <li key={item.href} onMouseEnter={() => setOpenMega(item.mega ?? null)}>
                <Link
                  href={item.href}
                  aria-expanded={item.mega ? openMega === item.mega : undefined}
                  className={cn(
                    'relative block px-3 py-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.12em] transition-colors',
                    active ? 'text-gold' : 'text-bone/80 hover:text-bone',
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-3 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-300 ease-rule',
                      active || openMega === item.mega ? 'scale-x-100' : 'scale-x-0',
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center text-bone/80 transition-colors hover:text-gold"
            aria-label="Search the site"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          <Link href="/wishlist" className="relative hidden h-10 w-10 place-items-center text-bone/80 transition-colors hover:text-gold sm:grid" aria-label={`Wishlist, ${wishCount} saved`}>
            <Heart className="h-4.5 w-4.5" />
            {wishCount > 0 ? <Badge>{wishCount}</Badge> : null}
          </Link>

          <button
            type="button"
            onClick={openQuote}
            className="relative hidden h-10 w-10 place-items-center text-bone/80 transition-colors hover:text-gold sm:grid"
            aria-label={`Quote basket, ${quoteCount} items`}
          >
            <FileText className="h-4.5 w-4.5" />
            {quoteCount > 0 ? <Badge tone="clay">{quoteCount}</Badge> : null}
          </button>

          <button
            type="button"
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center text-bone/80 transition-colors hover:text-gold"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {count > 0 ? <Badge>{count}</Badge> : null}
          </button>

          <ButtonLink href="/request-quote" size="sm" className="ml-2 hidden lg:inline-flex">
            Request quote
          </ButtonLink>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="ml-1 grid h-10 w-10 place-items-center text-bone xl:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {openMega ? <MegaPanel {...megaMap[openMega]} onNavigate={() => setOpenMega(null)} /> : null}
      </AnimatePresence>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} onSearch={() => { setMobileOpen(false); setSearchOpen(true); }} />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function Badge({ children, tone = 'gold' }: { children: React.ReactNode; tone?: 'gold' | 'clay' }) {
  return (
    <span
      className={cn(
        'absolute right-1 top-1 grid h-4 min-w-4 place-items-center px-1 font-mono text-[0.5625rem] font-bold tabular-nums',
        tone === 'gold' ? 'bg-gold text-void' : 'bg-clay text-bone',
      )}
    >
      {children}
    </span>
  );
}
