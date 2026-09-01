import { fetchRows } from '@/lib/server/admin-data';
import { shapeEnquiry } from '@/lib/server/admin-shape';
import { RecordList } from '@/components/admin/record-list';

export const dynamic = 'force-dynamic';

export default async function EnquiriesPage() {
  const rows = await fetchRows('enquiries');
  return (
    <RecordList
      table="enquiries"
      records={rows.map(shapeEnquiry)}
      emptyMessage="Messages from the contact form will appear here."
    />
  );
}
