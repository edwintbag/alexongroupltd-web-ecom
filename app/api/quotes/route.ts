import { supabaseAdmin } from '@/lib/server/supabase';
import { quoteSchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';
import { notify } from '@/lib/server/mail';
import { makeReference } from '@/lib/server/reference';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const parsed = quoteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest();
  const d = parsed.data;
  const reference = makeReference('Q');

  const { data, error } = await supabaseAdmin!
    .from('quotes')
    .insert({
      name: d.name,
      company: d.company || null,
      phone: d.phone,
      email: d.email,
      site_location: d.siteLocation,
      enquiry_type: d.type ?? null,
      project_description: d.projectDescription || null,
      delivery_date: d.deliveryDate || null,
      notes: d.notes || null,
      items: d.items,
      reference,
    })
    .select('id')
    .single();

  if (error) {
    console.error('[alexon] quote insert failed', error);
    return serverError();
  }

  // Best-effort: the record is saved whether or not the emails go out.
  await notify('quotes', {
    reference,
    party: { name: d.name, email: d.email, phone: d.phone },
    subjectLine: 'Quote request',
    detailRows: [
      ['Company', d.company],
      ['Site location', d.siteLocation],
      ['Enquiry type', d.type],
      ['Needed by', d.deliveryDate],
      ['Project', d.projectDescription],
      ['Notes', d.notes],
    ],
    items: d.items,
    ackIntro:
      'Thanks — your quote request is with our team. We price against your site, your quantities and the delivery distance, and will come back to you with a written quotation.',
  });

  return ok({ id: data.id, reference });
}
