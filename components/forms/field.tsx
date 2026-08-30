'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const base =
  'h-12 w-full border border-line bg-transparent px-3 text-sm text-bone outline-none transition-colors placeholder:text-mute/60 focus:border-gold disabled:opacity-50';

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-mute">
          {label}
          {required ? <span className="ml-1 text-gold">*</span> : null}
        </span>
        {hint ? <span className="text-[0.625rem] text-mute/60">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-[0.6875rem] text-error">{error}</span> : null}
    </label>
  );
}

export const inputStyles = base;
export const textareaStyles = cn(base, 'h-auto min-h-[7rem] resize-y py-3');
export const selectStyles = cn(base, 'appearance-none bg-ink pr-8');
