import type { Product } from '@/types';

/**
 * CATALOGUE DATA — transcribed verbatim from the Alexon Group Ltd catalogue (2 pages).
 * Prices are exactly as printed, in KES. Nothing here is estimated.
 *
 * Known gaps flagged with `todo`:
 *  - The catalogue prints cabro prices without a unit. They are almost certainly
 *    per square metre rather than per piece, but the document does not say so.
 *  - Sand and aggregates are listed with no prices at all.
 */

export const products: Product[] = [
  {
    id: 'p-concrete-blocks',
    slug: 'concrete-blocks',
    name: 'Concrete Blocks',
    categorySlug: 'concrete-blocks',
    shortDescription: 'Machine-pressed walling blocks in four catalogue sizes, solid and hollow.',
    description:
      'Walling blocks pressed at the Alexon yard in Ugunja and cured on site before dispatch. The catalogue carries three solid sizes and one hollow size, so a single order can cover load-bearing walls, partitions and infill without changing supplier.',
    images: ['/images/products/concrete-blocks.jpg', '/images/products/cabros-grey.jpg'],
    unit: 'piece',
    price: 65,
    currency: 'KES',
    commerceMode: 'purchase',
    featured: true,
    availability: 'in-stock',
    applications: ['Load-bearing walls', 'Partition walls', 'Boundary walls', 'Foundations'],
    specifications: { Material: 'Pressed concrete', Finish: 'Grey, as cast', 'Sizes carried': '4' },
    variants: [
      { id: 'cb-9', label: '9 × 9 × 15 inch', dimension: '9"×9"×15"', price: 100, availability: 'in-stock', attributes: { Type: 'Solid' } },
      { id: 'cb-6', label: '6 × 9 × 15 inch', dimension: '6"×9"×15"', price: 80, availability: 'in-stock', attributes: { Type: 'Solid' } },
      { id: 'cb-6h', label: '6 × 9 × 15 inch Hollow', dimension: '6"×9"×15"', price: 70, availability: 'in-stock', attributes: { Type: 'Hollow' } },
      { id: 'cb-4', label: '4 × 9 × 15 inch', dimension: '4"×9"×15"', price: 65, availability: 'in-stock', attributes: { Type: 'Solid' } },
    ],
  },
  {
    id: 'p-cabros',
    slug: 'cabros-paving-blocks',
    name: 'Cabros (Paving Blocks)',
    categorySlug: 'cabros',
    shortDescription: 'Interlocking paving in 60mm and 80mm, rectangle or zigzag, plain or coloured.',
    description:
      'Interlocking paving blocks for driveways, walkways, parking yards and compounds. The 60mm blocks suit foot traffic and light vehicles; the 80mm blocks are the heavier-duty option for regular vehicle loading. Coloured cabros are available where the finish matters.',
    images: ['/images/products/cabros-coloured.jpg', '/images/products/cabros-grey.jpg'],
    price: 1150,
    currency: 'KES',
    commerceMode: 'purchase',
    featured: true,
    availability: 'in-stock',
    applications: ['Driveways', 'Walkways', 'Parking yards', 'Compounds and forecourts'],
    specifications: { Profiles: 'Rectangle, Zigzag', Thicknesses: '60mm, 80mm', Finishes: 'Plain grey, Coloured' },
    variants: [
      { id: 'cab-60-rect', label: 'Normal 60mm — Rectangle', dimension: '60mm', price: 1150, availability: 'in-stock', attributes: { Thickness: '60mm', Profile: 'Rectangle', Finish: 'Plain' } },
      { id: 'cab-60-zig', label: 'Normal 60mm — Zigzag', dimension: '60mm', price: 1150, availability: 'in-stock', attributes: { Thickness: '60mm', Profile: 'Zigzag', Finish: 'Plain' } },
      { id: 'cab-80-rect', label: 'Normal 80mm — Rectangle', dimension: '80mm', price: 1250, availability: 'in-stock', attributes: { Thickness: '80mm', Profile: 'Rectangle', Finish: 'Plain' } },
      { id: 'cab-80-zig', label: 'Normal 80mm — Zigzag', dimension: '80mm', price: 1250, availability: 'in-stock', attributes: { Thickness: '80mm', Profile: 'Zigzag', Finish: 'Plain' } },
      { id: 'cab-col', label: 'Coloured', price: 1300, availability: 'in-stock', image: '/images/products/cabros-coloured.jpg', attributes: { Finish: 'Coloured' } },
    ],
    todo: 'Catalogue prints cabro prices without a unit. Confirm whether KES 1,150 / 1,250 / 1,300 is per square metre.',
  },
  {
    id: 'p-fencing-poles',
    slug: 'fencing-poles',
    name: 'Fencing Poles',
    categorySlug: 'fencing-poles',
    shortDescription: 'Precast concrete fencing posts, 8 to 10 ft, plus 8 ft supports.',
    description:
      'Precast fencing posts for perimeter and boundary fencing. Alexon carries three main heights plus a shorter support post used at corners and straining points.',
    images: ['/images/products/fencing-poles.jpg'],
    unit: 'piece',
    price: 1400,
    currency: 'KES',
    commerceMode: 'purchase',
    featured: true,
    availability: 'in-stock',
    applications: ['Perimeter fencing', 'Boundary fencing', 'Institutional fencing', 'Farm fencing'],
    specifications: { Material: 'Precast concrete', 'Heights carried': '8 ft, 9 ft, 10 ft, 8 ft support' },
    variants: [
      { id: 'fp-10', label: '10 FT', dimension: "10'", price: 1700, availability: 'in-stock' },
      { id: 'fp-9', label: '9 FT', dimension: "9'", price: 1600, availability: 'in-stock' },
      { id: 'fp-8', label: '8 FT', dimension: "8'", price: 1500, availability: 'in-stock' },
      { id: 'fp-8s', label: 'Support 8 FT', dimension: "8'", price: 1400, availability: 'in-stock', attributes: { Type: 'Support post' } },
    ],
  },
  {
    id: 'p-culverts',
    slug: 'culverts',
    name: 'Culverts',
    categorySlug: 'culverts',
    shortDescription: 'Precast culvert rings from 1 ft to 3 ft diameter.',
    description:
      'Precast concrete culverts for road crossings, gate accesses and drainage runs. Four sizes are carried, so the same supplier covers everything from a compound entrance to a road crossing.',
    images: ['/images/products/culverts.jpg'],
    unit: 'piece',
    price: 1500,
    currency: 'KES',
    commerceMode: 'purchase',
    featured: true,
    availability: 'in-stock',
    applications: ['Road crossings', 'Gate accesses', 'Drainage runs', 'Storm water management'],
    specifications: { Material: 'Precast concrete', 'Sizes carried': '1 ft, 1.5 ft, 2 ft, 3 ft' },
    variants: [
      { id: 'cv-3', label: '3 FT', dimension: "3'", price: 5000, availability: 'in-stock' },
      { id: 'cv-2', label: '2 FT', dimension: "2'", price: 3500, availability: 'in-stock' },
      { id: 'cv-15', label: '1.5 FT', dimension: "1.5'", price: 2000, availability: 'in-stock' },
      { id: 'cv-1', label: '1 FT', dimension: "1'", price: 1500, availability: 'in-stock' },
    ],
  },
  {
    id: 'p-road-kerb-channel',
    slug: 'road-kerbs-and-channels',
    name: 'Road Kerbs & Channels',
    categorySlug: 'road-kerbs-channels',
    shortDescription: 'Kerbs and channels for carriageway edging and surface drainage.',
    description:
      'Precast kerbs define the edge of a carriageway, parking bay or walkway; channels carry surface water away from it. The two are usually laid together on the same run.',
    images: ['/images/products/road-kerb-channel.jpg'],
    unit: 'piece',
    price: 400,
    currency: 'KES',
    commerceMode: 'purchase',
    availability: 'in-stock',
    applications: ['Carriageway edging', 'Parking bays', 'Walkway edging', 'Surface water drainage'],
    variants: [
      { id: 'rk-kerb', label: 'Road Kerb', price: 500, availability: 'in-stock' },
      { id: 'rk-channel', label: 'Road Channel', price: 400, availability: 'in-stock' },
    ],
  },
  {
    id: 'p-wall-coping',
    slug: 'wall-coping',
    name: 'Wall Coping',
    categorySlug: 'wall-coping',
    shortDescription: 'Precast coping in 600 × 300mm and 600 × 225mm.',
    description:
      'Coping caps the top of a boundary or perimeter wall so rain runs off instead of soaking into the blockwork. Two widths are carried to match standard wall thicknesses.',
    images: ['/images/products/wall-coping.jpg'],
    unit: 'piece',
    price: 100,
    currency: 'KES',
    commerceMode: 'purchase',
    availability: 'in-stock',
    applications: ['Boundary walls', 'Perimeter walls', 'Parapet walls'],
    variants: [
      { id: 'wc-600-300', label: '600mm × 300mm', dimension: '600×300', price: 200, availability: 'in-stock' },
      { id: 'wc-600-225', label: '600mm × 225mm', dimension: '600×225', price: 100, availability: 'in-stock' },
    ],
  },
  {
    id: 'p-slabs',
    slug: 'slabs',
    name: 'Slabs',
    categorySlug: 'slabs',
    shortDescription: 'Precast slabs in 2 × 2 ft and 2 × 1 ft.',
    description:
      'Flat precast slabs used for walkways, yard surfacing and covering drainage channels and chambers.',
    images: ['/images/products/slabs.jpg'],
    unit: 'piece',
    price: 150,
    currency: 'KES',
    commerceMode: 'purchase',
    availability: 'in-stock',
    applications: ['Walkways', 'Yard surfacing', 'Drain and chamber covers'],
    variants: [
      { id: 'sl-2x2', label: '2 FT × 2 FT', dimension: "2'×2'", price: 300, availability: 'in-stock' },
      { id: 'sl-2x1', label: '2 FT × 1 FT', dimension: "2'×1'", price: 150, availability: 'in-stock' },
    ],
  },
  {
    id: 'p-column-tops',
    slug: 'column-tops',
    name: 'Column Tops',
    categorySlug: 'column-tops',
    shortDescription: 'Decorative pillar caps in large and small.',
    description:
      'Cast column tops finish gate pillars and boundary columns and keep water off the column head.',
    images: ['/images/products/column-tops.jpg'],
    unit: 'piece',
    price: 150,
    currency: 'KES',
    commerceMode: 'purchase',
    availability: 'in-stock',
    applications: ['Gate pillars', 'Boundary columns', 'Entrance features'],
    variants: [
      { id: 'ct-l', label: 'Large', price: 400, availability: 'in-stock' },
      { id: 'ct-s', label: 'Small', price: 150, availability: 'in-stock' },
    ],
  },
  {
    id: 'p-spindles',
    slug: 'spindles',
    name: 'Spindles',
    categorySlug: 'spindles',
    shortDescription: 'Cast balustrade spindles in four heights, 1.5 to 3 ft.',
    description:
      'Turned-profile concrete spindles for balcony, veranda and staircase balustrades. Four heights are carried so the balustrade can be set to the run.',
    images: ['/images/products/spindles.jpg'],
    unit: 'piece',
    price: 250,
    currency: 'KES',
    commerceMode: 'purchase',
    featured: true,
    availability: 'in-stock',
    applications: ['Balcony balustrades', 'Veranda balustrades', 'Staircase balustrades', 'Terrace edging'],
    variants: [
      { id: 'sp-3', label: '3 FT', dimension: "3'", price: 450, availability: 'in-stock' },
      { id: 'sp-25', label: '2.5 FT', dimension: "2.5'", price: 400, availability: 'in-stock' },
      { id: 'sp-2', label: '2 FT', dimension: "2'", price: 300, availability: 'in-stock' },
      { id: 'sp-15', label: '1.5 FT', dimension: "1.5'", price: 250, availability: 'in-stock' },
    ],
  },
  {
    id: 'p-shallow-drain',
    slug: 'shallow-drain',
    name: 'Shallow Drain',
    categorySlug: 'shallow-drains',
    shortDescription: 'Precast open channel drain sections.',
    description:
      'Shallow drain sections channel surface water around buildings, yards and access roads without excavating a deep drainage run.',
    images: ['/images/products/shallow-drain.jpg'],
    unit: 'piece',
    price: 600,
    currency: 'KES',
    commerceMode: 'purchase',
    availability: 'in-stock',
    applications: ['Surface water channelling', 'Yard drainage', 'Building perimeter drainage'],
  },
  {
    id: 'p-sand-aggregates',
    slug: 'sand-and-aggregates',
    name: 'Sand & Aggregates',
    categorySlug: 'sand-aggregates',
    shortDescription: 'Sand, ballast, quarry dust and quarry chips, delivered by tipper.',
    description:
      'Bulk materials supplied and delivered on the Alexon tipper fleet. Because the cost of a load moves with quantity and distance, aggregates are quoted rather than sold at a fixed shelf price.',
    images: ['/images/products/sand-aggregates.jpg', '/images/equipment/tippers.jpg'],
    currency: 'KES',
    commerceMode: 'quote',
    featured: true,
    availability: 'on-request',
    applications: ['Concrete works', 'Mortar and plaster', 'Blinding and backfill', 'Road base and surfacing'],
    variants: [
      { id: 'agg-sand', label: 'Sand', availability: 'on-request' },
      { id: 'agg-ballast', label: 'Ballast', availability: 'on-request' },
      { id: 'agg-dust', label: 'Quarry Dust', availability: 'on-request' },
      { id: 'agg-chips', label: 'Quarry Chips', availability: 'on-request' },
    ],
    todo: 'Catalogue lists sand, ballast, quarry dust and quarry chips with no prices. Confirm rates and load sizes.',
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductsByCategory = (categorySlug: string) =>
  products.filter((p) => p.categorySlug === categorySlug);
export const featuredProducts = products.filter((p) => p.featured);

/** Lowest catalogue price across a product's variants, used on cards. */
export function priceFrom(product: Product): number | undefined {
  const prices = (product.variants ?? []).map((v) => v.price).filter((n): n is number => typeof n === 'number');
  if (prices.length) return Math.min(...prices);
  return product.price;
}
