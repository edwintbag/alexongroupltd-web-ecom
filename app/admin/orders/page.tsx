import { fetchRows } from '@/lib/server/admin-data';
import { shapeOrder } from '@/lib/server/admin-shape';
import { RecordList } from '@/components/admin/record-list';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const rows = await fetchRows('orders');
  return (
    <RecordList
      table="orders"
      records={rows.map(shapeOrder)}
      emptyMessage="Orders placed through checkout will appear here."
    />
  );
}
