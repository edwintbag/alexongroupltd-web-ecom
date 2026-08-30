import type { Equipment } from '@/types';

/**
 * Plant, fleet and water services as printed in the catalogue.
 * Hire is a booking workflow, not an add-to-cart product.
 */

export const equipment: Equipment[] = [
  {
    id: 'eq-excavator',
    slug: 'excavator',
    name: 'Excavator',
    category: 'earthmoving',
    summary: 'Tracked excavator on hourly hire, with a breaker option for hard ground and demolition.',
    description:
      'The excavator handles bulk excavation, foundation digging, trenching and site clearance. Where the ground is rock or a slab has to come out, the machine works on breaker rates instead of bucket rates.',
    images: ['/images/equipment/excavator.jpg'],
    rates: [
      { label: 'Bucket rate', price: 6500, unit: 'per hour' },
      { label: 'Breaker rate', price: 8000, unit: 'per hour' },
    ],
    operatorIncluded: true,
    operatorAllowance: 3000,
    applications: ['Bulk excavation', 'Foundations', 'Trenching', 'Demolition and breaking', 'Site clearance'],
    specifications: { 'Hire basis': 'Hourly', Attachments: 'Bucket, Breaker', Operator: 'Supplied by Alexon' },
    availability: 'on-request',
  },
  {
    id: 'eq-backhoe',
    slug: 'backhoe',
    name: 'Backhoe',
    category: 'earthmoving',
    summary: 'Wheeled backhoe loader on hourly hire — loading at one end, digging at the other.',
    description:
      'A backhoe loader is the practical choice for compact sites and mixed work: loading and levelling with the front bucket, trenching and footing excavation with the rear arm, without needing two machines on site.',
    images: ['/images/equipment/backhoe.jpg', '/images/site/hero-backhoe.jpg'],
    rates: [{ label: 'Hire rate', price: 5000, unit: 'per hour' }],
    operatorIncluded: true,
    operatorAllowance: 3000,
    applications: ['Trenching', 'Footings and foundations', 'Loading', 'Backfilling', 'Site levelling'],
    specifications: { 'Hire basis': 'Hourly', Operator: 'Supplied by Alexon' },
    availability: 'on-request',
  },
  {
    id: 'eq-grader',
    slug: 'grader',
    name: 'Grader',
    category: 'roadworks',
    summary: 'Motor grader on hourly hire for road formation, levelling and shaping.',
    description:
      'The grader cuts and shapes road formation, spreads and levels murram, and reinstates access roads and compounds to a running surface.',
    images: ['/images/equipment/grader.jpg'],
    rates: [{ label: 'Hire rate', price: 5000, unit: 'per hour' }],
    operatorIncluded: true,
    applications: ['Road formation', 'Murram spreading', 'Levelling and shaping', 'Access road maintenance'],
    specifications: { 'Hire basis': 'Hourly' },
    availability: 'on-request',
    todo: 'Catalogue prints the grader rate as "Backet Rates Per Hour". Confirm the intended wording and whether an operator allowance applies.',
  },
  {
    id: 'eq-tippers',
    slug: 'tippers',
    name: 'Tippers',
    category: 'haulage',
    summary: 'Tipper haulage in two body sizes for aggregates, spoil and materials.',
    description:
      'The tipper fleet moves sand, ballast, murram, spoil and general materials to and from site. Two body sizes are carried so a small compound job is not charged for a full load it does not need.',
    images: ['/images/equipment/tippers.jpg', '/images/site/tipper-fleet.jpg'],
    rates: [
      { label: 'Mguu kumi', price: 20000, unit: 'per load', note: 'Ten-foot body' },
      { label: 'Mguu sita', price: 14000, unit: 'per load', note: 'Six-foot body' },
    ],
    operatorIncluded: true,
    applications: ['Aggregate delivery', 'Spoil removal', 'Murram haulage', 'Material transport'],
    availability: 'on-request',
    todo: 'Catalogue prints tipper prices without a unit. Confirm whether KES 20,000 / 14,000 is per load, per trip or per day, and the distance covered.',
  },
  {
    id: 'eq-lowbed',
    slug: 'lowbed-trailer',
    name: 'Lowbed Trailer',
    category: 'haulage',
    summary: 'Lowbed haulage for heavy plant machinery.',
    description:
      'Moving plant between sites needs a lowbed and a route plan. Alexon hauls excavators, backhoes, graders and similar heavy machinery. The rate depends on the machine, the distance and the route, so this one is quoted.',
    images: ['/images/equipment/lowbed-trailer.jpg'],
    rates: [],
    operatorIncluded: true,
    applications: ['Heavy plant machinery haulage', 'Inter-site machine transfers', 'Equipment delivery and collection'],
    availability: 'on-request',
    todo: 'Catalogue lists "Haulage of Heavy Plant Machinery" with no rate. Confirm pricing basis.',
  },
  {
    id: 'eq-clean-water',
    slug: 'clean-water',
    name: 'Clean Water Supply',
    category: 'water',
    summary: 'Bowser delivery of clean water to site or premises.',
    description:
      'Reliable clean water delivered by bowser to a construction site or to premises, for curing, mixing, dust suppression and domestic use.',
    images: ['/images/equipment/clean-water.jpg', '/images/site/water-bowser.jpg'],
    rates: [{ label: 'Clean water', price: 5000, unit: 'per delivery' }],
    operatorIncluded: true,
    applications: ['Concrete curing', 'Mixing water', 'Dust suppression', 'Domestic and premises supply'],
    availability: 'on-request',
    todo: 'Catalogue prints "Clean water 5,000 KES" without a unit. Confirm bowser capacity and the delivery radius the rate covers.',
  },
];

export const getEquipment = (slug: string) => equipment.find((e) => e.slug === slug);
