import { AlertTriangle } from 'lucide-react';
import { ProjectsClient } from '@/components/projects/projects-client';
import { PageHero } from '@/components/ui/page-hero';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Projects',
  description: 'Construction, roadworks and supply projects delivered by Alexon Group Ltd.',
  path: '/projects',
  image: '/images/equipment/grader.jpg',
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Work delivered, start to finish."
        lede="Materials, plant and haulage on the same job, from the same yard."
        image="/images/equipment/grader.jpg"
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Projects', href: '/projects' }]}
      />

      <section className="section">
        <div className="shell">
          <p className="mb-10 flex gap-3 border border-warning/40 bg-warning/5 p-4 text-xs leading-relaxed text-warning">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              <strong className="font-display uppercase tracking-wide">Awaiting company data — </strong>
              the supplied banner and catalogue name no projects, clients, locations or dates. The entries below describe only
              what is visible in Alexon’s own photographs and are marked as placeholders. Replace them in{' '}
              <code className="font-mono text-warning/90">data/projects.ts</code> with real records, then delete this notice.
            </span>
          </p>
          <ProjectsClient />
        </div>
      </section>
    </>
  );
}
