import Image from 'next/image';
import Link from 'next/link';
import { gallery } from '@/data/gallery';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

const picks = ['g-02', 'g-03', 'g-19', 'g-08', 'g-22', 'g-04'];

export function GalleryPreview() {
  const items = picks.map((id) => gallery.find((g) => g.id === id)).filter(Boolean);
  return (
    <section className="section">
      <div className="shell">
        <SectionHeading
          eyebrow="From the yard"
          title="Real work, photographed on site"
          lede="Every photograph on this site was taken at the Alexon yard in Ugunja or on a live job. Nothing is stock."
          action={<ButtonLink href="/gallery" variant="outline">Open the gallery</ButtonLink>}
        />
        <div className="mt-12 grid auto-rows-[minmax(9rem,auto)] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {items.map((item, i) => (
            <Reveal
              key={item!.id}
              delay={i * 0.05}
              className={i === 0 ? 'col-span-2 row-span-2' : i === 3 ? 'md:row-span-2' : ''}
            >
              <Link href="/gallery" className="group relative block h-full min-h-[9rem] overflow-hidden border border-line">
                <Image src={item!.src} alt={item!.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 ease-rule group-hover:scale-105" />
                <span className="absolute inset-0 bg-void/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-2 p-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-bone opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item!.caption}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
