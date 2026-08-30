import { supabaseAdmin } from '@/lib/server/supabase';
import { quoteSchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const parsed = quoteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest();
  const d = parsed.data;

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
    })
    .select('id')
    .single();

  if (error) {
    console.error('[alexon] quote insert failed', error);
    return serverError();
  }
  return ok({ id: data.id });
}
