'use client';

import { useState } from 'react';
import { Upload, FileCheck2 } from 'lucide-react';
import { Field, inputStyles, textareaStyles, selectStyles } from '@/components/forms/field';
import { FormStatus } from '@/components/forms/form-status';
import { Button } from '@/components/ui/button';
import { submitApplication } from '@/lib/submit';
import { departments } from '@/data/careers';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export function ApplicationForm({ position, talentNetwork = false }: { position?: string; talentNetwork?: boolean }) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cv, setCv] = useState<File | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    position: position ?? departments[0],
    message: '',
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (file: File | null) => {
    if (!file) {
      setCv(null);
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      setErrors((e) => ({ ...e, cv: 'Upload a PDF or Word document' }));
      return;
    }
    if (file.size > MAX_BYTES) {
      setErrors((e) => ({ ...e, cv: 'Keep the file under 5 MB' }));
      return;
    }
    setErrors((e) => ({ ...e, cv: '' }));
    setCv(file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address';
    if (!/^[0-9+\s-]{9,}$/.test(form.phone)) next.phone = 'Enter a phone number we can reach you on';
    if (!form.location.trim()) next.location = 'Where are you based?';
    if (!cv) next.cv = 'Attach your CV';
    setErrors(next);
    if (Object.keys(next).length) return;

    setState('submitting');
    try {
      await submitApplication({ ...form, cv: cv! });
      setState('success');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <FormStatus
        state="success"
        successTitle={talentNetwork ? 'You are on the list' : 'Application received'}
        successBody={
          talentNetwork
            ? 'Your details and CV are with us. When a role opens in your area, we look here first.'
            : 'Your application and CV are with the Alexon team. We will be in touch if your experience fits the role.'
        }
      />
    );
  }

  return (
    <form onSubmit={submit} noValidate className="border border-line p-6 md:p-8">
      <h2 className="eyebrow mb-6">{talentNetwork ? 'Join our talent network' : `Apply — ${position}`}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName}>
          <input className={inputStyles} value={form.fullName} onChange={(e) => set('fullName', e.target.value)} autoComplete="name" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input className={inputStyles} value={form.email} onChange={(e) => set('email', e.target.value)} inputMode="email" autoComplete="email" />
        </Field>
        <Field label="Phone" required error={errors.phone}>
          <input className={inputStyles} value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Where are you based?" required error={errors.location}>
          <input className={inputStyles} value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="Town, county" />
        </Field>

        {talentNetwork ? (
          <Field label="Which area?" className="sm:col-span-2">
            <select className={selectStyles} value={form.position} onChange={(e) => set('position', e.target.value)}>
              {departments.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </Field>
        ) : null}

        <Field label="Tell us about your experience" hint="Optional" className="sm:col-span-2">
          <textarea className={textareaStyles} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Machines you have operated, sites you have worked, certifications held…" />
        </Field>

        <Field label="CV" required error={errors.cv} hint="PDF or Word, max 5 MB" className="sm:col-span-2">
          <label
            className={`flex cursor-pointer items-center gap-4 border border-dashed px-4 py-6 transition-colors ${cv ? 'border-success/50' : 'border-line hover:border-gold/50'}`}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            {cv ? <FileCheck2 className="h-5 w-5 shrink-0 text-success" aria-hidden /> : <Upload className="h-5 w-5 shrink-0 text-gold" aria-hidden />}
            <span className="min-w-0">
              <span className="block truncate text-sm text-bone">{cv ? cv.name : 'Choose a file'}</span>
              <span className="block text-[0.6875rem] text-mute">
                {cv ? `${(cv.size / 1024 / 1024).toFixed(1)} MB — click to replace` : 'PDF or Word, up to 5 MB'}
              </span>
            </span>
          </label>
        </Field>
      </div>

      <div className="mt-6">
        <FormStatus state={state} successTitle="" successBody="" />
      </div>

      <Button type="submit" size="lg" className="mt-6" disabled={state === 'submitting'}>
        {state === 'submitting' ? 'Sending…' : talentNetwork ? 'Join the network' : 'Submit application'}
      </Button>
    </form>
  );
}
