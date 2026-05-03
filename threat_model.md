# Threat Model

## Project Overview

Atera Stays is a pnpm monorepo for ATERA INDUSTRIES LTD. The production application consists of a React/Vite frontend (`artifacts/atera-platform`) and an Express API server (`artifacts/api-server`). The hospitality Hub uses Supabase Auth and direct Supabase client access for properties, leads, bookings, enquiries, tasks, and KPIs. The Express API also exposes public hospitality endpoints for enquiries and live property listings, plus Drizzle-backed management routes for customers, devices, alerts, tickets, and dashboards.

The mockup sandbox is development-only and is not production scope. In production, `NODE_ENV` is assumed to be `production`, and platform TLS is assumed to protect network traffic.

## Assets

- **Hub accounts and sessions** -- Supabase Auth credentials and session tokens protect internal business operations.
- **Business and personal data** -- properties, landlord leads, guest bookings, enquiries, phone numbers, email addresses, addresses, operational tasks, and KPIs.
- **Management API data** -- customers, devices, alerts, tickets, dashboard summaries, and related operational metadata in the Drizzle/PostgreSQL path.
- **Application secrets** -- Supabase service role key, Supabase anon key, Resend key, database connection strings, Stripe keys, and session signing secret.
- **Email channel trust** -- public enquiry submissions generate customer-facing and internal emails through Resend.

## Trust Boundaries

- **Browser to React app** -- public visitors can access landing, privacy, terms, live property listings, and enquiry forms; Hub pages should only be usable by authenticated internal users.
- **Browser/public client to Express API** -- `/api/enquiry`, `/api/properties/live`, and all mounted Express routes receive untrusted network requests and must perform authentication, authorization, input validation, and rate limiting appropriate to their sensitivity.
- **React/public frontend to Supabase** -- the frontend uses the public Supabase anon key; Supabase RLS policies are the primary server-side authorization layer for Hub data and must ensure anonymous users can only access intentionally public views or tightly constrained public workflows.
- **Express API to Supabase** -- `/api/enquiry` uses the Supabase service role key and therefore bypasses RLS; the route must strictly constrain accepted writes.
- **Express API to Drizzle/PostgreSQL** -- management routes access database tables directly; SQL injection risk is reduced by Drizzle query builders, but route-level authentication and authorization must be enforced before any database operation.
- **Express API to Resend** -- public enquiry data crosses into email content; user-supplied fields must be treated as untrusted HTML/text.

## Scan Anchors

- Production entry points: `artifacts/atera-platform/src/App.tsx`, `artifacts/api-server/src/index.ts`, `artifacts/api-server/src/app.ts`, and `artifacts/api-server/src/routes/index.ts`.
- High-risk public API code: `artifacts/api-server/src/routes/enquiry.ts`, `artifacts/api-server/src/routes/publicProperties.ts`.
- High-risk authenticated/admin surfaces: Supabase Hub pages under `artifacts/atera-platform/src/pages/hub/`, auth context in `artifacts/atera-platform/src/lib/useAuth.tsx`, and RLS policy setup in `supabase-setup.sql`.
- Drizzle-backed management API surface: `artifacts/api-server/src/routes/customers.ts`, `devices.ts`, `alerts.ts`, `tickets.ts`, and `dashboard.ts`.
- Dev-only area: `artifacts/mockup-sandbox/` should be ignored unless production reachability is demonstrated.

## Threat Categories

### Spoofing

Hub users authenticate through Supabase Auth. Protected Hub data must only be accessible with a valid Supabase session, and backend API routes that expose non-public data must validate an appropriate bearer token or equivalent server-side credential. Public endpoints such as enquiries and live listings must not implicitly grant access to internal data.

### Tampering

The client is untrusted. All database writes must be authorized server-side or by Supabase RLS. Public enquiry writes use a service role key, so the Express handler must validate and allowlist request fields before inserting data or generating emails. Anonymous users must not be able to bypass those handler controls by writing directly to Supabase tables with the public anon key. Destructive operations such as deleting properties, bookings, CRM records, customers, devices, alerts, or tickets must require an appropriately privileged authenticated actor.

### Information Disclosure

PII and business data must not be exposed through unauthenticated API routes, overly broad Supabase policies, verbose errors, logs, or public property responses. Public live property listings should return only intentionally public fields. Email templates must not render untrusted HTML from public submissions.

### Denial of Service

Public routes need bounded request sizes and rate limiting where attackers can create records or trigger emails. The enquiry route has rate limiting, but other sensitive routes should not be publicly callable. External API calls to Resend should be protected from abuse.

### Elevation of Privilege

Authorization must be enforced on the server side, not only through client-side routing. Supabase RLS policies must express the intended distinction between anonymous visitors, authenticated internal users, and any administrative actions. The Express API must not expose privileged database CRUD operations without authentication and role checks.
