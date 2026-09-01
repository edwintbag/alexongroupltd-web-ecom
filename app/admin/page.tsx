import { fetchRows } from '@/lib/server/admin-data';
import { shapeQuote } from '@/lib/server/admin-shape';
import { RecordList } from '@/components/admin/record-list';

export const dynamic = 'force-dynamic';

export default async function QuotesPage() {
  const rows = await fetchRows('quotes');
  return (
    <RecordList
      table="quotes"
      records={rows.map(shapeQuote)}
      emptyMessage="Quote requests from the website will appear here."
    />
  );
}
