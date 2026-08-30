/**
 * Domain models for Alexon Group Ltd.
 * These mirror the future backend tables (Supabase) one-for-one so that
 * `data/*.ts` can be swapped for API calls without touching components.
 */

export type Currency = 'KES';

/** How a customer is allowed to transact for a given offering. */
export type CommerceMode = 'purchase' | 'quote' | 'booking';

export type Availability = 'in-stock' | 'made-to-order' | 'on-request';

export interface ProductVariant {
  id: string;
  /** Human label shown on the card, e.g. "9 × 9 × 15 inch" */
  label: string;
  /** Raw dimension string as printed in the catalogue, used for the callout */
  dimension?: string;
  price?: number;
  /** Set when a variant needs its own photo; falls back to the product images */
  image?: string;
  availability?: Availability;
  /** Free-form attributes used by filters and the spec table */
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  images: string[];
  /** Unit the price is quoted against, e.g. "piece", "metre" */
  unit?: string;
  price?: number;
  currency: Currency;
  commerceMode: CommerceMode;
  featured?: boolean;
  availability: Availability;
  applications?: string[];
  specifications?: Record<string, string>;
  variants?: ProductVariant[];
  /** Anything the catalogue did not state clearly */
  todo?: string;
}

export interface ProductCategory {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  /** Order in the mega menu and category showcase */
  order: number;
}

export interface EquipmentRate {
  label: string;
  price: number;
  unit: string;
  note?: string;
}

export interface Equipment {
  id: string;
  slug: string;
  name: string;
  category: 'earthmoving' | 'haulage' | 'roadworks' | 'water';
  summary: string;
  description: string;
  images: string[];
  rates: EquipmentRate[];
  operatorIncluded: boolean;
  operatorAllowance?: number;
  applications: string[];
  specifications?: Record<string, string>;
  availability: Availability;
  todo?: string;
}

export interface Service {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  bullets: string[];
  image: string;
  cta: { label: string; href: string };
}

export interface Project {
  slug: string;
  name: string;
  location: string;
  category: 'residential' | 'commercial' | 'roadworks' | 'infrastructure' | 'concrete-supply' | 'equipment-hire';
  year?: string;
  summary: string;
  description?: string;
  supplied: string[];
  cover: string;
  gallery: string[];
  /** True when the entry is a placeholder awaiting company data */
  placeholder?: boolean;
}

export interface GalleryMedia {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: 'construction' | 'concrete-products' | 'cabros' | 'machinery' | 'logistics' | 'water-supply' | 'production';
  location?: string;
  /** Drives the masonry rhythm */
  aspect: 'portrait' | 'landscape' | 'square';
}

export interface Job {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Casual' | 'Internship';
  closingDate?: string;
  summary: string;
  introduction?: string;
  responsibilities?: string[];
  qualifications?: string[];
  skills?: string[];
  applicationInstructions?: string;
}

/* ---------- Commerce state ---------- */

export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  variantId?: string;
  variantLabel?: string;
  unitPrice: number;
  unit?: string;
  quantity: number;
  image: string;
}

export interface QuoteLine {
  key: string;
  kind: 'product' | 'equipment';
  refId: string;
  slug: string;
  name: string;
  variantLabel?: string;
  quantity: number;
  image: string;
  note?: string;
}

export interface WishlistEntry {
  productId: string;
  slug: string;
  addedAt: number;
}
