import 'server-only';
import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Deliberately simple auth: one shared password for the Alexon team.
 *
 * Per-person accounts would mean a login flow, password resets and user
 * management for a handful of people who all see the same queue. If that
 * changes, Supabase Auth slots in without touching the page components.
 *
 * The cookie holds an HMAC of the password, not the password itself, so a
 * stolen cookie cannot be turned back into the credential.
 */

const COOKIE = 'alexon_admin';
const MAX_AGE = 60 * 60 * 12; // 12 hours — a working day, then sign in again

function secret() {
  return process.env.ADMIN_PASSWORD?.trim() ?? '';
}

export const adminConfigured = () => secret().length >= 8;

function token(): string {
  return createHmac('sha256', secret()).update('alexon-admin-v1').digest('hex');
}

/** Constant-time compare so the check can't be timed character by character. */
function matches(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyPassword(input: string): boolean {
  const expected = secret();
  if (!expected) return false;
  return matches(input, expected);
}

export function issueSession() {
  cookies().set(COOKIE, token(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export function isSignedIn(): boolean {
  if (!adminConfigured()) return false;
  const cookie = cookies().get(COOKIE)?.value;
  if (!cookie) return false;
  return matches(cookie, token());
}
