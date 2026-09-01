import { NextResponse } from 'next/server';
import { isSignedIn } from '@/lib/server/admin-auth';
import { supabaseAdmin } from '@/lib/server/supabase';
import { guardConfigured } from '@/lib/server/respond';

export const runtime = 'nodejs';

const TABLES = ['quotes', 'orders', 'bookings', 'applications', 'enquiries'] as const;
const STATUSES = ['new', 'in-progress', 'quoted', 'won', 'closed'] as const;

export async function POST(request: Request) {
  if (!isSignedIn()) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const body = await request.json().catch(() => null);
  const table = body?.table;
  const id = body?.id;
  const status = body?.status;

  if (!TABLES.includes(table) || typeof id !== 'string' || !STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { error } = await supabaseAdmin!.from(table).update({ status }).eq('id', id);
  if (error) {
    console.error('[alexon] status update failed', error);
    return NextResponse.json({ error: 'Could not update' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
