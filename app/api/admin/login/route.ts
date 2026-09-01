import { NextResponse } from 'next/server';
import { verifyPassword, issueSession, adminConfigured } from '@/lib/server/admin-auth';

export const runtime = 'nodejs';

/** Crude in-memory rate limit. Resets on redeploy, which is fine for this. */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX = 8;

export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: 'Admin access is not configured on this deployment.' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now - record.first < WINDOW && record.count >= MAX) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === 'string' ? body.password : '';

  if (!verifyPassword(password)) {
    attempts.set(
      ip,
      record && now - record.first < WINDOW ? { count: record.count + 1, first: record.first } : { count: 1, first: now },
    );
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  }

  attempts.delete(ip);
  issueSession();
  return NextResponse.json({ ok: true });
}
