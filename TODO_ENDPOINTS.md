# Endpoints to connect

The front end is complete and every form validates and gives real feedback,
but nothing is persisted yet. Each handler in `lib/submit.ts` logs its payload
and resolves. Replace the body of each with a real `fetch`, then delete the
matching note in the success state.

| Handler | Suggested route | Payload type | Used by |
|---|---|---|---|
| `submitQuoteRequest` | `POST /api/quotes` | `QuoteRequestPayload` | `/request-quote`, quote basket |
| `submitOrder` | `POST /api/orders` | `OrderPayload` | `/checkout` |
| `submitBooking` | `POST /api/bookings` | `BookingPayload` | `/equipment/[slug]` |
| `submitApplication` | `POST /api/applications` | `ApplicationPayload` (multipart for the CV) | `/careers`, `/careers/[slug]` |
| `submitEnquiry` | `POST /api/enquiries` | `EnquiryPayload` | `/contact` |

## Notes

- **Validate server-side too.** The client-side checks are for usability, not security.
- **CVs are sensitive.** Upload to private storage, never a public bucket, and scan on receipt.
- **Payments are not integrated.** `/checkout` collects a payment preference only.
  M-Pesa, card and bank credentials belong in server-side environment variables
  (see `.env.example`) and must never reach client code.
- **Data layer.** Every dataset lives in `data/*.ts` behind accessors
  (`getProduct`, `getProductsByCategory`, `getEquipment`, `getJob`…). Swapping
  static data for Supabase queries touches only those files — no component changes.

## Content still awaiting Alexon

| Where | What |
|---|---|
| `data/company.ts` | Opening hours, social media URLs, project/experience figures |
| `data/products.ts` | Cabro price unit (per m²?), aggregate prices |
| `data/equipment.ts` | Tipper price basis, clean-water bowser capacity and radius, grader rate wording, lowbed rate |
| `data/projects.ts` | Real project records — all three entries are marked `placeholder: true` |
| `data/careers.ts` | Vacancies, when there are any. Empty by design. |
| `app/privacy`, `app/terms` | Legal review |
