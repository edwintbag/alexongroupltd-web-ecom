import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server/supabase';
import { guardConfigured } from '@/lib/server/respond';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Polled by the checkout page while the customer enters their PIN.
 * Returns only the payment state — never the full order record.
 */
export async function GET(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing order id' }, { status: 400 });

  const { data, error } = await supabaseAdmin!
    .from('orders')
    .select('payment_status, mpesa_receipt, reference, failure_reason')
    .eq('id', id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    status: data.payment_status,
    receipt: data.mpesa_receipt,
    reference: data.reference,
    reason: data.failure_reason,
  });
}
