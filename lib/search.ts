import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { equipment } from '@/data/equipment';
import { services } from '@/data/services';
import { projects } from '@/data/projects';

export type SearchKind = 'Product' | 'Category' | 'Equipment' | 'Service' | 'Project';

export interface SearchResult {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  haystack: string;
}

const index: SearchResult[] = [
  ...products.map((p) => ({
    id: p.id,
    kind: 'Product' as const,
    title: p.name,
    subtitle: p.shortDescription,
    href: `/shop/${p.slug}`,
    image: p.images[0],
    haystack: [p.name, p.shortDescription, p.categorySlug, ...(p.variants ?? []).map((v) => v.label), ...(p.applications ?? [])].join(' ').toLowerCase(),
  })),
  ...categories.map((c) => ({
    id: `cat-${c.slug}`,
    kind: 'Category' as const,
    title: c.name,
    subtitle: c.tagline,
    href: `/shop?category=${c.slug}`,
    image: c.image,
    haystack: `${c.name} ${c.tagline} ${c.description}`.toLowerCase(),
  })),
  ...equipment.map((e) => ({
    id: e.id,
    kind: 'Equipment' as const,
    title: e.name,
    subtitle: e.summary,
    href: `/equipment/${e.slug}`,
    image: e.images[0],
    haystack: `${e.name} ${e.summary} ${e.applications.join(' ')}`.toLowerCase(),
  })),
  ...services.map((s) => ({
    id: `svc-${s.slug}`,
    kind: 'Service' as const,
    title: s.name,
    subtitle: s.tagline,
    href: `/services/${s.slug}`,
    image: s.image,
    haystack: `${s.name} ${s.tagline} ${s.summary} ${s.bullets.join(' ')}`.toLowerCase(),
  })),
  ...projects.map((p) => ({
    id: `prj-${p.slug}`,
    kind: 'Project' as const,
    title: p.name,
    subtitle: p.summary,
    href: `/projects/${p.slug}`,
    image: p.cover,
    haystack: `${p.name} ${p.summary} ${p.supplied.join(' ')}`.toLowerCase(),
  })),
];

export function searchSite(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  return index
    .map((entry) => {
      const score = terms.reduce((acc, term) => {
        if (entry.title.toLowerCase().includes(term)) return acc + 3;
        if (entry.haystack.includes(term)) return acc + 1;
        return acc;
      }, 0);
      return { entry, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.entry);
}
