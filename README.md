# InvoiceFlow

A focused TypeScript full-stack app that simulates a construction Accounts Payable review workflow. Review incoming invoices, filter by status, inspect line items, flag possible duplicates, and approve or reject with persistence in Supabase PostgreSQL.

## Overview

InvoiceFlow demonstrates clean full-stack architecture:

- Next.js App Router frontend
- REST API via Next.js Route Handlers
- Zod request validation
- Supabase PostgreSQL persistence
- Operational AP review UI

## Features

- Invoice dashboard with summary cards
- Status filters: All, Processing, Needs Review, Approved, Rejected
- Duplicate indicators on list and detail views
- Invoice detail page with full line items
- Approve and reject workflow with confirmation
- Review notes on invoice detail
- Persistent status updates in Supabase
- Loading, empty, and error states

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Lucide React, Geist |
| Backend | Next.js Route Handlers, Zod |
| Database | Supabase PostgreSQL |
| Deployment | Vercel |

## Architecture

```text
Next.js Frontend
      |
      | fetch() / server data access
      v
Next.js REST API
      |
      | Supabase Server Client (service role)
      v
Supabase PostgreSQL
      |
      +---- invoices
      |
      +---- invoice_items
      |
      +---- invoice_notes
```

The browser talks to the Next.js API. Privileged database access uses the server-only `SUPABASE_SERVICE_ROLE_KEY`.

## Database Schema

### Status enum

```sql
create type invoice_status as enum (
  'processing',
  'needs_review',
  'approved',
  'rejected'
);
```

### Tables

- `invoices` — vendor, invoice number, dates, totals, status, duplicate flag
- `invoice_items` — description, quantity, unit price, amount, FK to `invoices`
- `invoice_notes` — review notes attached to an invoice

Full SQL lives in [`supabase/schema.sql`](supabase/schema.sql).

## Status Model

| Status | Meaning |
|---|---|
| `processing` | Invoice is still moving through initial workflow |
| `needs_review` | Requires human attention before a final decision |
| `approved` | Reviewed and accepted |
| `rejected` | Reviewed and rejected |

`is_duplicate` is stored separately from status. An invoice can be flagged as a possible duplicate while remaining in the review workflow.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. Open the SQL Editor
3. Paste and run the contents of `supabase/schema.sql`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find both values under **Project Settings → API**.

> Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. Do not prefix it with `NEXT_PUBLIC_`.

### 4. Seed sample invoices

```bash
npm run seed
```

This loads six construction invoices from `src/data/invoices.json`:

| Invoice | Status | Duplicate |
|---|---|---|
| INV-1040 | Processing | No |
| INV-1041 | Processing | No |
| INV-1043 | Needs Review | No |
| INV-1042 | Needs Review | Yes |
| INV-1038 | Approved | No |
| INV-1035 | Rejected | No |

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/invoices`.

## Environment Variables

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Server + client safe | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Privileged DB access for API routes and seed script |

## API Endpoints

### `GET /api/invoices`

List invoices. Optional filter:

```http
GET /api/invoices?status=needs_review
```

Response includes `data`, dashboard `summary`, and tab `counts`.

### `GET /api/invoices/:id`

Return one invoice with associated line items and notes.

### `PATCH /api/invoices/:id/status`

Update review outcome. Body must be:

```json
{ "status": "approved" }
```

or

```json
{ "status": "rejected" }
```

### `POST /api/invoices/:id/notes`

Add a review note:

```json
{ "body": "Looks good after vendor confirmation." }
```

## Design Decisions

- **Server-only Supabase client** keeps the service role key off the client
- **Zod validation** rejects invalid status payloads before any DB write
- **Duplicate flag independent of status** matches real AP review workflows
- **JSON fixtures + seed script** make demos reproducible
- **Scoped feature set** omits auth, OCR, uploads, and analytics by design

## Deployment

### Vercel

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in project settings
4. Deploy
5. Confirm approve/reject persists after refresh on the production URL

```bash
npm run build
```

## Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── invoices/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── api/invoices/...
├── components/invoices/
├── components/layout/
├── components/ui/
├── lib/
├── types/
└── data/invoices.json
supabase/schema.sql
scripts/seed.ts
```

## License

Private project.
