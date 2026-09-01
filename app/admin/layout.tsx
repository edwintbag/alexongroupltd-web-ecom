import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { isSignedIn, adminConfigured } from '@/lib/server/admin-auth';
import { fetchNewCounts } from '@/lib/server/admin-data';
import { AdminNav } from '@/components/admin/admin-nav';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!adminConfigured()) {
    return (
      <div className="shell section">
        <h1 className="text-display-sm text-bone">Admin is not set up</h1>
        <p className="mt-4 max-w-prose text-sm leading-relaxed text-mute">
          Set <code className="font-mono text-gold">ADMIN_PASSWORD</code> (at least 8 characters) in your environment
          variables and redeploy.
        </p>
      </div>
    );
  }

  /**
   * The login page has its own layout segment, so anything reaching here
   * is a protected page.
   */
  if (!isSignedIn()) redirect('/admin/login');

  const counts = await fetchNewCounts();

  return (
    <div className="shell py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="eyebrow mb-2">Alexon Group Ltd</p>
          <h1 className="text-display-sm text-bone">Incoming</h1>
        </div>
        <Link href="/" className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mute hover:text-gold">
          View the site →
        </Link>
      </div>
      <AdminNav counts={counts} />
      <div className="mt-8">{children}</div>
    </div>
  );
}
