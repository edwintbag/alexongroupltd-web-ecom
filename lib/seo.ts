import type { Metadata } from 'next';
import { company } from '@/data/company';

// company.siteUrl is already sanitised and always a valid absolute URL.
const base = company.siteUrl;

export function buildMetadata({
  title,
  description,
  path = '/',
  image = '/images/site/hero-backhoe.jpg',
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): Metadata {
  const url = `${base}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: company.legalName,
      images: [{ url: `${base}${image}`, width: 1200, height: 630, alt: title }],
      locale: 'en_KE',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${base}${image}`] },
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${base}/#organization`,
  name: company.legalName,
  slogan: company.positioning,
  description: company.intro,
  url: base,
  telephone: company.phoneIntl[0],
  email: company.email,
  image: `${base}/images/site/alexon-yard.jpg`,
  logo: `${base}/images/brand/alexon-logo-512.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.full,
    addressRegion: company.address.county,
    addressCountry: 'KE',
  },
  areaServed: 'Kenya',
};

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${base}${item.href}`,
    })),
  };
}
