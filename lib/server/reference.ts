import 'server-only';

/**
 * Human-quotable reference numbers, so a phone call can start with
 * "I'm calling about ALX-Q-4821" instead of "I sent something on Tuesday".
 *
 * Prefixes: Q = quote, H = equipment hire, O = order.
 */
export function makeReference(kind: 'Q' | 'H' | 'O'): string {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `ALX-${kind}-${stamp}-${suffix}`;
}
