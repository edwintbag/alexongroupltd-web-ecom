import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client.
 *
 * This bypasses row level security, so it must never be imported from a
 * client component. The 'server-only' import above turns that mistake into
 * a build error rather than a leaked key.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Thrown at request time rather than build time so the site still builds
  // before credentials are added.
  console.warn('[alexon] Supabase env vars missing — API routes will return 503.');
}

export const supabaseAdmin =
  url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;

export const supabaseConfigured = Boolean(url && serviceKey);
