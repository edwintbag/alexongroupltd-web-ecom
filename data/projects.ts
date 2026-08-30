import type { Project } from '@/types';

/**
 * PLACEHOLDER CONTENT.
 * The supplied banner and catalogue contain no named projects, clients,
 * locations or dates. The three entries below are clearly-marked shells
 * that describe only what is visible in the supplied photographs, so the
 * page has a working structure. Replace `placeholder: true` entries with
 * real project records before going live.
 */
export const projects: Project[] = [
  {
    slug: 'placeholder-residential-build',
    name: 'Residential build — TODO: project name',
    location: 'TODO: location',
    category: 'residential',
    summary: 'Blockwork and columns going up on a residential build, with Alexon materials and site team.',
    supplied: ['Concrete blocks', 'Site team'],
    cover: '/images/site/site-masonry.jpg',
    gallery: ['/images/site/site-masonry.jpg', '/images/products/concrete-blocks.jpg'],
    placeholder: true,
  },
  {
    slug: 'placeholder-roadworks',
    name: 'Road formation — TODO: project name',
    location: 'TODO: location',
    category: 'roadworks',
    summary: 'Grader and excavator working a road formation, with tipper haulage on the same job.',
    supplied: ['Grader hire', 'Excavator hire', 'Tipper haulage'],
    cover: '/images/equipment/grader.jpg',
    gallery: ['/images/equipment/grader.jpg', '/images/equipment/excavator.jpg'],
    placeholder: true,
  },
  {
    slug: 'placeholder-water-supply',
    name: 'Water supply — TODO: project name',
    location: 'TODO: location',
    category: 'infrastructure',
    summary: 'Clean water delivered by bowser to premises alongside cabro laying works.',
    supplied: ['Clean water delivery', 'Cabros'],
    cover: '/images/site/water-bowser.jpg',
    gallery: ['/images/site/water-bowser.jpg', '/images/products/cabros-coloured.jpg'],
    placeholder: true,
  },
];

export const projectFilters = [
  { id: 'all', label: 'All' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'roadworks', label: 'Roadworks' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'concrete-supply', label: 'Concrete Supply' },
  { id: 'equipment-hire', label: 'Equipment Hire' },
] as const;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
