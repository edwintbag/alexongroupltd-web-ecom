import { categories } from '@/data/categories';
import { services } from '@/data/services';
import { equipment } from '@/data/equipment';

export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/shop', mega: 'products' as const },
  { label: 'Services', href: '/services', mega: 'services' as const },
  { label: 'Equipment Hire', href: '/equipment', mega: 'equipment' as const },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export const megaProducts = categories.map((c) => ({
  label: c.name,
  href: `/shop?category=${c.slug}`,
  image: c.image,
  tagline: c.tagline,
}));

export const megaServices = services.map((s) => ({
  label: s.name,
  href: `/services/${s.slug}`,
  image: s.image,
  tagline: s.tagline,
}));

export const megaEquipment = equipment.map((e) => ({
  label: e.name,
  href: `/equipment/${e.slug}`,
  image: e.images[0],
  tagline: e.summary,
}));
