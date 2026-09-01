import type { Service } from '@/types';

/** Five service lines, exactly as listed on the Alexon banner. */
export const services: Service[] = [
  {
    slug: 'concrete-products',
    name: 'Concrete Products',
    tagline: 'Made in Ugunja, delivered to site',
    summary:
      'Blocks, cabros, fencing posts, copings and culverts pressed and cured at the Alexon yard, then delivered on our own fleet.',
    bullets: ['Blocks', 'Cabros', 'Fencing posts', 'Copings', 'Culverts'],
    image: '/images/site/production-line.jpg',
    cta: { label: 'Shop products', href: '/shop' },
  },
  {
    slug: 'construction',
    name: 'Construction',
    tagline: 'Residential, commercial and roadworks',
    summary:
      'Alexon builds as well as supplies — homes, commercial premises and road works, with materials and plant coming from the same yard.',
    bullets: ['Residential', 'Commercial', 'Roadworks'],
    image: '/images/site/site-masonry.jpg',
    cta: { label: 'Get a project quote', href: '/request-quote?type=construction' },
  },
  {
    slug: 'machine-hire',
    name: 'Machine Hire',
    tagline: 'Plant with skilled operators',
    summary:
      'Excavators, backhoes and mixers hired with skilled operators, charged by the hour so short jobs stay affordable.',
    bullets: ['Excavators', 'Backhoes', 'Mixers', 'Skilled operators'],
    image: '/images/equipment/excavator.jpg',
    cta: { label: 'Hire equipment', href: '/equipment' },
  },
  {
    slug: 'clean-water-supply',
    name: 'Clean Water Supply',
    tagline: 'Bowser delivery, site or premises',
    summary:
      'Reliable bowser delivery of clean water to your site or premises — for curing, mixing, dust control and daily use.',
    bullets: ['Site delivery', 'Premises delivery', 'Curing and mixing water'],
    image: '/images/equipment/clean-water.jpg',
    cta: { label: 'Request water delivery', href: '/equipment/clean-water' },
  },
  {
    slug: 'logistics',
    name: 'Logistics',
    tagline: 'Tippers, lorries and pick-ups',
    summary:
      'A fleet of tippers, lorries and pick-ups moving materials, aggregates and plant across the region.',
    bullets: ['Tippers', 'Lorries', 'Pick-ups', 'Heavy plant haulage'],
    image: '/images/equipment/fleet.jpg',
    cta: { label: 'Arrange transport', href: '/request-quote?type=logistics' },
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

/** The scroll-driven homepage sequence. Order carries meaning: it is the order a real project runs in. */
export const projectJourney = [
  { step: '01', title: 'Materials', body: 'Blocks, cabros, culverts and aggregates from the Alexon yard.', image: '/images/products/concrete-blocks.jpg', href: '/shop' },
  { step: '02', title: 'Construction', body: 'Residential, commercial and road works built by our own teams.', image: '/images/site/site-masonry.jpg', href: '/services/construction' },
  { step: '03', title: 'Equipment', body: 'Excavators, backhoes and graders with skilled operators.', image: '/images/equipment/excavator.jpg', href: '/equipment' },
  { step: '04', title: 'Water', body: 'Clean water by bowser for curing, mixing and daily site use.', image: '/images/equipment/clean-water.jpg', href: '/equipment/clean-water' },
  { step: '05', title: 'Logistics', body: 'Tippers, lorries and lowbed haulage keeping the site supplied.', image: '/images/site/tipper-fleet.jpg', href: '/services/logistics' },
] as const;
