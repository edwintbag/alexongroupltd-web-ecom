import { supabaseAdmin } from '@/lib/server/supabase';
import { bookingSchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest();
  const d = parsed.data;

  const { data, error } = await supabaseAdmin!
    .from('bookings')
    .insert({
      equipment: d.equipment,
      name: d.name,
      phone: d.phone,
      email: d.email,
      site_location: d.siteLocation,
      start_date: d.startDate,
      duration: d.duration,
      notes: d.notes || null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[alexon] booking insert failed', error);
    return serverError();
  }
  return ok({ id: data.id });
}
