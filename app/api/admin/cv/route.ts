import { NextResponse } from 'next/server';
import { isSignedIn } from '@/lib/server/admin-auth';
import { supabaseAdmin } from '@/lib/server/supabase';

export const runtime = 'nodejs';

/**
 * Mints a short-lived signed URL for a CV. The bucket stays private —
 * links are generated on demand and expire in an hour.
 */
export async function GET(request: Request) {
  if (!isSignedIn()) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const path = new URL(request.url).searchParams.get('path');
  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 });

  const { data, error } = await supabaseAdmin.storage.from('cvs').createSignedUrl(path, 60 * 60);
  if (error || !data) return NextResponse.json({ error: 'Could not create link' }, { status: 500 });

  return NextResponse.redirect(data.signedUrl);
}
