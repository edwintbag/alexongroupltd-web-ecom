import { supabaseAdmin } from '@/lib/server/supabase';
import { enquirySchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const parsed = enquirySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest();
  const d = parsed.data;

  const { data, error } = await supabaseAdmin!
    .from('enquiries')
    .insert({ name: d.name, email: d.email, phone: d.phone, category: d.category, message: d.message })
    .select('id')
    .single();

  if (error) {
    console.error('[alexon] enquiry insert failed', error);
    return serverError();
  }
  return ok({ id: data.id });
}
