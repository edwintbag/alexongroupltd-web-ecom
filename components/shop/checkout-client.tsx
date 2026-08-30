'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Check, Smartphone, CreditCard, Building2, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { cartSubtotal, useCart } from '@/store/cart';
import { useHydrated } from '@/hooks/use-hydrated';
import { Field, inputStyles, textareaStyles, selectStyles } from '@/components/forms/field';
import { FormStatus } from '@/components/forms/form-status';
import { Button, ButtonLink } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { submitOrder, pollPaymentStatus, type OrderResult } from '@/lib/submit';
import { formatKES, cn } from '@/lib/utils';

const steps = ['Your details', 'Delivery', 'Payment', 'Review'] as const;

const counties = ['Siaya', 'Kisumu', 'Busia', 'Vihiga', 'Kakamega', 'Homa Bay', 'Migori', 'Bungoma', 'Nairobi', 'Other'];

const paymentMethods = [
  { id: 'mpesa', label: 'M-Pesa', icon: Smartphone, note: 'Pay to the Alexon paybill on confirmation' },
  { id: 'card', label: 'Card', icon: CreditCard, note: 'Visa or Mastercard' },
  { id: 'bank', label: 'Bank transfer', icon: Building2, note: 'Details sent with your invoice' },
] as const;

export function CheckoutClient() {
  const { lines, clear } = useCart();
  const hydrated = useHydrated();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [payState, setPayState] = useState<'none' | 'awaiting' | 'paid' | 'failed' | 'timeout'>('none');
  const [result, setResult] = useState<OrderResult | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [failReason, setFailReason] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    county: 'Siaya',
    town: '',
    address: '',
    siteLocation: '',
    method: 'site-delivery',
    notes: '',
    payment: 'mpesa' as 'mpesa' | 'card' | 'bank',
    deliveryQuote: true,
  });

  const set = (key: keyof typeof form, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
  const subtotal = cartSubtotal(lines);
  const [subtotalAtOrder, setSubtotalAtOrder] = useState(0);

  if (!hydrated) return <div className="skeleton h-96" />;

  if (state === 'success') {
    return (
      <div className="mx-auto max-w-xl">
        {payState === 'awaiting' ? (
          <div className="border border-gold/40 bg-gold/5 p-6" role="status" aria-live="polite">
            <p className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-wide text-gold">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Check your phone
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              We sent an M-Pesa request to {form.phone}. Enter your PIN to pay {formatKES(subtotalAtOrder)}. This page updates
              on its own — keep it open.
            </p>
            {result?.reference ? (
              <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-mute">
                Order {result.reference}
              </p>
            ) : null}
          </div>
        ) : payState === 'paid' ? (
          <div className="border border-success/40 bg-success/5 p-6" role="status">
            <p className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-wide text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden />
              Payment received
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Order {result?.reference} is confirmed. Alexon will call you to arrange the delivery and confirm the haulage cost.
            </p>
            {receipt ? (
              <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-gold">
                M-Pesa receipt {receipt}
              </p>
            ) : null}
          </div>
        ) : payState === 'failed' || payState === 'timeout' ? (
          <div className="border border-warning/40 bg-warning/5 p-6" role="alert">
            <p className="flex items-center gap-3 font-display text-sm font-bold uppercase tracking-wide text-warning">
              <XCircle className="h-4 w-4" aria-hidden />
              {payState === 'timeout' ? 'No confirmation yet' : 'Payment not completed'}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              {payState === 'timeout'
                ? 'We have not heard back from M-Pesa yet. If you entered your PIN, the payment may still land — Alexon will confirm.'
                : failReason ?? 'The M-Pesa request was cancelled or timed out.'}{' '}
              Your order {result?.reference} is saved either way. Call 0701 381 197 to sort out payment.
            </p>
          </div>
        ) : (
          <FormStatus
            state="success"
            successTitle="Order received"
            successBody={`Order ${result?.reference ?? ''} is with the Alexon team. We will confirm the delivery cost and payment details with you directly.`}
          />
        )}

        <div className="mt-6 flex gap-3">
          <ButtonLink href="/shop" variant="outline">Back to the shop</ButtonLink>
          <ButtonLink href="/contact">Contact Alexon</ButtonLink>
        </div>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <EmptyState
        title="Nothing to check out"
        body="Add materials to your cart first, or send a quote request if you need bulk pricing."
        action={<ButtonLink href="/shop">Browse the catalogue</ButtonLink>}
      />
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    if (step === 0) {
      if (!form.fullName.trim()) next.fullName = 'Enter your full name';
      if (!/^[0-9+\s-]{9,}$/.test(form.phone)) next.phone = 'Enter a phone number we can reach you on';
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    }
    if (step === 1) {
      if (!form.town.trim()) next.town = 'Which town or trading centre?';
      if (!form.address.trim()) next.address = 'Where should the load go?';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => {
    if (validate()) setStep((s) => Math.min(steps.length - 1, s + 1));
  };

  const submit = async () => {
    setState('submitting');
    setSubtotalAtOrder(subtotal);
    try {
      const res = await submitOrder({
        customer: { fullName: form.fullName, phone: form.phone, email: form.email },
        delivery: { county: form.county, town: form.town, address: form.address, siteLocation: form.siteLocation, method: form.method, notes: form.notes },
        payment: { method: form.payment },
        lines: lines.map((l) => ({ name: l.name, variant: l.variantLabel, quantity: l.quantity, unitPrice: l.unitPrice })),
        subtotal,
      });

      setResult(res);
      clear();
      setState('success');

      // An STK push only means the prompt was delivered. Wait for the
      // callback to tell us whether money actually moved.
      if (res.payment === 'stk-sent') {
        setPayState('awaiting');
        const outcome = await pollPaymentStatus(res.id);
        if (outcome.status === 'paid') {
          setReceipt(outcome.receipt ?? null);
          setPayState('paid');
        } else if (outcome.status === 'failed') {
          setFailReason(outcome.reason ?? null);
          setPayState('failed');
        } else {
          setPayState('timeout');
        }
      }
    } catch {
      setState('error');
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div>
        <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2">
          {steps.map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={cn(
                  'grid h-6 w-6 place-items-center border font-mono text-[0.625rem] tabular-nums',
                  i < step ? 'border-gold bg-gold text-void' : i === step ? 'border-gold text-gold' : 'border-line text-mute',
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className={cn('font-mono text-[0.625rem] uppercase tracking-[0.14em]', i === step ? 'text-bone' : 'text-mute')}>{label}</span>
            </li>
          ))}
        </ol>

        {step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required error={errors.fullName} className="sm:col-span-2">
              <input className={inputStyles} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} autoComplete="name" />
            </Field>
            <Field label="Phone" required error={errors.phone}>
              <input className={inputStyles} value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" placeholder="07xx xxx xxx" />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input className={inputStyles} value={form.email} onChange={(e) => set('email', e.target.value)} inputMode="email" autoComplete="email" />
            </Field>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="County" required>
              <select className={selectStyles} value={form.county} onChange={(e) => set('county', e.target.value)}>
                {counties.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Town or trading centre" required error={errors.town}>
              <input className={inputStyles} value={form.town} onChange={(e) => set('town', e.target.value)} />
            </Field>
            <Field label="Delivery address" required error={errors.address} className="sm:col-span-2">
              <input className={inputStyles} value={form.address} onChange={(e) => set('address', e.target.value)} autoComplete="street-address" />
            </Field>
            <Field label="Site location" hint="Optional" className="sm:col-span-2">
              <input className={inputStyles} value={form.siteLocation} onChange={(e) => set('siteLocation', e.target.value)} placeholder="Landmark, plot number or pinned location" />
            </Field>
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">How do you want it?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: 'pickup', label: 'Pick up from Ugunja', note: 'No haulage charge' },
                  { id: 'local-delivery', label: 'Local delivery', note: 'Within the Ugunja area' },
                  { id: 'site-delivery', label: 'Site delivery', note: 'Quoted on distance and load' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      'cursor-pointer border p-4 transition-colors',
                      form.method === m.id ? 'border-gold bg-gold/5' : 'border-line hover:border-bone/30',
                    )}
                  >
                    <input type="radio" name="method" value={m.id} checked={form.method === m.id} onChange={(e) => set('method', e.target.value)} className="sr-only" />
                    <span className="block font-display text-xs font-bold uppercase tracking-wide text-bone">{m.label}</span>
                    <span className="mt-1 block text-[0.6875rem] text-mute">{m.note}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="Notes for the driver" hint="Optional" className="sm:col-span-2">
              <textarea className={textareaStyles} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Access, offloading, gate times…" />
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div className="grid gap-2 sm:grid-cols-3">
              {paymentMethods.map((m) => {
                const Icon = m.icon;
                return (
                  <label
                    key={m.id}
                    className={cn(
                      'cursor-pointer border p-5 transition-colors',
                      form.payment === m.id ? 'border-gold bg-gold/5' : 'border-line hover:border-bone/30',
                    )}
                  >
                    <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={() => set('payment', m.id)} className="sr-only" />
                    <Icon className={cn('h-5 w-5', form.payment === m.id ? 'text-gold' : 'text-mute')} aria-hidden />
                    <span className="mt-3 block font-display text-sm font-bold uppercase tracking-wide text-bone">{m.label}</span>
                    <span className="mt-1 block text-[0.6875rem] leading-relaxed text-mute">{m.note}</span>
                  </label>
                );
              })}
            </div>
            <p className="mt-5 border border-warning/35 bg-warning/5 p-4 text-xs leading-relaxed text-warning">
              Choosing M-Pesa sends a payment prompt to the phone number you gave us. Card and bank orders are recorded and Alexon confirms payment with you directly.
            </p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-6">
            <dl className="divide-y divide-line border-y border-line text-sm">
              {[
                ['Name', form.fullName],
                ['Phone', form.phone],
                ['Email', form.email],
                ['Delivery', `${form.address}, ${form.town}, ${form.county}`],
                ['Method', form.method.replace(/-/g, ' ')],
                ['Payment', form.payment.toUpperCase()],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-3">
                  <dt className="text-mute">{k}</dt>
                  <dd className="text-right text-bone">{v}</dd>
                </div>
              ))}
            </dl>
            <FormStatus state={state} successTitle="" successBody="" />
          </div>
        ) : null}

        <div className="mt-10 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button size="lg" onClick={next}>
              Continue
            </Button>
          ) : (
            <Button size="lg" onClick={submit} disabled={state === 'submitting'}>
              {state === 'submitting' ? 'Placing order…' : 'Place order'}
            </Button>
          )}
        </div>
      </div>

      <aside className="border border-line p-6 lg:sticky lg:top-28">
        <h2 className="eyebrow mb-5">{lines.length} items</h2>
        <ul className="space-y-4 border-b border-line pb-5">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-3">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-line">
                <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-xs font-bold uppercase tracking-wide text-bone">{l.name}</span>
                <span className="block font-mono text-[0.625rem] text-mute">
                  {l.variantLabel ? `${l.variantLabel} · ` : ''}×{l.quantity}
                </span>
              </span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-bone">{formatKES(l.unitPrice * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between py-5">
          <span className="font-display text-sm font-bold uppercase tracking-[0.14em] text-bone">Subtotal</span>
          <span className="font-mono text-lg tabular-nums text-bone">{formatKES(subtotal)}</span>
        </div>
        <p className="text-[0.6875rem] leading-relaxed text-mute">Delivery quoted separately once we have your location and load size.</p>
      </aside>
    </div>
  );
}
