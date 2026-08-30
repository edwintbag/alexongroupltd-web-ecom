import { notFound } from 'next/navigation';
import { jobs, getJob } from '@/data/careers';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { ApplicationForm } from '@/components/careers/application-form';
import { MeasureRule } from '@/components/ui/measure-rule';
import { buildMetadata } from '@/lib/seo';
import { company } from '@/data/company';

export function generateStaticParams() {
  return jobs.map((j) => ({ slug: j.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const job = getJob(params.slug);
  if (!job) return {};
  return buildMetadata({ title: job.title, description: job.summary, path: `/careers/${job.slug}` });
}

export default function JobPage({ params }: { params: { slug: string } }) {
  const job = getJob(params.slug);
  if (!job) notFound();

  const jobJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    employmentType: job.employmentType.toUpperCase().replace('-', '_'),
    hiringOrganization: { '@type': 'Organization', name: company.legalName, sameAs: company.siteUrl },
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'KE' } },
    ...(job.closingDate ? { validThrough: job.closingDate } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobJsonLd) }} />
      <section className="shell section">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Careers', href: '/careers' }, { name: job.title, href: `/careers/${job.slug}` }]} />

        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div>
            <h1 className="text-display-md text-bone">{job.title}</h1>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-mute">
              <span className="border border-line px-3 py-1.5">{job.department}</span>
              <span className="border border-line px-3 py-1.5">{job.location}</span>
              <span className="border border-line px-3 py-1.5">{job.employmentType}</span>
              {job.closingDate ? <span className="border border-gold/40 px-3 py-1.5 text-gold">Closes {job.closingDate}</span> : null}
            </div>

            <MeasureRule className="my-9" />

            {job.introduction ? <p className="max-w-prose text-base leading-relaxed text-mute">{job.introduction}</p> : null}

            {job.responsibilities?.length ? (
              <div className="mt-10">
                <h2 className="eyebrow mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex gap-3 text-sm leading-relaxed text-mute">
                      <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {job.qualifications?.length ? (
              <div className="mt-10">
                <h2 className="eyebrow mb-4">Qualifications</h2>
                <ul className="space-y-2">
                  {job.qualifications.map((q) => (
                    <li key={q} className="flex gap-3 text-sm leading-relaxed text-mute">
                      <span className="mt-2 h-px w-4 shrink-0 bg-gold" aria-hidden />
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {job.applicationInstructions ? (
              <p className="mt-10 border border-line p-5 text-sm leading-relaxed text-mute">{job.applicationInstructions}</p>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28">
            <ApplicationForm position={job.title} />
          </aside>
        </div>
      </section>
    </>
  );
}
