'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9999,
  size = 'md',
  label = 'Quantity',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const btn =
    'grid place-items-center text-bone/70 transition-colors hover:text-gold disabled:opacity-30 disabled:hover:text-bone/70';
  const dims = size === 'sm' ? 'h-8 w-8' : 'h-11 w-11';
  return (
    <div className={cn('inline-flex items-center border border-line', size === 'sm' && 'text-sm')}>
      <button type="button" className={cn(btn, dims)} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`Decrease ${label.toLowerCase()}`}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (!Number.isNaN(next)) onChange(Math.min(max, Math.max(min, next)));
        }}
        className={cn(
          'w-12 border-x border-line bg-transparent text-center font-mono tabular-nums text-bone outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          size === 'sm' ? 'h-8 text-xs' : 'h-11 text-sm',
        )}
      />
      <button type="button" className={cn(btn, dims)} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`Increase ${label.toLowerCase()}`}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
