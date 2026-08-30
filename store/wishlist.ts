'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistEntry } from '@/types';

interface WishlistState {
  entries: WishlistEntry[];
  toggle: (entry: Omit<WishlistEntry, 'addedAt'>) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      entries: [],
      toggle: (entry) =>
        set((state) => ({
          entries: state.entries.some((e) => e.productId === entry.productId)
            ? state.entries.filter((e) => e.productId !== entry.productId)
            : [...state.entries, { ...entry, addedAt: Date.now() }],
        })),
      remove: (productId) => set((state) => ({ entries: state.entries.filter((e) => e.productId !== productId) })),
      clear: () => set({ entries: [] }),
      has: (productId) => get().entries.some((e) => e.productId === productId),
    }),
    { name: 'alexon-wishlist' },
  ),
);
