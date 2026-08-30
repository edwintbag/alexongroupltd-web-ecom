import type { MetadataRoute } from 'next';
import { company } from '@/data/company';
import { products } from '@/data/products';
import { equipment } from '@/data/equipment';
import { services } from '@/data/services';
import { projects } from '@/data/projects';
import { jobs } from '@/data/careers';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = company.siteUrl;
  const now = new Date();
  const staticRoutes = ['', '/about', '/shop', '/services', '/equipment', '/projects', '/gallery', '/careers', '/contact', '/request-quote', '/delivery', '/cart', '/wishlist'];

  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: now, priority: route === '' ? 1 : 0.8 })),
    ...products.map((p) => ({ url: `${base}/shop/${p.slug}`, lastModified: now, priority: 0.7 })),
    ...equipment.map((e) => ({ url: `${base}/equipment/${e.slug}`, lastModified: now, priority: 0.7 })),
    ...services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: now, priority: 0.6 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: now, priority: 0.5 })),
    ...jobs.map((j) => ({ url: `${base}/careers/${j.slug}`, lastModified: now, priority: 0.5 })),
  ];
}
