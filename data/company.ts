/**
 * Source of truth: Alexon Group Ltd banner + product catalogue (Aug 2026).
 * Every value below is printed in one of those two documents.
 * Anything not printed there is marked TODO and left empty on purpose.
 */

/**
 * Resolve the canonical site URL.
 *
 * `??` is not enough here. A variable that EXISTS but is empty — which is what
 * you get when a host detects the name from .env.example and you leave the
 * value blank — passes straight through `??` and reaches `new URL("")`, which
 * throws during the build. So we test for a usable value, not a defined one.
 *
 * Order: explicit env var → the URL the host assigned → the production domain.
 */
function resolveSiteUrl(): string {
  const clean = (v?: string) => v?.trim().replace(/\/+$/, '') || '';

  const explicit = clean(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit) return explicit.startsWith('http') ? explicit : `https://${explicit}`;

  // Vercel sets this on every deployment, without a protocol.
  const hosted = clean(process.env.NEXT_PUBLIC_VERCEL_URL) || clean(process.env.VERCEL_URL);
  if (hosted) return `https://${hosted}`;

  return 'https://www.alexongroupltd.com';
}

export const company = {
  legalName: 'Alexon Group Ltd',
  shortName: 'Alexon',
  positioning: 'Your Ever Ready Construction Partner.',
  values: 'Built on Trust',
  /** Printed on the company logo mark */
  tagline: 'Your trusted partner for growth and sustainability',
  intro:
    'From concrete products and construction projects to machine hire, water supply and logistics. Alexon delivers every stage of your project, on time and to standard.',
  address: {
    line1: 'Ugunja',
    line2: 'Kisumu – Busia Highway',
    county: 'Siaya County',
    country: 'Kenya',
    full: 'Ugunja, Kisumu – Busia Highway',
  },
  phones: ['0701 381 197', '0143 875 327'],
  /** International format for tel: and wa.me links */
  phoneIntl: ['+254701381197'],
  whatsapp: '254701381197',
  email: 'alexongroupltd@gmail.com',
  website: 'www.alexongroupltd.com',
  siteUrl: resolveSiteUrl(),
  /** The banner shows these platform icons but prints no handles. */
  socials: [
    { name: 'Facebook', href: '#', todo: 'Add Facebook page URL' },
    { name: 'YouTube', href: '#', todo: 'Add YouTube channel URL' },
    { name: 'X', href: '#', todo: 'Add X profile URL' },
    { name: 'TikTok', href: '#', todo: 'Add TikTok profile URL' },
    { name: 'LinkedIn', href: '#', todo: 'Add LinkedIn company page URL' },
    { name: 'Instagram', href: '#', todo: 'Add Instagram profile URL' },
  ],
  /** TODO: opening hours are not stated in the supplied documents. */
  openingHours: null as string | null,
} as const;

/**
 * Homepage metrics. The supplied documents contain no company statistics,
 * so these are labelled placeholders for the Alexon administrator to fill.
 * `value: null` renders as "—" instead of a fabricated number.
 */
export const metrics: {
  label: string;
  value: number | null;
  suffix?: string;
  note: string;
}[] = [
  { label: 'Catalogue products', value: 12, suffix: '', note: 'Counted from the supplied catalogue' },
  { label: 'Plant & fleet categories', value: 6, suffix: '', note: 'Counted from the supplied catalogue' },
  { label: 'Projects completed', value: null, note: 'TODO: supply figure' },
  { label: 'Years in operation', value: null, note: 'TODO: supply figure' },
];
