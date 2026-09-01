# Alexon Group Ltd — corporate website & materials commerce platform

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion · Zustand

## Run it

```bash
npm install
cp .env.example .env.local
npm run dev
```

## What's here

- **Three commerce modes.** Purchase (catalogue price → cart), Quote (bulk
  aggregates, haulage → a separate persisted quote basket), Booking (plant hire
  → hourly-rate enquiry). Nothing without a printed price invents one.
- **Real assets.** All 18 product photographs and the 6 site photographs were
  extracted from the supplied catalogue and banner PDFs. No stock imagery.
- **Catalogue fidelity.** Every price in `data/products.ts` and
  `data/equipment.ts` is transcribed verbatim from the catalogue. Anything the
  document left ambiguous carries a `todo` field and surfaces as an amber
  "to confirm" notice on the page rather than being guessed.

## Structure

```
app/          routes (shop, equipment, services, projects, gallery, careers, …)
components/   ui/ layout/ home/ shop/ product/ equipment/ gallery/ projects/ careers/ forms/
data/         the single source of truth, one file per entity
lib/          utils, seo, search, whatsapp, submit handlers
store/        cart, quote basket, wishlist (Zustand + persist)
types/        domain models, mirroring the future backend tables
```

## Design system

Colours were sampled from the supplied documents, not invented: petrol
`#002537`, Alexon gold `#DA9629`, logo burgundy `#991728`, bone `#F2EFE9`.
Type is Jost (matching the catalogue's Futura), Hanken Grotesk for body, and
IBM Plex Mono for every dimension, price and reference number.

The signature device is the **measurement rule** — Alexon prices by dimension,
so ticks, extension lines and mono callouts are the structural language: section
dividers are drawn as rulers, and variant chips render as engineering dimension
callouts.

See `TODO_ENDPOINTS.md` for what still needs wiring.

## Building behind a firewall

`app/layout.tsx` fetches Jost, Hanken Grotesk and IBM Plex Mono from Google
Fonts at build time. If your build environment can't reach
`fonts.googleapis.com`, either allow that domain or swap the three `next/font/google`
imports for `next/font/local` files — the CSS variables (`--font-display`,
`--font-body`, `--font-mono`) stay the same, so nothing else changes.

## Admin

`/admin` — signed-in queue for the Alexon team covering quotes, orders,
equipment bookings, job applications and enquiries. Set `ADMIN_PASSWORD` to
enable it. See SETUP.md.

## Verified

- `npm run typecheck` — clean
- `npm run build` — 46 routes, all prerendered
