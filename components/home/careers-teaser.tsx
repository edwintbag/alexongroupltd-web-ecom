import Image from 'next/image';
import { ButtonLink } from '@/components/ui/button';

export function CareersTeaser() {
  return (
    <section className="section">
      <div className="shell grid items-center gap-10 border border-line md:grid-cols-2">
        <div className="p-8 md:p-12">
          <p className="eyebrow mb-5">Careers</p>
          <h2 className="text-display-sm text-bone">Build your career with Alexon</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mute">
            Production, construction, plant, logistics and water sit on one site — so operators, masons, drivers and yard teams learn the whole project, not one slice of it.
          </p>
          <ButtonLink href="/careers" variant="outline" className="mt-8">
            See opportunities
          </ButtonLink>
        </div>
        <div className="relative aspect-[16/11] w-full md:aspect-auto md:h-full md:min-h-[20rem]">
          <Image src="/images/site/production-line.jpg" alt="Alexon team operating the block-making line" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-void via-transparent to-transparent md:block" />
        </div>
      </div>
    </section>
  );
}
