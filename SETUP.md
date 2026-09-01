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

---

## 5. Email notifications

Without this, forms save to Supabase but nobody is told. Someone has to remember
to open the dashboard — which is how a quote request sits unread for three days.

### Setup

1. Sign up at **resend.com** (free tier: 3,000 emails/month).
2. **API Keys → Create** → copy the key.
3. Add to `.env.local` and to Vercel's environment variables:

```
RESEND_API_KEY=re_...
```

4. Redeploy.

That's enough to start — Resend's `onboarding@resend.dev` sender works with no
domain setup. Emails will arrive from that address until you verify your own.

### Sending from your own domain

Once `alexongroupltd.com` is pointing somewhere you control:

1. Resend → **Domains → Add Domain** → `alexongroupltd.com`
2. Add the DNS records Resend gives you (SPF and DKIM)
3. Set `MAIL_FROM=Alexon Group Ltd <noreply@alexongroupltd.com>` and redeploy

Worth doing before any volume: mail from a verified domain is far less likely to
land in spam than mail from a shared test sender.

### What gets sent

Every submission sends **two** emails:

| Trigger | To Alexon | To the customer |
|---|---|---|
| Quote request | Full details + item list, Reply-To set to the customer | Acknowledgement with their reference and items |
| Order | Details, lines, total, delivery address | Confirmation with reference |
| M-Pesa paid | Receipt number and amount | Payment confirmed |
| Equipment booking | Machine, dates, site | Acknowledgement |
| Job application | Details + a 14-day signed CV link | Acknowledgement |
| Contact enquiry | Category and message | Acknowledgement |

The internal email sets **Reply-To** to the customer's address, so hitting reply
in Gmail reaches them directly.

### Reference numbers

Quotes and bookings now generate `ALX-Q-260831-4821` style references, so a phone
call can start with a reference rather than "I sent something on Tuesday". Run
`supabase/migration-references.sql` in the SQL editor to add the columns.

### Who receives what

All notifications currently go to the company address. To split by department,
edit `lib/server/notify-config.ts`:

```ts
export const recipients = {
  quotes: 'sales@alexongroupltd.com',
  applications: 'hr@alexongroupltd.com',
  // ...
};
```

Each entry accepts a single address or an array.

### If email fails

Nothing breaks. The database write happens first and the send is best-effort —
a Resend outage cannot lose a quote request. Failures are logged to the Vercel
logs with an `[alexon] email failed` prefix.

---

## 6. Admin page

A signed-in queue at `/admin` where the Alexon team can see and work everything
the website receives — quotes, orders, equipment requests, job applications and
contact messages.

### Setup

Add one variable to `.env.local` and to Vercel (type **Secret**), then redeploy:

```
ADMIN_PASSWORD=choose-something-long
```

Minimum 8 characters. Without it, `/admin` shows a "not set up" notice rather
than exposing anything.

Open `https://your-site/admin` and sign in.

### What it does

- **Five tabs**, each showing the most recent 100 records, newest first
- **Red badge** on each tab counting items still marked `new`, so it's obvious
  what hasn't been touched
- **Expand any row** for the full detail — site location, items, quantities,
  delivery address, notes
- **Status dropdown**: new → in-progress → quoted → won → closed. Changes save
  immediately
- **Call and email buttons** on every row, so a quote can be answered without
  copying numbers out
- **Open CV** on applications — mints a one-hour signed link; the storage bucket
  stays private

### On the security model

One shared password for the whole team, held in an environment variable. Not
per-person accounts, deliberately: proper accounts mean a login flow, password
resets and user management for a handful of people who all see the same queue.

What is in place:

- The session cookie holds an **HMAC of the password**, never the password, so a
  stolen cookie can't be turned back into the credential
- **httpOnly, secure, sameSite** — not readable by JavaScript
- **12-hour expiry** — roughly a working day
- **Constant-time comparison**, so the password can't be guessed by timing
- **Rate limited** to 8 attempts per IP per 15 minutes
- `/admin` is **excluded from robots.txt** and carries `noindex`

If Alexon later wants per-person access and an audit trail of who changed what,
Supabase Auth slots in behind the same pages.

**Choose a real password.** This one URL opens every customer record, order and
CV the business holds. Treat it like the office keys, and change it when someone
leaves.
