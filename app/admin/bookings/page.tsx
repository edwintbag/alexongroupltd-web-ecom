import { fetchRows } from '@/lib/server/admin-data';
import { shapeBooking } from '@/lib/server/admin-shape';
import { RecordList } from '@/components/admin/record-list';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const rows = await fetchRows('bookings');
  return (
    <RecordList
      table="bookings"
      records={rows.map(shapeBooking)}
      emptyMessage="Equipment hire requests will appear here."
    />
  );
}
