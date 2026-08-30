import { NextResponse } from 'next/server';
import { supabaseConfigured } from './supabase';

export const badRequest = (message = 'Some details were missing or invalid.') =>
  NextResponse.json({ error: message }, { status: 400 });

export const serverError = (message = 'Could not save that. Please try again.') =>
  NextResponse.json({ error: message }, { status: 500 });

export const ok = (data: Record<string, unknown> = {}) => NextResponse.json({ ok: true, ...data });

/** Returned when the deployment has no Supabase credentials yet. */
export function guardConfigured() {
  if (supabaseConfigured) return null;
  return NextResponse.json(
    { error: 'The server is not connected to a database yet.' },
    { status: 503 },
  );
}
