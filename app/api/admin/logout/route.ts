import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/server/admin-auth';

export const runtime = 'nodejs';

export async function POST() {
  clearSession();
  return NextResponse.json({ ok: true });
}
