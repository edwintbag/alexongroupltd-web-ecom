'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuoteLine } from '@/types';

/**
 * The quote basket is deliberately separate from the cart. Bulk materials,
 * plant hire and haulage are priced against a site and a distance, so they
 * collect here and leave as a quotation request rather than an order.
 */
interface QuoteState {
  lines: QuoteLine[];
  isOpen: boolean;
  add: (line: Omit<QuoteLine, 'key'>) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  setNote: (key: string, note: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

export const useQuote = create<QuoteState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (line) =>
        set((state) => {
          const key = `${line.kind}::${line.refId}::${line.variantLabel ?? 'base'}`;
          if (state.lines.some((l) => l.key === key)) {
            return {
              lines: state.lines.map((l) => (l.key === key ? { ...l, quantity: l.quantity + line.quantity } : l)),
              isOpen: true,
            };
          }
          return { lines: [...state.lines, { ...line, key }], isOpen: true };
        }),
      remove: (key) => set((state) => ({ lines: state.lines.filter((l) => l.key !== key) })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.key !== key)
              : state.lines.map((l) => (l.key === key ? { ...l, quantity } : l)),
        })),
      setNote: (key, note) => set((state) => ({ lines: state.lines.map((l) => (l.key === key ? { ...l, note } : l)) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    { name: 'alexon-quote-basket', partialize: (s) => ({ lines: s.lines }) },
  ),
);
