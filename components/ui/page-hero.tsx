import Image from 'next/image';
import { Breadcrumb } from './breadcrumb';

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  image: string;
  crumbs: { name: string; href: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <Image src={image} alt="" fill sizes="100vw" className="object-cover" priority />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/92 to-void/55" />
      <div className="grain absolute inset-0" />
      <div className="shell relative py-16 md:py-24">
        <Breadcrumb items={crumbs} />
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="max-w-3xl text-display-lg text-bone">{title}</h1>
        {lede ? <p className="mt-5 max-w-xl text-base leading-relaxed text-mute">{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}
