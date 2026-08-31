import { supabaseAdmin } from '@/lib/server/supabase';
import { applicationSchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';
import { notify } from '@/lib/server/mail';

export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Accepts multipart form data so the CV arrives with the application.
 * The file goes to the private 'cvs' bucket — we store the path, never a
 * public URL, so a CV is only ever reachable through a signed link.
 */
export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest();
  }

  const parsed = applicationSchema.safeParse({
    fullName: form.get('fullName'),
    email: form.get('email'),
    phone: form.get('phone'),
    location: form.get('location'),
    position: form.get('position'),
    message: form.get('message') ?? '',
  });
  if (!parsed.success) return badRequest();
  const d = parsed.data;

  const cv = form.get('cv');
  if (!(cv instanceof File)) return badRequest('Attach your CV.');
  if (cv.size > MAX_BYTES) return badRequest('Keep the CV under 5 MB.');
  if (!ACCEPTED.includes(cv.type)) return badRequest('Upload a PDF or Word document.');

  const safeName = cv.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}-${safeName}`;

  const upload = await supabaseAdmin!.storage
    .from('cvs')
    .upload(path, cv, { contentType: cv.type, upsert: false });

  if (upload.error) {
    console.error('[alexon] CV upload failed', upload.error);
    return serverError('Could not upload your CV. Please try again.');
  }

  const { data, error } = await supabaseAdmin!
    .from('applications')
    .insert({
      full_name: d.fullName,
      email: d.email,
      phone: d.phone,
      location: d.location,
      position: d.position,
      message: d.message || null,
      cv_path: path,
    })
    .select('id')
    .single();

  if (error) {
    // Don't leave an orphaned file behind if the row fails to write.
    await supabaseAdmin!.storage.from('cvs').remove([path]);
    console.error('[alexon] application insert failed', error);
    return serverError();
  }

  /**
   * A signed link rather than the CV itself: keeps the file in private
   * storage, keeps the email small, and the link expires.
   */
  const signed = await supabaseAdmin!.storage.from('cvs').createSignedUrl(path, 60 * 60 * 24 * 14);

  await notify('applications', {
    party: { name: d.fullName, email: d.email, phone: d.phone },
    subjectLine: `Job application — ${d.position}`,
    detailRows: [
      ['Position', d.position],
      ['Based in', d.location],
      ['About them', d.message],
      ['CV', signed.data?.signedUrl ? 'Download link below (valid 14 days)' : 'In Supabase storage'],
    ],
    ackIntro:
      'Thanks for applying. Your application and CV are with the Alexon team, and we will be in touch if your experience fits the role.',
  });

  return ok({ id: data.id, cvUrl: signed.data?.signedUrl ?? null });
}
