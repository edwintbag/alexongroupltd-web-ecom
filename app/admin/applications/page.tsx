import { fetchRows } from '@/lib/server/admin-data';
import { shapeApplication } from '@/lib/server/admin-shape';
import { RecordList } from '@/components/admin/record-list';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
  const rows = await fetchRows('applications');
  return (
    <RecordList
      table="applications"
      records={rows.map(shapeApplication)}
      emptyMessage="Job applications and talent network sign-ups will appear here."
    />
  );
}
