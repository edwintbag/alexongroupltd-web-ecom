import type { MetadataRoute } from 'next';
import { company } from '@/data/company';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/checkout', '/account', '/admin'] }],
    sitemap: `${company.siteUrl}/sitemap.xml`,
  };
}
