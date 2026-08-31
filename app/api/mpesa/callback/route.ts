import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/server/supabase';
import { readMetadata, type StkCallback } from '@/lib/server/mpesa';
import { notify } from '@/lib/server/mail';

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

  const { data: updated, error } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: paid ? 'paid' : 'failed',
      mpesa_receipt: meta?.receipt ?? null,
      failure_reason: paid ? null : ResultDesc,
      status: paid ? 'confirmed' : 'new',
    })
    .eq('checkout_request_id', CheckoutRequestID)
    .select('reference, customer, subtotal')
    .maybeSingle();

  if (error) console.error('[alexon] callback update failed', error);

  // Only a paid callback is worth emailing about — a cancelled PIN prompt
  // is not news, and the customer already saw it on screen.
  if (paid && updated) {
    const customer = updated.customer as { fullName: string; email: string; phone: string };
    await notify('orders', {
      reference: updated.reference,
      party: { name: customer.fullName, email: customer.email, phone: customer.phone },
      subjectLine: 'Payment received',
      detailRows: [
        ['Amount paid', `KES ${Number(meta?.amount ?? updated.subtotal).toLocaleString('en-KE')}`],
        ['M-Pesa receipt', meta?.receipt],
        ['Paid from', meta?.phone],
      ],
      ackIntro:
        'Your payment has been received and your order is confirmed. The Alexon team will be in touch to arrange delivery.',
    });
  }

  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
}
