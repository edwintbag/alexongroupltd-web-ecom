import { company } from '@/data/company';

const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
// Same guard as siteUrl — a blank Vercel variable is "" and must not win.
const NUMBER = raw && raw.trim() ? raw.trim() : company.whatsapp;

interface EnquiryInput {
  name: string;
  variant?: string;
  quantity?: number;
  path?: string;
}

/** Builds a wa.me link pre-filled with what the customer is looking at. */
export function whatsappEnquiry({ name, variant, quantity, path }: EnquiryInput): string {
  const url = path ? `${company.siteUrl}${path}` : undefined;
  const lines = [
    `Hello Alexon, I would like to enquire about ${name}.`,
    variant ? `Option: ${variant}` : null,
    quantity ? `Quantity: ${quantity}` : null,
    url ? `Link: ${url}` : null,
  ].filter(Boolean);
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export const whatsappGeneral = `https://wa.me/${NUMBER}`;
