import 'server-only';
import { Resend } from 'resend';
import { mailFrom, mailConfigured, recipients, type NotificationKind } from './notify-config';
import { company } from '@/data/company';

const resend = mailConfigured ? new Resend(process.env.RESEND_API_KEY!.trim()) : null;

interface SendArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends one email. Never throws — a mail failure must not fail the request
 * that triggered it, because the record is already safely in the database.
 * Failures are logged so they show up in the Vercel logs.
 */
async function send({ to, subject, html, replyTo }: SendArgs): Promise<boolean> {
  if (!resend) {
    console.warn('[alexon] RESEND_API_KEY not set — skipping email:', subject);
    return false;
  }
  try {
    const { error } = await resend.emails.send({
      from: mailFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    if (error) {
      console.error('[alexon] email failed', subject, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[alexon] email threw', subject, err);
    return false;
  }
}

/* ---------------- shared layout ---------------- */

const BRAND = '#DA9629';
const INK = '#002537';

function shell(title: string, intro: string, body: string, footerNote?: string) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f2ee;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ee;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e3ded4;">
        <tr><td style="background:${INK};padding:20px 24px;">
          <p style="margin:0;color:${BRAND};font-size:11px;letter-spacing:3px;text-transform:uppercase;">Alexon Group Ltd</p>
          <p style="margin:6px 0 0;color:#f2efe9;font-size:20px;font-weight:700;">${title}</p>
        </td></tr>
        <tr><td style="padding:24px;">
          <p style="margin:0 0 20px;color:#3b4a52;font-size:15px;line-height:1.6;">${intro}</p>
          ${body}
        </td></tr>
        <tr><td style="background:#faf8f5;border-top:1px solid #e3ded4;padding:16px 24px;">
          <p style="margin:0;color:#7a8890;font-size:12px;line-height:1.6;">
            ${footerNote ?? `${company.address.full} · ${company.phones.join(' · ')}`}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function rows(pairs: [string, string | undefined | null][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e3ded4;">
    ${pairs
      .filter(([, v]) => v)
      .map(
        ([k, v]) => `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece5;color:#7a8890;font-size:13px;width:38%;vertical-align:top;">${k}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0ece5;color:${INK};font-size:14px;">${escape(String(v))}</td>
        </tr>`,
      )
      .join('')}
  </table>`;
}

function itemList(items: { name: string; variant?: string; quantity: number; unitPrice?: number }[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:2px solid ${INK};">
    ${items
      .map(
        (i) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0ece5;color:${INK};font-size:14px;">
          <strong>${escape(i.name)}</strong>${i.variant ? `<br><span style="color:#7a8890;font-size:12px;">${escape(i.variant)}</span>` : ''}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ece5;color:${INK};font-size:14px;text-align:right;white-space:nowrap;">
          ×${i.quantity}${typeof i.unitPrice === 'number' ? `<br><span style="color:#7a8890;font-size:12px;">KES ${(i.unitPrice * i.quantity).toLocaleString('en-KE')}</span>` : ''}
        </td>
      </tr>`,
      )
      .join('')}
  </table>`;
}

/** Values come from user input, so escape before putting them in HTML. */
function escape(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ackFooter = `You are receiving this because you contacted ${company.legalName}. ${company.address.full} · ${company.phones.join(' · ')}`;

/* ---------------- notifications ---------------- */

interface Party {
  name: string;
  email: string;
  phone: string;
}

/**
 * Sends the internal notification and the customer acknowledgement together.
 * Both are best-effort; neither can fail the caller.
 */
export async function notify(
  kind: NotificationKind,
  {
    reference,
    party,
    subjectLine,
    detailRows,
    items,
    ackIntro,
  }: {
    reference?: string;
    party: Party;
    subjectLine: string;
    detailRows: [string, string | undefined | null][];
    items?: { name: string; variant?: string; quantity: number; unitPrice?: number }[];
    ackIntro: string;
  },
) {
  const ref = reference ? ` [${reference}]` : '';
  const itemsHtml = items?.length ? itemList(items) : '';

  const internal = send({
    to: recipients[kind],
    replyTo: party.email,
    subject: `${subjectLine}${ref} — ${party.name}`,
    html: shell(
      subjectLine,
      `New submission from <strong>${escape(party.name)}</strong>. Reply to this email to reach them directly.`,
      rows([...detailRows, ['Phone', party.phone], ['Email', party.email], ['Reference', reference]]) + itemsHtml,
      'Sent automatically by the Alexon Group Ltd website.',
    ),
  });

  const acknowledgement = send({
    to: party.email,
    subject: `${subjectLine}${ref} — ${company.legalName}`,
    html: shell(
      subjectLine,
      ackIntro,
      rows([...detailRows, ['Reference', reference]]) + itemsHtml,
      ackFooter,
    ),
  });

  // Run both, ignore individual outcomes — the record is already saved.
  await Promise.allSettled([internal, acknowledgement]);
}

export { send };
