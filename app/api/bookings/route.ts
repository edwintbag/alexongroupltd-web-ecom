import { supabaseAdmin } from '@/lib/server/supabase';
import { bookingSchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';
import { notify } from '@/lib/server/mail';
import { makeReference } from '@/lib/server/reference';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest();
  const d = parsed.data;
  const reference = makeReference('H');

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
      reference,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[alexon] booking insert failed', error);
    return serverError();
  }

  await notify('bookings', {
    reference,
    party: { name: d.name, email: d.email, phone: d.phone },
    subjectLine: `Equipment request — ${d.equipment}`,
    detailRows: [
      ['Machine', d.equipment],
      ['Site location', d.siteLocation],
      ['Start date', d.startDate],
      ['Duration', d.duration],
      ['Notes', d.notes],
    ],
    ackIntro: `Thanks — your request for the ${d.equipment.toLowerCase()} is with our team. We will confirm availability for your dates and the rate for the job.`,
  });

  return ok({ id: data.id, reference });
}
