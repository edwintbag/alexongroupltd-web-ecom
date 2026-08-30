import Image from 'next/image';
import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';
import { jobs, cultureValues, departments } from '@/data/careers';
import { PageHero } from '@/components/ui/page-hero';
import { EmptyState } from '@/components/ui/empty-state';
import { ApplicationForm } from '@/components/careers/application-form';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { MeasureRule } from '@/components/ui/measure-rule';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Careers',
  description:
    'Build your career with Alexon Group Ltd in Ugunja, Siaya County — production, construction, plant, logistics and water supply roles.',
  path: '/careers',
  image: '/images/site/production-line.jpg',
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build your career with Alexon."
        lede="Five trades run out of one yard on the Kisumu–Busia highway. Operators, masons, drivers and yard teams here see a project from the first load to the last channel."
        image="/images/site/site-masonry.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Careers', href: '/careers' }]}
      />

      <section className="section">
        <div className="shell grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden border border-line">
              <Image src="/images/site/production-line.jpg" alt="The Alexon team running the block-making line" fill sizes="(min-width:1024px) 44vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/70 to-transparent" />
            </div>
          </Reveal>
          <div>
            <p className="eyebrow mb-5">Why work here</p>
            <h2 className="max-w-lg text-display-md text-bone">The yard is the classroom.</h2>
            <MeasureRule className="my-9" />
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {cultureValues.map((value, i) => (
                <Reveal key={value.title} delay={i * 0.06}>
                  <dt className="flex items-baseline gap-3 font-display text-base font-bold uppercase tracking-tight text-bone">
                    <span className="font-mono text-[0.625rem] font-normal text-gold">{String(i + 1).padStart(2, '0')}</span>
                    {value.title}
                  </dt>
                  <dd className="mt-2 pl-8 text-sm leading-relaxed text-mute">{value.body}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="section border-y border-line bg-slate-900/30">
        <div className="shell">
          <SectionHeading eyebrow="Departments" title="Where the work happens" />
          <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, i) => (
              <li key={dept} className="flex items-baseline gap-4 bg-ink p-6">
                <span className="font-mono text-[0.625rem] tabular-nums text-gold">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-base font-bold uppercase tracking-wide text-bone">{dept}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading eyebrow="Open roles" title="Current opportunities" />

          <div className="mt-10">
            {jobs.length === 0 ? (
              <EmptyState
                icon={<BriefcaseBusiness className="h-8 w-8" />}
                title="No current vacancies"
                body="Nothing is open right now. Leave your details and CV with us — when a role opens in production, plant, logistics or on site, we look here first."
              />
            ) : (
              <ul className="space-y-3">
                {jobs.map((job) => (
                  <li key={job.slug}>
                    <Link href={`/careers/${job.slug}`} className="group flex flex-wrap items-center justify-between gap-4 border border-line p-6 transition-colors hover:border-gold/50">
                      <span>
                        <span className="block font-display text-xl font-bold uppercase tracking-tight text-bone group-hover:text-gold">{job.title}</span>
                        <span className="mt-1 block text-sm text-mute">{job.summary}</span>
                      </span>
                      <span className="flex flex-wrap gap-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
                        <span className="border border-line px-2 py-1">{job.department}</span>
                        <span className="border border-line px-2 py-1">{job.location}</span>
                        <span className="border border-line px-2 py-1">{job.employmentType}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-12 max-w-3xl">
            <ApplicationForm talentNetwork />
          </div>
        </div>
      </section>
    </>
  );
}
