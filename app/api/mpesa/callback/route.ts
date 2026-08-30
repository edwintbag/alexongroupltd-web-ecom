import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server/supabase';
import { readMetadata, type StkCallback } from '@/lib/server/mpesa';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Safaricom POSTs the outcome of the STK push here. THIS is the only proof
 * that money moved — the response to the push itself only means the prompt
 * was delivered to the handset.
 *
 * Always answer 200. A non-200 makes Daraja retry, and a retry storm on a
 * payment that already succeeded is worse than a dropped log line.
 */
export async function POST(request: Request) {
  let payload: StkCallback;
  try {
    payload = (await request.json()) as StkCallback;
  } catch {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const callback = payload?.Body?.stkCallback;
  if (!callback || !supabaseAdmin) {
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  }

  const { CheckoutRequestID, ResultCode, ResultDesc } = callback;
  const paid = ResultCode === 0;
  const meta = paid ? readMetadata(callback) : null;

  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: paid ? 'paid' : 'failed',
      mpesa_receipt: meta?.receipt ?? null,
      failure_reason: paid ? null : ResultDesc,
      status: paid ? 'confirmed' : 'new',
    })
    .eq('checkout_request_id', CheckoutRequestID);

  if (error) console.error('[alexon] callback update failed', error);

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
