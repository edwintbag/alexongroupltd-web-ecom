import 'server-only';
import type { AdminRecord } from '@/components/admin/record-list';
import type { Row } from './admin-data';
import { formatKES } from '@/lib/utils';

/** Drops empty values so the detail list never shows blank rows. */
function pairs(entries: [string, unknown][]): [string, string][] {
  return entries
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '')
    .map(([k, v]) => [k, String(v)] as [string, string]);
}

const base = (row: Row) => ({
  id: row.id,
  createdAt: row.created_at,
  status: String(row.status ?? 'new'),
  reference: (row.reference as string) ?? null,
});

export function shapeQuote(row: Row): AdminRecord {
  return {
    ...base(row),
    title: `${row.name}${row.company ? ` · ${row.company}` : ''}`,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    details: pairs([
      ['Site', row.site_location],
      ['Type', row.enquiry_type],
      ['Needed by', row.delivery_date],
      ['Phone', row.phone],
      ['Email', row.email],
      ['Project', row.project_description],
      ['Notes', row.notes],
    ]),
    items: Array.isArray(row.items) ? (row.items as AdminRecord['items']) : undefined,
  };
}

export function shapeOrder(row: Row): AdminRecord {
  const c = (row.customer ?? {}) as { fullName?: string; phone?: string; email?: string };
  const d = (row.delivery ?? {}) as {
    address?: string;
    town?: string;
    county?: string;
    method?: string;
    siteLocation?: string;
    notes?: string;
  };
  return {
    ...base(row),
    title: `${c.fullName ?? 'Order'} — ${formatKES(Number(row.subtotal))}`,
    phone: c.phone ?? null,
    email: c.email ?? null,
    details: pairs([
      ['Total', `${formatKES(Number(row.subtotal))} (delivery quoted separately)`],
      ['Payment', `${String(row.payment_method).toUpperCase()} — ${row.payment_status}`],
      ['M-Pesa receipt', row.mpesa_receipt],
      ['Deliver to', d.address ? `${d.address}, ${d.town}, ${d.county}` : null],
      ['Method', d.method ? String(d.method).replace(/-/g, ' ') : null],
      ['Site', d.siteLocation],
      ['Phone', c.phone],
      ['Email', c.email],
      ['Notes', d.notes],
      ['Problem', row.failure_reason],
    ]),
    items: Array.isArray(row.lines) ? (row.lines as AdminRecord['items']) : undefined,
  };
}

export function shapeBooking(row: Row): AdminRecord {
  return {
    ...base(row),
    title: `${row.equipment} — ${row.name}`,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    details: pairs([
      ['Machine', row.equipment],
      ['Start', row.start_date],
      ['Duration', row.duration],
      ['Site', row.site_location],
      ['Phone', row.phone],
      ['Email', row.email],
      ['The work', row.notes],
    ]),
  };
}

export function shapeApplication(row: Row): AdminRecord {
  return {
    ...base(row),
    title: `${row.full_name} — ${row.position}`,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    details: pairs([
      ['Position', row.position],
      ['Based in', row.location],
      ['Phone', row.phone],
      ['Email', row.email],
      ['About them', row.message],
    ]),
    cvPath: (row.cv_path as string) ?? null,
  };
}

export function shapeEnquiry(row: Row): AdminRecord {
  return {
    ...base(row),
    title: `${row.name} — ${row.category}`,
    phone: (row.phone as string) ?? null,
    email: (row.email as string) ?? null,
    details: pairs([
      ['Category', row.category],
      ['Phone', row.phone],
      ['Email', row.email],
      ['Message', row.message],
    ]),
  };
}
