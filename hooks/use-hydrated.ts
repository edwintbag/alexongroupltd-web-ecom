'use client';

import { useEffect, useState } from 'react';

/** Guards persisted-store reads so server and client markup match. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
