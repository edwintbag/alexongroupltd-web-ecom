'use client';

import { useState } from 'react';
import type { Equipment } from '@/types';
import { Field, inputStyles, textareaStyles, selectStyles } from '@/components/forms/field';
import { FormStatus } from '@/components/forms/form-status';
import { Button } from '@/components/ui/button';
import { submitBooking } from '@/lib/submit';
import { useQuote } from '@/store/quote';
import { useToast } from '@/components/ui/toast';

const durations = ['Half day', 'Full day', '2–3 days', 'One week', 'Longer / ongoing'];

export function BookingForm({ item }: { item: Equipment }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const addQuote = useQuote((s) => s.add);
  const push = useToast((s) => s.push);
  const [form, setForm] = useState({ name: '', phone: '', email: '', siteLocation: '', startDate: '', duration: 'Full day', notes: '' });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Enter your name';
    if (!/^[0-9+\s-]{9,}$/.test(form.phone)) next.phone = 'Enter a phone number we can reach you on';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.siteLocation.trim()) next.siteLocation = 'Where is the machine going?';
    if (!form.startDate) next.startDate = 'When do you need it?';
    setErrors(next);
    if (Object.keys(next).length) return;

    setState('submitting');
    try {
      await submitBooking({ equipment: item.name, ...form });
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <FormStatus
        state="success"
        successTitle="Request sent"
        successBody={`Your ${item.name.toLowerCase()} request is with the Alexon team. We will confirm availability for your dates and come back with the rate for the job.`}
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-line p-6 md:p-8">
      <h2 className="eyebrow mb-6">Request this machine</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          <input className={inputStyles} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <input className={inputStyles} value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input className={inputStyles} value={form.email} onChange={(e) => set('email', e.target.value)} inputMode="email" autoComplete="email" />
        </Field>
        <Field label="Site location" required error={errors.siteLocation}>
          <input className={inputStyles} value={form.siteLocation} onChange={(e) => set('siteLocation', e.target.value)} placeholder="Town or landmark" />
        </Field>
        <Field label="Start date" required error={errors.startDate}>
          <input type="date" className={inputStyles} value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
        </Field>
        <Field label="How long?">
          <select className={selectStyles} value={form.duration} onChange={(e) => set('duration', e.target.value)}>
            {durations.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="What is the work?" hint="Optional" className="sm:col-span-2">
          <textarea className={textareaStyles} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Ground conditions, access, what needs moving or breaking…" />
        </Field>
      </div>

      <div className="mt-6">
        <FormStatus state={state} successTitle="" successBody="" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : `Request ${item.name.toLowerCase()}`}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => {
            addQuote({ kind: 'equipment', refId: item.id, slug: item.slug, name: item.name, quantity: 1, image: item.images[0] });
            push(`${item.name} added to your quote basket`);
          }}
        >
          Add to quote basket
        </Button>
      </div>
    </form>
  );
}
