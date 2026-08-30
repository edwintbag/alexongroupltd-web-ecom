import { z } from 'zod';

/** Server-side validation. The client-side checks are for usability only. */

const phone = z.string().trim().min(9).max(20).regex(/^[0-9+\s-]+$/, 'Invalid phone number');
const email = z.string().trim().email().max(160);
const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().max(4000).optional().or(z.literal(''));

export const quoteSchema = z.object({
  name: shortText,
  company: z.string().trim().max(200).optional().or(z.literal('')),
  phone,
  email,
  siteLocation: shortText,
  type: z.string().trim().max(80).optional(),
  projectDescription: longText,
  deliveryDate: z.string().trim().max(30).optional().or(z.literal('')),
  notes: longText,
  items: z
    .array(
      z.object({
        name: shortText,
        variant: z.string().trim().max(200).optional(),
        quantity: z.number().int().positive().max(100000),
        kind: z.enum(['product', 'equipment']),
      }),
    )
    .min(1)
    .max(60),
});

export const orderSchema = z.object({
  customer: z.object({ fullName: shortText, phone, email }),
  delivery: z.object({
    county: shortText,
    town: shortText,
    address: shortText,
    siteLocation: z.string().trim().max(300).optional().or(z.literal('')),
    method: z.enum(['pickup', 'local-delivery', 'site-delivery']),
    notes: longText,
  }),
  payment: z.object({ method: z.enum(['mpesa', 'card', 'bank']) }),
  lines: z
    .array(
      z.object({
        name: shortText,
        variant: z.string().trim().max(200).optional(),
        quantity: z.number().int().positive().max(100000),
        unitPrice: z.number().nonnegative().max(10000000),
      }),
    )
    .min(1)
    .max(100),
  subtotal: z.number().nonnegative().max(100000000),
});

export const bookingSchema = z.object({
  equipment: shortText,
  name: shortText,
  phone,
  email,
  siteLocation: shortText,
  startDate: z.string().trim().min(1).max(30),
  duration: shortText,
  notes: longText,
});

export const enquirySchema = z.object({
  name: shortText,
  email,
  phone,
  category: shortText,
  message: z.string().trim().min(10).max(4000),
});

export const applicationSchema = z.object({
  fullName: shortText,
  email,
  phone,
  location: shortText,
  position: shortText,
  message: longText,
});
