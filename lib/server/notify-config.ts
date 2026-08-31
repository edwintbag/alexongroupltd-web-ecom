import 'server-only';
import { company } from '@/data/company';

/**
 * Who gets notified about what.
 *
 * Everything currently goes to the company address. To split by department,
 * change the value here — e.g. applications: 'ruth@alexongroupltd.com'.
 * Each entry accepts a single address or an array.
 */
const DEFAULT = company.email;

export const recipients = {
  quotes: DEFAULT,
  orders: DEFAULT,
  bookings: DEFAULT,
  applications: DEFAULT,
  enquiries: DEFAULT,
} as const;

export type NotificationKind = keyof typeof recipients;

/**
 * The From address. Resend's onboarding sender works with no setup, so
 * notifications start flowing before the domain is verified. Once
 * alexongroupltd.com is verified in Resend, set MAIL_FROM to
 * "Alexon Group Ltd <noreply@alexongroupltd.com>".
 */
export const mailFrom = process.env.MAIL_FROM?.trim() || 'Alexon Group Ltd <onboarding@resend.dev>';

export const mailConfigured = Boolean(process.env.RESEND_API_KEY?.trim());
