-- ATERA STAYS — Supabase Database Setup
-- Run this in your Supabase SQL Editor before starting

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ═══════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  postcode text,
  beds integer,
  service_type text check (service_type in ('stays', 'management')) default 'stays',
  status text check (status in ('live', 'pending', 'archived')) default 'pending',
  launch_date date,
  monthly_revenue numeric(10,2),
  occupancy_rate numeric(5,2),
  cleaning_costs numeric(10,2),
  notes text,
  photos jsonb default '[]',
  landlord_id uuid,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  source text,
  address text,
  postcode text,
  beds integer,
  service_type text check (service_type in ('stays', 'management')),
  pipeline_status text check (pipeline_status in ('new','called','analysing','offer','contract','live','lost')) default 'new',
  rent_amount numeric(10,2),
  tenanted boolean default false,
  follow_up_date date,
  notes text,
  deal_data jsonb,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  property_id uuid references properties(id),
  property_name text,
  check_in date,
  check_out date,
  nightly_rate numeric(10,2),
  total_amount numeric(10,2),
  guests integer default 1,
  source text,
  status text check (status in ('new','contacted','confirmed','completed')) default 'new',
  message text,
  type_of_stay text,
  created_at timestamptz default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('guest','landlord')) not null,
  name text not null,
  email text,
  phone text,
  address text,
  property_id uuid,
  property_name text,
  service_type text,
  check_in date,
  check_out date,
  guests integer,
  type_of_stay text,
  bedrooms integer,
  current_rent numeric(10,2),
  tenanted boolean,
  available_from date,
  current_situation text,
  goals text,
  message text,
  imported boolean default false,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id),
  description text not null,
  due_date date,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists kpis (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  ll_calls integer default 0,
  agent_calls integer default 0,
  messages integer default 0,
  new_leads integer default 0,
  offers integer default 0,
  created_at timestamptz default now()
);

-- Hub admins: only users listed here may access Hub data
create table if not exists hub_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

alter table properties enable row level security;
alter table leads enable row level security;
alter table bookings enable row level security;
alter table enquiries enable row level security;
alter table tasks enable row level security;
alter table kpis enable row level security;
alter table hub_admins enable row level security;

-- ───────────────────────────────────────
-- Remove previously overbroad policies (idempotent: safe to run on an
-- existing database that already has these names).
-- ───────────────────────────────────────
drop policy if exists "authenticated_all_properties" on properties;
drop policy if exists "authenticated_all_leads" on leads;
drop policy if exists "authenticated_all_bookings" on bookings;
drop policy if exists "authenticated_all_enquiries" on enquiries;
drop policy if exists "authenticated_all_tasks" on tasks;
drop policy if exists "authenticated_all_kpis" on kpis;

-- Remove the old anon row policy that allowed direct access to the
-- full properties table (column restriction is now enforced by the view).
drop policy if exists "anon_select_live_stays" on properties;

-- ───────────────────────────────────────
-- Admin helper function
-- security definer: runs as the function owner so it can always read
-- hub_admins regardless of the caller's own RLS privileges.
-- search_path is pinned to prevent search-path-based name hijacking.
-- ───────────────────────────────────────
create or replace function is_hub_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from hub_admins where user_id = auth.uid()
  )
$$;

-- ───────────────────────────────────────
-- Hub tables: only hub admins may read or write
-- ───────────────────────────────────────
drop policy if exists "hub_admin_all_properties" on properties;
create policy "hub_admin_all_properties" on properties
  for all to authenticated
  using (is_hub_admin())
  with check (is_hub_admin());

drop policy if exists "hub_admin_all_leads" on leads;
create policy "hub_admin_all_leads" on leads
  for all to authenticated
  using (is_hub_admin())
  with check (is_hub_admin());

drop policy if exists "hub_admin_all_bookings" on bookings;
create policy "hub_admin_all_bookings" on bookings
  for all to authenticated
  using (is_hub_admin())
  with check (is_hub_admin());

drop policy if exists "hub_admin_all_enquiries" on enquiries;
create policy "hub_admin_all_enquiries" on enquiries
  for all to authenticated
  using (is_hub_admin())
  with check (is_hub_admin());

drop policy if exists "hub_admin_all_tasks" on tasks;
create policy "hub_admin_all_tasks" on tasks
  for all to authenticated
  using (is_hub_admin())
  with check (is_hub_admin());

drop policy if exists "hub_admin_all_kpis" on kpis;
create policy "hub_admin_all_kpis" on kpis
  for all to authenticated
  using (is_hub_admin())
  with check (is_hub_admin());

-- hub_admins table: admins can read their own row; no self-modification
drop policy if exists "hub_admins_self_read" on hub_admins;
create policy "hub_admins_self_read" on hub_admins
  for select to authenticated
  using (user_id = auth.uid());

-- ───────────────────────────────────────
-- Anonymous: INSERT only on enquiries (public contact form)
-- ───────────────────────────────────────
drop policy if exists "anon_insert_enquiries" on enquiries;
create policy "anon_insert_enquiries" on enquiries
  for insert to anon
  with check (true);

-- ───────────────────────────────────────
-- Public properties view — intentionally limited column set
--
-- Columns included are those displayed on the public marketing site:
--   id        — needed to reference a property in the enquiry form
--   name      — displayed as the listing title
--   postcode  — displayed as the area/location label (not full address)
--   beds      — displayed in the listing card
--   photos    — only public marketing photos uploaded by admins
--   service_type / status — used in the WHERE filter, safe to expose
--
-- Columns deliberately excluded (internal business data):
--   address, monthly_revenue, occupancy_rate, cleaning_costs,
--   notes, landlord_id, created_at
--
-- Anonymous users query this view exclusively; they never have an RLS
-- policy on the underlying properties table, so they cannot bypass the
-- column allowlist by querying the table directly.
-- ───────────────────────────────────────
drop view if exists public_properties;
create view public_properties
  with (security_invoker = false)
as
  select
    id,
    name,
    postcode,
    beds,
    service_type,
    status,
    photos
  from properties
  where status = 'live'
    and service_type = 'stays';

-- Grant SELECT to both anon and authenticated roles.
-- The public listing is visible whether or not the visitor is signed in;
-- authenticated sessions use the `authenticated` Postgres role, so they
-- would otherwise be unable to load public property cards unless they
-- happen to be hub admins (who have direct table access via RLS).
grant select on public_properties to anon;
grant select on public_properties to authenticated;

-- ───────────────────────────────────────
-- BOOTSTRAP: first-time admin setup
-- After running this script, insert the Supabase user ID of each Hub
-- administrator into hub_admins using the service role or the Supabase
-- dashboard Table Editor (service role bypasses RLS):
--
--   insert into hub_admins (user_id) values ('<your-auth-user-uuid>');
--
-- You can find user UUIDs in Authentication → Users in the Supabase
-- dashboard. At least one admin must be bootstrapped before any Hub
-- login will succeed, because the new RLS policies deny all Hub table
-- access to non-admin authenticated users.
-- ───────────────────────────────────────
