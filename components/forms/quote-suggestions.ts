import { products } from '@/data/products';
import { equipment } from '@/data/equipment';

/** Items that are always priced per job — the natural starting point for a quote basket. */
export const quoteSuggestions = [
  ...products
    .filter((p) => p.commerceMode === 'quote')
    .map((p) => ({ kind: 'product' as const, id: p.id, slug: p.slug, name: p.name, image: p.images[0] })),
  ...equipment
    .slice(0, 3)
    .map((e) => ({ kind: 'equipment' as const, id: e.id, slug: e.slug, name: e.name, image: e.images[0] })),
];
