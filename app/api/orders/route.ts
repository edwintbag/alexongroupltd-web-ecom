import { supabaseAdmin } from '@/lib/server/supabase';
import { orderSchema } from '@/lib/server/schemas';
import { ok, badRequest, serverError, guardConfigured } from '@/lib/server/respond';
import { initiateStkPush, mpesaConfigured, normalisePhone } from '@/lib/server/mpesa';
import { notify } from '@/lib/server/mail';

export const runtime = 'nodejs';

function makeReference() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  return `ALX${stamp}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(request: Request) {
  const blocked = guardConfigured();
  if (blocked) return blocked;

  const parsed = orderSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return badRequest();
  const d = parsed.data;

  /**
   * The subtotal is recalculated here from the line items. Never trust the
   * total the browser sends — it is trivially editable.
   */
  const subtotal = d.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const reference = makeReference();

  const { data: order, error } = await supabaseAdmin!
    .from('orders')
    .insert({
      reference,
      customer: d.customer,
      delivery: d.delivery,
      lines: d.lines,
      subtotal,
      payment_method: d.payment.method,
      payment_status: d.payment.method === 'mpesa' ? 'pending' : 'awaiting-confirmation',
    })
    .select('id, reference')
    .single();

  if (error) {
    console.error('[alexon] order insert failed', error);
    return serverError();
  }

  const orderRows: [string, string | undefined | null][] = [
    ['Delivery', `${d.delivery.address}, ${d.delivery.town}, ${d.delivery.county}`],
    ['Method', d.delivery.method.replace(/-/g, ' ')],
    ['Site location', d.delivery.siteLocation],
    ['Payment', d.payment.method.toUpperCase()],
    ['Order total', `KES ${subtotal.toLocaleString('en-KE')} (delivery quoted separately)`],
    ['Notes', d.delivery.notes],
  ];

  const notifyOrder = () =>
    notify('orders', {
      reference: order.reference,
      party: { name: d.customer.fullName, email: d.customer.email, phone: d.customer.phone },
      subjectLine: 'New order',
      detailRows: orderRows,
      items: d.lines,
      ackIntro:
        'Thanks for your order. It is with the Alexon team, who will confirm the delivery cost for your location before anything is dispatched.',
    });

  // Card and bank orders are confirmed by Alexon directly — nothing to charge here.
  if (d.payment.method !== 'mpesa') {
    await notifyOrder();
    return ok({ id: order.id, reference: order.reference, payment: 'offline' });
  }

  if (!mpesaConfigured) {
    await notifyOrder();
    return ok({
      id: order.id,
      reference: order.reference,
      payment: 'offline',
      message: 'M-Pesa is not connected on this deployment. Alexon will confirm payment with you.',
    });
  }

  const phone = normalisePhone(d.customer.phone);
  if (!phone) {
    return badRequest('Enter your M-Pesa number as 07XXXXXXXX so we can send the prompt.');
  }

  try {
    const stk = await initiateStkPush({
      phone,
      amount: subtotal,
      reference: order.reference,
      description: 'Alexon order',
    });

    await supabaseAdmin!
      .from('orders')
      .update({ checkout_request_id: stk.checkoutRequestId, mpesa_phone: phone })
      .eq('id', order.id);

    await notifyOrder();

    return ok({
      id: order.id,
      reference: order.reference,
      payment: 'stk-sent',
      checkoutRequestId: stk.checkoutRequestId,
      message: stk.customerMessage,
    });
  } catch (err) {
    console.error('[alexon] STK push failed', err);
    await supabaseAdmin!
      .from('orders')
      .update({ payment_status: 'failed', failure_reason: 'Could not send the M-Pesa prompt' })
      .eq('id', order.id);
    return serverError('We saved your order but could not send the M-Pesa prompt. Alexon will call you.');
  }
}
