import type { Metadata, Viewport } from 'next';
import { Jost, Hanken_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { TopBar } from '@/components/layout/top-bar';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { QuoteDrawer } from '@/components/layout/quote-drawer';
import { Toaster } from '@/components/ui/toast';
import { company } from '@/data/company';
import { organizationJsonLd } from '@/lib/seo';

/* Display face echoes the Futura used on the Alexon banner and catalogue.
   Mono carries every dimension, price and reference number on the site. */
const display = Jost({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-display', display: 'swap', fallback: ['Trebuchet MS', 'system-ui', 'sans-serif'] });
const body = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap', fallback: ['system-ui', 'Segoe UI', 'sans-serif'] });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap', fallback: ['Consolas', 'ui-monospace', 'monospace'] });

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: `${company.legalName} — ${company.positioning}`,
    template: `%s · ${company.legalName}`,
  },
  description: company.intro,
  keywords: ['concrete blocks Kenya', 'cabros', 'culverts', 'fencing poles', 'machine hire Siaya', 'clean water supply', 'Ugunja construction'],
  authors: [{ name: company.legalName }],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: company.legalName,
    title: `${company.legalName} — ${company.positioning}`,
    description: company.intro,
  },
  robots: { index: true, follow: true },
  icons: { icon: '/images/brand/alexon-logo-512.png' },
};

export const viewport: Viewport = {
  themeColor: '#00131d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <TopBar />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <QuoteDrawer />
        <Toaster />
      </body>
    </html>
  );
}
