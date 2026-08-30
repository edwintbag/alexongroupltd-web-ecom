/**
 * Client-side submit handlers. Each posts to an API route in app/api/,
 * which validates again server-side and writes to Supabase.
 */

export interface QuoteRequestPayload {
  name: string;
  company?: string;
  phone: string;
  email: string;
  siteLocation: string;
  type?: string;
  projectDescription?: string;
  deliveryDate?: string;
  notes?: string;
  items: { name: string; variant?: string; quantity: number; kind: string }[];
}

export interface OrderPayload {
  customer: { fullName: string; phone: string; email: string };
  delivery: { county: string; town: string; address: string; siteLocation?: string; method: string; notes?: string };
  payment: { method: 'mpesa' | 'card' | 'bank' };
  lines: { name: string; variant?: string; quantity: number; unitPrice: number }[];
  subtotal: number;
}

export interface BookingPayload {
  equipment: string;
  name: string;
  phone: string;
  email: string;
  siteLocation: string;
  startDate: string;
  duration: string;
  notes?: string;
}

export interface ApplicationPayload {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  position: string;
  message?: string;
  cv: File;
}

export interface EnquiryPayload {
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
}

export interface OrderResult {
  id: string;
  reference: string;
  payment: 'offline' | 'stk-sent';
  checkoutRequestId?: string;
  message?: string;
}

async function postJson<T>(endpoint: string, payload: T) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? 'Request failed');
  return data;
}

export const submitQuoteRequest = (p: QuoteRequestPayload) => postJson('/api/quotes', p);
export const submitBooking = (p: BookingPayload) => postJson('/api/bookings', p);
export const submitEnquiry = (p: EnquiryPayload) => postJson('/api/enquiries', p);
export const submitOrder = (p: OrderPayload) => postJson('/api/orders', p) as Promise<OrderResult>;

/** Applications go as multipart so the CV travels with the form. */
export async function submitApplication(p: ApplicationPayload) {
  const form = new FormData();
  form.append('fullName', p.fullName);
  form.append('email', p.email);
  form.append('phone', p.phone);
  form.append('location', p.location);
  form.append('position', p.position);
  if (p.message) form.append('message', p.message);
  form.append('cv', p.cv);

  const res = await fetch('/api/applications', { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? 'Request failed');
  return data;
}

/** Polls until M-Pesa confirms, the customer cancels, or we give up. */
export async function pollPaymentStatus(
  orderId: string,
  { attempts = 30, interval = 3000 }: { attempts?: number; interval?: number } = {},
): Promise<{ status: string; receipt?: string; reference?: string; reason?: string }> {
  for (let i = 0; i < attempts; i += 1) {
    await new Promise((r) => setTimeout(r, interval));
    try {
      const res = await fetch(`/api/mpesa/status?id=${orderId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'paid' || data.status === 'failed') return data;
      }
    } catch {
      // Network blip mid-poll is not fatal — keep trying.
    }
  }
  return { status: 'timeout' };
}
