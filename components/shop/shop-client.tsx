'use client';

import { useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, X, PackageSearch } from 'lucide-react';
import type { Product } from '@/types';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { priceFrom } from '@/data/products';
import { ProductCard } from './product-card';
import { QuickView } from './quick-view';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { cn, formatKES, pluralize } from '@/lib/utils';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

const sorts: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'name', label: 'Name A–Z' },
];

const PAGE_SIZE = 8;

export function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initialCategory = params.get('category') ?? 'all';

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');
  const [modes, setModes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<Sort>('featured');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);

  const priceCeiling = 5000;

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== 'all' && p.categorySlug !== category) return false;
      if (modes.length && !modes.includes(p.commerceMode)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.shortDescription} ${(p.variants ?? []).map((v) => v.label).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (maxPrice !== null) {
        const from = priceFrom(p);
        if (typeof from !== 'number' || from > maxPrice) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      const pa = priceFrom(a) ?? Number.MAX_SAFE_INTEGER;
      const pb = priceFrom(b) ?? Number.MAX_SAFE_INTEGER;
      if (sort === 'price-asc') return pa - pb;
      if (sort === 'price-desc') return pb - pa;
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
    return list;
  }, [category, modes, query, maxPrice, sort]);

  const shown = filtered.slice(0, visible);
  const activeChips = [
    category !== 'all' ? { label: categories.find((c) => c.slug === category)?.name ?? category, clear: () => setCategory('all') } : null,
    ...modes.map((m) => ({ label: m === 'quote' ? 'Quoted items' : 'Buy now', clear: () => setModes((s) => s.filter((x) => x !== m)) })),
    maxPrice !== null ? { label: `Under ${formatKES(maxPrice)}`, clear: () => setMaxPrice(null) } : null,
    query ? { label: `“${query}”`, clear: () => setQuery('') } : null,
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const changeCategory = (slug: string) => {
    setCategory(slug);
    setVisible(PAGE_SIZE);
    router.replace(slug === 'all' ? '/shop' : `/shop?category=${slug}`, { scroll: false });
  };

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <p className="eyebrow mb-3">Search</p>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Blocks, cabros, culverts…"
          aria-label="Search the catalogue"
          className="h-11 w-full border border-line bg-transparent px-3 text-sm text-bone outline-none transition-colors placeholder:text-mute/60 focus:border-gold"
        />
      </div>

      <div>
        <p className="eyebrow mb-3">Category</p>
        <ul className="space-y-1">
          {[{ slug: 'all', name: 'All products' }, ...categories].map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => changeCategory(c.slug)}
                aria-pressed={category === c.slug}
                className={cn(
                  'flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors',
                  category === c.slug ? 'text-gold' : 'text-mute hover:text-bone',
                )}
              >
                {c.name}
                <span className="font-mono text-[0.625rem] tabular-nums text-mute/60">
                  {c.slug === 'all' ? products.length : products.filter((p) => p.categorySlug === c.slug).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow mb-3">How you buy</p>
        {[
          { id: 'purchase', label: 'Buy now — listed price' },
          { id: 'quote', label: 'Quoted — priced per job' },
        ].map((mode) => (
          <label key={mode.id} className="flex cursor-pointer items-center gap-3 py-1.5 text-sm text-mute transition-colors hover:text-bone">
            <input
              type="checkbox"
              checked={modes.includes(mode.id)}
              onChange={(e) => {
                setModes((s) => (e.target.checked ? [...s, mode.id] : s.filter((x) => x !== mode.id)));
                setVisible(PAGE_SIZE);
              }}
              className="h-4 w-4 shrink-0 accent-[#DA9629]"
            />
            {mode.label}
          </label>
        ))}
      </div>

      <div>
        <p className="eyebrow mb-3">Price from</p>
        <input
          type="range"
          min={100}
          max={priceCeiling}
          step={100}
          value={maxPrice ?? priceCeiling}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum starting price"
          className="w-full accent-[#DA9629]"
        />
        <div className="mt-2 flex items-center justify-between font-mono text-[0.625rem] text-mute">
          <span>{formatKES(100)}</span>
          <span className="text-gold">{maxPrice === null ? 'Any' : `≤ ${formatKES(maxPrice)}`}</span>
        </div>
        {maxPrice !== null ? (
          <button type="button" onClick={() => setMaxPrice(null)} className="mt-2 font-mono text-[0.625rem] uppercase tracking-widest text-mute hover:text-gold">
            Clear price filter
          </button>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block" aria-label="Product filters">
          <div className="sticky top-28">{filterPanel}</div>
        </aside>

        <div>
          {/* Category tabs */}
          <div className="no-scrollbar -mx-[var(--shell-x)] mb-6 flex gap-1 overflow-x-auto px-[var(--shell-x)] lg:mx-0 lg:px-0">
            {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => changeCategory(c.slug)}
                className={cn(
                  'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 font-display text-[0.6875rem] font-bold uppercase tracking-[0.1em] transition-colors',
                  category === c.slug ? 'border-gold text-gold' : 'border-transparent text-mute hover:text-bone',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-mute">
              {filtered.length} {pluralize(filtered.length, 'product')}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-bone lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeChips.length ? <span className="bg-gold px-1 text-void">{activeChips.length}</span> : null}
              </button>
              <label className="flex items-center gap-2">
                <span className="sr-only">Sort products</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="h-9 border border-line bg-ink px-2 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-bone outline-none focus:border-gold"
                >
                  {sorts.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <AnimatePresence>
            {activeChips.length ? (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-2 py-4">
                  {activeChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={chip.clear}
                      className="inline-flex items-center gap-1.5 border border-gold/40 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-gold transition-colors hover:bg-gold hover:text-void"
                    >
                      {chip.label}
                      <X className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {shown.length === 0 ? (
            <EmptyState
              className="mt-10"
              icon={<PackageSearch className="h-8 w-8" />}
              title="Nothing matches those filters"
              body="Clear a filter or two, or send us the specification — we quote anything the catalogue does not carry."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setCategory('all');
                    setModes([]);
                    setMaxPrice(null);
                    setQuery('');
                  }}
                >
                  Clear all filters
                </Button>
              }
            />
          ) : (
            <>
              <motion.div layout className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {shown.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <ProductCard product={product} onQuickView={setQuick} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {visible < filtered.length ? (
                <div className="mt-12 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                    Load more ({filtered.length - visible} left)
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" side="bottom">
        <div className="p-5">{filterPanel}</div>
      </Drawer>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </>
  );
}
