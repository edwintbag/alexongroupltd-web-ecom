'use client';

import { useState } from 'react';
import { Field, inputStyles, textareaStyles, selectStyles } from './field';
import { FormStatus } from './form-status';
import { Button } from '@/components/ui/button';
import { submitEnquiry } from '@/lib/submit';
import { enquiryCategories } from '@/data/enquiry-categories';



export function ContactForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', category: enquiryCategories[0], message: '' });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!/^[0-9+\s-]{9,}$/.test(form.phone)) next.phone = 'Enter a phone number we can reach you on';
    if (form.message.trim().length < 10) next.message = 'Tell us a little more so we can answer properly';
    setErrors(next);
    if (Object.keys(next).length) return;

    setState('submitting');
    try {
      await submitEnquiry(form);
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <FormStatus
        state="success"
        successTitle="Message sent"
        successBody="Thanks — your message is with the Alexon team and we will come back to you shortly. For anything urgent, call 0701 381 197."
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-line p-6 md:p-8">
      <h2 className="eyebrow mb-6">Send us a message</h2>
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
        <Field label="What is this about?">
          <select className={selectStyles} value={form.category} onChange={(e) => set('category', e.target.value)}>
            {enquiryCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Message" required error={errors.message} className="sm:col-span-2">
          <textarea className={textareaStyles} value={form.message} onChange={(e) => set('message', e.target.value)} />
        </Field>
      </div>

      <div className="mt-6">
        <FormStatus state={state} successTitle="" successBody="" />
      </div>

      <Button type="submit" size="lg" className="mt-6" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
