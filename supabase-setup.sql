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

-- ═══════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════

alter table properties enable row level security;
alter table leads enable row level security;
alter table bookings enable row level security;
alter table enquiries enable row level security;
alter table tasks enable row level security;
alter table kpis enable row level security;

-- Authenticated users: full access to everything
create policy "authenticated_all_properties" on properties for all to authenticated using (true) with check (true);
create policy "authenticated_all_leads" on leads for all to authenticated using (true) with check (true);
create policy "authenticated_all_bookings" on bookings for all to authenticated using (true) with check (true);
create policy "authenticated_all_enquiries" on enquiries for all to authenticated using (true) with check (true);
create policy "authenticated_all_tasks" on tasks for all to authenticated using (true) with check (true);
create policy "authenticated_all_kpis" on kpis for all to authenticated using (true) with check (true);

-- Anonymous: INSERT only on enquiries
create policy "anon_insert_enquiries" on enquiries for insert to anon with check (true);

-- Anonymous: SELECT only on live stays properties (public listing)
create policy "anon_select_live_stays" on properties for select to anon using (status = 'live' and service_type = 'stays');
