import 'server-only';
import { supabaseAdmin } from './supabase';

export type AdminTable = 'quotes' | 'orders' | 'bookings' | 'applications' | 'enquiries';

export interface Row {
  id: string;
  created_at: string;
  status: string;
  [key: string]: unknown;
}

export async function fetchRows(table: AdminTable, limit = 100): Promise<Row[]> {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error(`[alexon] admin fetch ${table} failed`, error);
    return [];
  }
  return (data ?? []) as Row[];
}

/** Counts of everything still marked 'new', for the nav badges. */
export async function fetchNewCounts(): Promise<Record<AdminTable, number>> {
  const tables: AdminTable[] = ['quotes', 'orders', 'bookings', 'applications', 'enquiries'];
  const empty = { quotes: 0, orders: 0, bookings: 0, applications: 0, enquiries: 0 };
  if (!supabaseAdmin) return empty;

  const results = await Promise.all(
    tables.map(async (t) => {
      const { count } = await supabaseAdmin!
        .from(t)
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new');
      return [t, count ?? 0] as const;
    }),
  );
  return Object.fromEntries(results) as Record<AdminTable, number>;
}
