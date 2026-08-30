'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { useQuote } from '@/store/quote';
import { useHydrated } from '@/hooks/use-hydrated';
import { Field, inputStyles, textareaStyles, selectStyles } from './field';
import { FormStatus } from './form-status';
import { Button, ButtonLink } from '@/components/ui/button';
import { QuantitySelector } from '@/components/ui/quantity-selector';
import { submitQuoteRequest } from '@/lib/submit';
import { quoteSuggestions } from './quote-suggestions';

const enquiryTypes = ['Materials', 'Construction', 'Equipment hire', 'Water delivery', 'Logistics', 'Mixed project'];

export function QuoteForm({ presetType }: { presetType?: string }) {
  const { lines, remove, setQuantity, add, clear } = useQuote();
  const hydrated = useHydrated();
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    siteLocation: '',
    type: presetType ?? 'Materials',
    projectDescription: '',
    deliveryDate: '',
    notes: '',
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Enter your name or company name';
    if (!/^[0-9+\s-]{9,}$/.test(form.phone)) next.phone = 'Enter a phone number we can reach you on';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!form.siteLocation.trim()) next.siteLocation = 'Where is the site? Pricing depends on distance';
    if (!lines.length) next.items = 'Add at least one item to quote';
    setErrors(next);
    if (Object.keys(next).length) return;

    setState('submitting');
    try {
      await submitQuoteRequest({
        ...form,
        type: form.type,
        items: lines.map((l) => ({ name: l.name, variant: l.variantLabel, quantity: l.quantity, kind: l.kind })),
      });
      clear();
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="mx-auto max-w-xl">
        <FormStatus
          state="success"
          successTitle="Quote request sent"
          successBody="Your request is with the Alexon team. We price against your site and quantities, and come back with a written quotation — usually the same day."
        />
        <ButtonLink href="/shop" variant="outline" className="mt-6">
          Back to the shop
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-start">
      <form onSubmit={submit} noValidate>
        <h2 className="eyebrow mb-6">Your details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name or company" required error={errors.name}>
            <input className={inputStyles} value={form.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Company" hint="Optional">
            <input className={inputStyles} value={form.company} onChange={(e) => set('company', e.target.value)} autoComplete="organization" />
          </Field>
          <Field label="Phone" required error={errors.phone}>
            <input className={inputStyles} value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" placeholder="07xx xxx xxx" />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input className={inputStyles} value={form.email} onChange={(e) => set('email', e.target.value)} inputMode="email" autoComplete="email" />
          </Field>
          <Field label="Site location" required error={errors.siteLocation} hint="Town or landmark" className="sm:col-span-2">
            <input className={inputStyles} value={form.siteLocation} onChange={(e) => set('siteLocation', e.target.value)} placeholder="e.g. Ukwala, Siaya County" />
          </Field>
          <Field label="What is this for?">
            <select className={selectStyles} value={form.type} onChange={(e) => set('type', e.target.value)}>
              {enquiryTypes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Needed by" hint="Optional">
            <input type="date" className={inputStyles} value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} />
          </Field>
          <Field label="Describe the project" hint="Optional" className="sm:col-span-2">
            <textarea className={textareaStyles} value={form.projectDescription} onChange={(e) => set('projectDescription', e.target.value)} placeholder="Size of the build, stage you are at, access to the site…" />
          </Field>
          <Field label="Anything else" hint="Optional" className="sm:col-span-2">
            <textarea className={textareaStyles} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </Field>
        </div>

        {errors.items ? <p className="mt-6 border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">{errors.items}</p> : null}

        <div className="mt-8">
          <FormStatus state={state} successTitle="" successBody="" />
        </div>

        <Button type="submit" size="lg" className="mt-8" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Sending…' : 'Send quote request'}
        </Button>
      </form>

      <aside className="border border-line lg:sticky lg:top-28">
        <h2 className="border-b border-line px-5 py-4 font-display text-sm font-bold uppercase tracking-[0.14em] text-bone">
          Quote basket {hydrated ? `(${lines.length})` : ''}
        </h2>

        {!hydrated ? (
          <div className="p-5">
            <div className="skeleton h-20" />
          </div>
        ) : lines.length === 0 ? (
          <div className="p-5">
            <p className="text-sm leading-relaxed text-mute">
              Nothing added yet. Pick from the items we price per job, or add anything from the catalogue as you browse.
            </p>
            <ul className="mt-5 space-y-2">
              {quoteSuggestions.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() =>
                      add({ kind: s.kind, refId: s.id, slug: s.slug, name: s.name, quantity: 1, image: s.image })
                    }
                    className="flex w-full items-center gap-3 border border-line px-3 py-2 text-left transition-colors hover:border-gold"
                  >
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-line">
                      <Image src={s.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                    <span className="flex-1 truncate text-xs text-bone">{s.name}</span>
                    <Plus className="h-3.5 w-3.5 shrink-0 text-gold" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ul>
            {lines.map((line) => (
              <li key={line.key} className="flex gap-3 border-b border-line px-5 py-4">
                <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-line">
                  <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-xs font-bold uppercase tracking-wide text-bone">{line.name}</span>
                  {line.variantLabel ? <span className="block font-mono text-[0.625rem] text-gold-300">{line.variantLabel}</span> : null}
                  <span className="mt-2 flex items-center gap-2">
                    <QuantitySelector size="sm" value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
                    <button type="button" onClick={() => remove(line.key)} className="grid h-8 w-8 place-items-center text-mute hover:text-error" aria-label={`Remove ${line.name}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
