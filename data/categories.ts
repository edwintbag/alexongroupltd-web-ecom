import type { ProductCategory } from '@/types';

export const categories: ProductCategory[] = [
  {
    slug: 'concrete-blocks',
    name: 'Concrete Blocks',
    tagline: 'Machine-pressed walling blocks',
    description:
      'Solid and hollow walling blocks pressed on the Alexon block line, supplied in the four sizes carried in the catalogue.',
    image: '/images/products/concrete-blocks.jpg',
    order: 1,
  },
  {
    slug: 'cabros',
    name: 'Cabros & Paving Blocks',
    tagline: 'Rectangle, zigzag and coloured',
    description:
      'Interlocking paving in 60mm and 80mm thicknesses, in rectangle and zigzag profiles, plain or coloured.',
    image: '/images/products/cabros-coloured.jpg',
    order: 2,
  },
  {
    slug: 'fencing-poles',
    name: 'Fencing Poles',
    tagline: 'Precast posts and supports',
    description: 'Precast concrete fencing posts from 8 to 10 feet, plus 8 ft support posts.',
    image: '/images/products/fencing-poles.jpg',
    order: 3,
  },
  {
    slug: 'culverts',
    name: 'Culverts',
    tagline: 'Drainage and access crossings',
    description: 'Precast concrete culvert rings from 1 ft up to 3 ft for drainage and site access crossings.',
    image: '/images/products/culverts.jpg',
    order: 4,
  },
  {
    slug: 'road-kerbs-channels',
    name: 'Road Kerbs & Channels',
    tagline: 'Edging and surface drainage',
    description: 'Road kerbs and road channels for carriageway edging, parking bays and surface water runoff.',
    image: '/images/products/road-kerb-channel.jpg',
    order: 5,
  },
  {
    slug: 'wall-coping',
    name: 'Wall Coping',
    tagline: 'Weather protection for walls',
    description: 'Precast coping in two widths to cap and protect boundary and perimeter walls.',
    image: '/images/products/wall-coping.jpg',
    order: 6,
  },
  {
    slug: 'slabs',
    name: 'Slabs',
    tagline: 'Paving and cover slabs',
    description: 'Precast slabs in two sizes for walkways, yards and cover applications.',
    image: '/images/products/slabs.jpg',
    order: 7,
  },
  {
    slug: 'column-tops',
    name: 'Column Tops',
    tagline: 'Pillar caps, large and small',
    description: 'Decorative precast caps that finish gate pillars and boundary columns.',
    image: '/images/products/column-tops.jpg',
    order: 8,
  },
  {
    slug: 'spindles',
    name: 'Spindles',
    tagline: 'Balustrade spindles, 1.5–3 ft',
    description: 'Cast balustrade spindles in four heights for balconies, verandas and staircases.',
    image: '/images/products/spindles.jpg',
    order: 9,
  },
  {
    slug: 'shallow-drains',
    name: 'Shallow Drains',
    tagline: 'Open channel drainage',
    description: 'Precast shallow drain sections for surface water channelling around buildings and yards.',
    image: '/images/products/shallow-drain.jpg',
    order: 10,
  },
  {
    slug: 'sand-aggregates',
    name: 'Sand & Aggregates',
    tagline: 'Sand, ballast, quarry dust and chips',
    description:
      'Bulk sand and aggregates delivered by the Alexon tipper fleet. Priced on quotation because cost depends on load size and delivery distance.',
    image: '/images/products/sand-aggregates.jpg',
    order: 11,
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
