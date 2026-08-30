import { GalleryClient } from '@/components/gallery/gallery-client';
import { PageHero } from '@/components/ui/page-hero';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Gallery',
  description:
    'Photographs from the Alexon Group yard in Ugunja and from live sites — concrete production, construction, plant, logistics and clean water delivery.',
  path: '/gallery',
  image: '/images/site/production-line.jpg',
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Photographed at the yard and on site."
        lede="Every image here is Alexon’s own — the block line mid-press, plant working, the fleet loading. Nothing on this page is stock photography."
        image="/images/site/alexon-yard.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Gallery', href: '/gallery' }]}
      />
      <section className="section">
        <div className="shell">
          <GalleryClient />
        </div>
      </section>
    </>
  );
}
