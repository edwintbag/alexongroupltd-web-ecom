# Connecting the backend

Three jobs, in order. The site runs without any of them — routes return a
clear "not connected" message rather than breaking.

---

## 1. Push to GitHub

The `src refspec main does not match any` error means there is no commit on a
branch called `main` yet. From the project folder:

```bash
git status                 # confirms you are in a repo and shows what is staged
git add .
git commit -m "Alexon Group Ltd website"
git branch -M main         # renames the current branch to main
git remote -v              # confirm the origin URL is right
git push -u origin main
```

If `git status` says *not a git repository*, run `git init` first.

A `.gitignore` is now included — it keeps `node_modules`, `.next` and
`.env.local` out of the repo. Without it `git add .` tries to stage several
hundred megabytes and appears to hang.

**Never commit `.env.local`.** If a service role key or M-Pesa secret has
already been pushed, rotate it in Supabase and Safaricom rather than just
deleting the file — git keeps history.

---

## 2. Supabase

1. Open your project (`evpmqawiegaifeobirin`) → **SQL Editor** → paste and run
   `supabase/schema.sql`. It creates five tables, turns on row level security
   with no policies, and creates a **private** `cvs` storage bucket.
2. **Settings → API** → copy the project URL, the `anon` key and the
   `service_role` key into `.env.local`.
3. Restart `npm run dev`.

RLS with no policies means the anon key can do nothing at all. Every write
happens in an API route using the service role key, which never reaches the
browser — `lib/server/supabase.ts` imports `server-only`, so importing it from
a client component fails the build instead of leaking the key.

Forms live immediately: quotes, bookings, enquiries, job applications and
orders.

---

## 3. M-Pesa

### What you need from Safaricom first

1. An account at **developer.safaricom.co.ke**. Create an app → gives you a
   **consumer key** and **consumer secret**.
2. A **paybill or till number** registered to Alexon Group Ltd, and the
   **passkey** Safaricom issues for it.
3. A **public HTTPS callback URL**. Safaricom posts the payment result to your
   server and cannot reach `localhost`.

Sandbox credentials work straight away. Production requires Safaricom's
go-live approval on the app.

### Testing locally

```bash
npx ngrok http 3000
```

Put the HTTPS URL ngrok prints into `MPESA_CALLBACK_URL` (no trailing slash,
no `/api/mpesa/callback` — the code appends that). Restart the dev server.

Sandbox test numbers are in the Daraja docs; the sandbox PIN is `1234`.

### How the flow works

1. Checkout posts to `/api/orders`. The server **recalculates the total from
   the line items** — the browser's figure is never trusted — writes the order
   as `pending`, and asks Daraja to send the PIN prompt.
2. The checkout page shows "Check your phone" and polls
   `/api/mpesa/status` every 3 seconds for up to 90 seconds.
3. Safaricom POSTs the outcome to `/api/mpesa/callback`. `ResultCode: 0` means
   paid; we store the receipt number and mark the order `paid`.
4. The poll sees the change and the page updates itself.

**The callback is the only proof of payment.** A successful STK response only
means the prompt reached the handset. Nothing is ever marked paid from the
browser.

### Three things that trip people up

- **Amounts must be whole shillings.** Daraja rejects decimals; the code rounds.
- **Phone format is `2547XXXXXXXX`** — not `07…`, not `+254…`. `normalisePhone`
  in `lib/server/mpesa.ts` converts all three and rejects anything else before
  calling Safaricom.
- **Always return 200 from the callback**, even on a malformed body. A non-200
  makes Daraja retry, and retries on an already-successful payment cause worse
  problems than a dropped log line.

### Going live

Set `MPESA_ENV=production`, swap in the production credentials, and point
`MPESA_CALLBACK_URL` at your Vercel domain.

---

## 4. Vercel

1. Import the GitHub repo.
2. Add every variable from `.env.example` under **Settings → Environment
   Variables**. `SUPABASE_SERVICE_ROLE_KEY`, `MPESA_*` — do **not** prefix any
   of these with `NEXT_PUBLIC_`; that would publish them to the browser.
3. Deploy, then update `MPESA_CALLBACK_URL` and `NEXT_PUBLIC_SITE_URL` to the
   real domain and redeploy.

Card payments are still unimplemented — `/checkout` records the preference and
Alexon confirms directly. Add a provider (Flutterwave, Paystack, Stripe) as a
sibling of `lib/server/mpesa.ts` when you are ready.
