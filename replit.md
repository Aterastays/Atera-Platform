# Atera Stays — Workspace

## Overview

Full-stack business platform for **ATERA INDUSTRIES LTD** (trading as Atera Stays). Two services: Stays Partnership (rent-to-serviced accommodation) and Atera Management. Built as a pnpm monorepo with two running artifacts.

## Architecture

| Artifact | Package | Path | Purpose |
|---|---|---|---|
| Frontend | `@workspace/atera-platform` | `/` | Public landing + Hub |
| Backend | `@workspace/api-server` | `/api` | Express API |
| Database | Supabase | — | PostgreSQL + Auth |

## Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express 5
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Emails**: Resend (via api-server)
- **PDF**: jsPDF (client-side, in atera-platform)
- **Auth**: Supabase Auth (email/password) with 30min auto-logout
- **TypeScript**: 5.9

## Key Files

- `supabase-setup.sql` — **MUST BE RUN IN SUPABASE SQL EDITOR** before using the hub
- `artifacts/atera-platform/src/App.tsx` — routing (public routes + hub routes)
- `artifacts/atera-platform/src/lib/supabase.ts` — Supabase client
- `artifacts/atera-platform/src/lib/useAuth.tsx` — Auth context (30min auto-logout)
- `artifacts/atera-platform/src/lib/pdfGenerator.ts` — jsPDF contract generation
- `artifacts/atera-platform/src/lib/templates.ts` — email/call scripts
- `artifacts/api-server/src/routes/enquiry.ts` — POST /api/enquiry (Resend + Supabase)
- `artifacts/api-server/src/routes/properties.ts` — GET /api/properties/live

## Design System

### Landing Page (Apple-style, graduated from mockup)
- **Background**: `#000000` / `#f5f5f7` (alternating dark/light sections)
- **Text**: white / `#a1a1a6` / `#6e6e73` / `#c7c7cc`
- **Fonts**: Inter (all weights)
- **Buttons**: pill `rounded-[980px]` — white solid + glass/blur ghost
- **Animations**: CSS `.hero-item`/`.hero-in` for hero, `.reveal`/`.revealed` IntersectionObserver for scroll sections
- **Logo PNG**: `artifacts/atera-platform/public/atera-logo.png` (gold A/I monogram, black background)
- **Hero image**: `artifacts/atera-platform/public/hero-apartment.png` (full-bleed)
- **Landlord image**: `artifacts/atera-platform/public/landlord-exterior.png`
- **Guest image**: `artifacts/atera-platform/public/guest-office.png`

### Hub (dark operational, Apple-clean)
- **Background**: `#0a0a0a` — all hub screens
- **Borders**: `#1d1d1f`
- **Sidebar active**: white left bar + white text + `#1d1d1f` bg
- **Topbar**: `52px`, `bg-[#0a0a0a]/80 backdrop-blur-[20px]`
- **Fonts**: Inter
- **Legacy CSS vars** (`--gold`, `--off-white`, etc.) still available for shadcn components

### Legacy CSS vars (keep for hub/shadcn compatibility)
- **Gold**: `#C9A84C` / `--gold`
- **Black**: `#080709` / `--black`
- **Near-black**: `#0D0C0F` / `--near-black`
- **Fonts**: Cormorant Garamond (`--font-display`) + Inter (`--font-body`)

## Database Schema (Supabase)

Tables: `properties`, `leads`, `bookings`, `enquiries`, `tasks`, `kpis`

RLS policies:
- Authenticated users: full CRUD on all tables
- Anonymous: INSERT on enquiries (public form), SELECT on live stays properties

## Public Routes

- `/` — Landing page (Hero → TrustBar → Landlord section → Guest section → How It Works → CTA → Footer)
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service

## Hub Routes (requires Supabase auth)

- `/hub/login` — Login page
- `/hub/dashboard` — KPI overview + recent activity + tasks
- `/hub/command` — Quick-action command centre
- `/hub/properties` — Property management (CRUD + detail view + tasks + photos)
- `/hub/crm` — Landlord CRM pipeline (CRUD + stage management)
- `/hub/bookings` — Guest bookings (CRUD + auto-calculate totals)
- `/hub/inbox` — Enquiry inbox (from public form, import to CRM/Bookings)
- `/hub/analyser` — Deal viability analyser with Atera Score (save to CRM)
- `/hub/contracts` — PDF contract generator (Stays + Management)
- `/hub/scripts` — Scripts, templates & objection handlers
- `/hub/onboarding` — Partner onboarding guide
- `/hub/settings` — Password, KPI logger, CSV export, data management

## Environment Secrets Required

All set:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — backend
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — frontend
- `RESEND_API_KEY` — email sending
- `INTERNAL_EMAIL` — destination for internal alerts
- `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLIC_KEY` — Stripe (structure only, not yet wired)
- `SESSION_SECRET` — session signing

## Important Notes

- **DO NOT** use `@workspace/api-client-react` hooks in atera-platform — it uses direct Supabase JS client + fetch("/api/enquiry")
- **DO NOT** add deal sourcing (lettings agents, Airbnb data) anywhere
- Properties with `status = 'live'` AND `service_type = 'stays'` are publicly listed on the landing page
- Hub redirects to `/hub/login` if no Supabase session
- `supabase-setup.sql` must be run in Supabase SQL Editor before any hub functionality works

## Key Commands

- `pnpm run typecheck` — full typecheck
- `pnpm --filter @workspace/atera-platform run dev` — frontend dev server
- `pnpm --filter @workspace/api-server run dev` — backend dev server
