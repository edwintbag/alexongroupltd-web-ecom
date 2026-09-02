import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { projects, getProject } from '@/data/projects';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MeasureRule } from '@/components/ui/measure-rule';
import { QuoteCTA } from '@/components/home/quote-cta';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) return {};
  return buildMetadata({ title: project.name, description: project.summary, path: `/projects/${project.slug}`, image: project.cover });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line">
        <Image src={project.cover} alt="" fill sizes="100vw" className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/55 to-void/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/70 via-void/10 to-transparent" />
        <div className="shell relative py-16 md:py-24">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Projects', href: '/projects' }, { name: project.name, href: `/projects/${project.slug}` }]} />
          <p className="eyebrow mb-4">
            {project.category.replace(/-/g, ' ')} {project.year ? `· ${project.year}` : ''}
          </p>
          <h1 className="max-w-3xl text-display-lg text-bone">{project.name}</h1>
          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold">{project.location}</p>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {project.placeholder ? (
              <p className="mb-8 flex gap-3 border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-warning">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <strong className="font-display uppercase tracking-wide">Placeholder record — </strong>
                  project name, location, date and description are awaiting Alexon’s own details.
                </span>
              </p>
            ) : null}
            <p className="max-w-prose text-base leading-relaxed text-mute">{project.description ?? project.summary}</p>
            <MeasureRule className="my-10" label="Gallery" />
            <ul className="grid gap-4 sm:grid-cols-2">
              {project.gallery.map((src, i) => (
                <li key={src} className="relative aspect-[4/3] overflow-hidden border border-line">
                  <Image src={src} alt={`${project.name} — image ${i + 1}`} fill sizes="(min-width:640px) 30vw, 100vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </div>

          <aside>
            <h2 className="eyebrow mb-5">What Alexon supplied</h2>
            <ul className="space-y-2">
              {project.supplied.map((s) => (
                <li key={s} className="flex items-center gap-3 border border-line px-4 py-3 text-sm text-bone">
                  <span className="h-1 w-4 shrink-0 bg-gold" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>

            {others.length ? (
              <>
                <h2 className="eyebrow mb-4 mt-10">More projects</h2>
                <ul className="space-y-1">
                  {others.map((other) => (
                    <li key={other.slug}>
                      <Link href={`/projects/${other.slug}`} className="flex items-baseline justify-between gap-3 border-b border-line py-3 text-sm text-mute transition-colors hover:text-gold">
                        {other.name}
                        <span className="font-mono text-[0.625rem] text-mute/60">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </aside>
        </div>
      </section>

      <QuoteCTA />
    </>
  );
}
