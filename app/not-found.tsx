import Link from 'next/link';
import { ButtonLink } from '@/components/ui/button';
import { MeasureRule } from '@/components/ui/measure-rule';

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-24">
      <p className="eyebrow mb-6">Error 404</p>
      <h1 className="max-w-2xl text-display-lg text-bone">This page is not on the drawing.</h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
        The link is broken or the page has moved. The catalogue, the plant list and the contact details are all still where you left them.
      </p>
      <MeasureRule className="my-10 max-w-md" label="404" />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/shop" variant="outline">Browse the catalogue</ButtonLink>
        <Link href="/contact" className="inline-flex h-11 items-center px-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mute hover:text-gold">
          Contact Alexon
        </Link>
      </div>
    </section>
  );
}
