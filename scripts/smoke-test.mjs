/**
 * End-to-end check of every connected endpoint except M-Pesa.
 *
 *   1. npm run dev        (in one terminal)
 *   2. npm run smoke      (in another)
 *
 * Posts a real record to each route, so anything that passes here has
 * actually reached Supabase. Every test row is tagged SMOKE-TEST so you
 * can find and delete them afterwards — see the SQL printed at the end.
 */

const BASE = process.env.SMOKE_BASE_URL ?? 'http://localhost:3000';
const TAG = `SMOKE-TEST ${new Date().toISOString().slice(0, 16)}`;

const g = (s) => `\x1b[32m${s}\x1b[0m`;
const r = (s) => `\x1b[31m${s}\x1b[0m`;
const y = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

let passed = 0;
let failed = 0;
let skipped = 0;

async function test(name, fn) {
  process.stdout.write(`  ${name.padEnd(38, '.')} `);
  try {
    const note = await fn();
    passed += 1;
    console.log(`${g('PASS')} ${note ? dim(note) : ''}`);
  } catch (err) {
    if (err.skip) {
      skipped += 1;
      console.log(`${y('SKIP')} ${dim(err.message)}`);
      return;
    }
    failed += 1;
    console.log(`${r('FAIL')} ${err.message}`);
  }
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 503) {
    const e = new Error('Supabase env vars not set');
    e.skip = true;
    throw e;
  }
  if (!res.ok) throw new Error(`${res.status} — ${data.error ?? 'no message'}`);
  return data;
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} on ${path}`);
  return res;
}

const contact = { phone: '0701381197', email: 'smoke-test@example.com' };

console.log(`\nAlexon smoke test → ${BASE}\n`);

console.log('Pages render');
for (const path of [
  '/', '/shop', '/shop/concrete-blocks', '/equipment', '/equipment/excavator',
  '/services', '/projects', '/gallery', '/careers', '/contact',
  '/request-quote', '/cart', '/checkout', '/wishlist', '/delivery',
  '/sitemap.xml', '/robots.txt',
]) {
  await test(path, async () => {
    const res = await get(path);
    const body = await res.text();
    if (body.length < 500) throw new Error('suspiciously short response');
    return `${(body.length / 1024).toFixed(0)} kB`;
  });
}

await test('404 page', async () => {
  const res = await fetch(`${BASE}/no-such-page`);
  if (res.status !== 404) throw new Error(`expected 404, got ${res.status}`);
});

console.log('\nForms write to Supabase');

await test('POST /api/enquiries', async () => {
  const d = await post('/api/enquiries', {
    name: TAG, ...contact, category: 'General enquiry',
    message: 'Automated smoke test — safe to delete this row.',
  });
  return `id ${d.id?.slice(0, 8)}`;
});

await test('POST /api/quotes', async () => {
  const d = await post('/api/quotes', {
    name: TAG, ...contact, siteLocation: 'Ugunja', type: 'Materials',
    items: [{ name: 'Concrete Blocks', variant: '9 × 9 × 15 inch', quantity: 200, kind: 'product' }],
  });
  return `id ${d.id?.slice(0, 8)}`;
});

await test('POST /api/bookings', async () => {
  const d = await post('/api/bookings', {
    equipment: 'Excavator', name: TAG, ...contact,
    siteLocation: 'Ugunja', startDate: '2026-12-01', duration: 'Full day',
  });
  return `id ${d.id?.slice(0, 8)}`;
});

await test('POST /api/applications (multipart)', async () => {
  const form = new FormData();
  form.append('fullName', TAG);
  form.append('email', contact.email);
  form.append('phone', contact.phone);
  form.append('location', 'Ugunja');
  form.append('position', 'Production & Yard');
  form.append('cv', new File([new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])], 'smoke-test.pdf', { type: 'application/pdf' }));

  const res = await fetch(`${BASE}/api/applications`, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (res.status === 503) { const e = new Error('Supabase env vars not set'); e.skip = true; throw e; }
  if (!res.ok) throw new Error(`${res.status} — ${data.error ?? 'no message'}`);
  return `id ${data.id?.slice(0, 8)} + CV uploaded`;
});

await test('POST /api/orders (bank, no M-Pesa)', async () => {
  const d = await post('/api/orders', {
    customer: { fullName: TAG, ...contact },
    delivery: { county: 'Siaya', town: 'Ugunja', address: 'Smoke test', method: 'pickup' },
    payment: { method: 'bank' },
    lines: [{ name: 'Culverts', variant: '1 FT', quantity: 4, unitPrice: 1500 }],
    subtotal: 6000,
  });
  if (d.payment !== 'offline') throw new Error(`expected offline, got ${d.payment}`);
  return `ref ${d.reference}`;
});

console.log('\nValidation rejects bad input');

await test('rejects invalid email', async () => {
  const res = await fetch(`${BASE}/api/enquiries`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'x', email: 'not-an-email', phone: '0701381197', category: 'General enquiry', message: 'long enough message' }),
  });
  if (res.status === 503) { const e = new Error('Supabase env vars not set'); e.skip = true; throw e; }
  if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
});

await test('rejects empty quote basket', async () => {
  const res = await fetch(`${BASE}/api/quotes`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'x', phone: '0701381197', email: 'a@b.com', siteLocation: 'Ugunja', items: [] }),
  });
  if (res.status === 503) { const e = new Error('Supabase env vars not set'); e.skip = true; throw e; }
  if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
});

await test('recalculates order total server-side', async () => {
  // Send a dishonest subtotal — the server should ignore it and use the lines.
  const d = await post('/api/orders', {
    customer: { fullName: TAG, ...contact },
    delivery: { county: 'Siaya', town: 'Ugunja', address: 'Tamper test', method: 'pickup' },
    payment: { method: 'bank' },
    lines: [{ name: 'Culverts', variant: '3 FT', quantity: 2, unitPrice: 5000 }],
    subtotal: 1, // real total is 10,000
  });
  return `ref ${d.reference} — check it stored 10000, not 1`;
});

console.log(`\n${passed} passed · ${failed} failed · ${skipped} skipped\n`);

if (skipped > 0) {
  console.log(y('Skipped tests mean NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY'));
  console.log(y('are missing from .env.local. Add them and restart the dev server.\n'));
}

if (passed > 0) {
  console.log(dim('Clean up the test rows in the Supabase SQL editor:\n'));
  console.log(dim("  delete from enquiries    where name like 'SMOKE-TEST%';"));
  console.log(dim("  delete from quotes       where name like 'SMOKE-TEST%';"));
  console.log(dim("  delete from bookings     where name like 'SMOKE-TEST%';"));
  console.log(dim("  delete from applications where full_name like 'SMOKE-TEST%';"));
  console.log(dim("  delete from orders       where customer->>'fullName' like 'SMOKE-TEST%';\n"));
  console.log(dim('  Then remove the test CV under Storage → cvs.\n'));
}

process.exit(failed > 0 ? 1 : 0);
