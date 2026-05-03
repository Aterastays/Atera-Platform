-- Migration 001: Add missing columns to enquiries table
-- Run in: Supabase Dashboard → SQL Editor → New query → paste → Run

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS property_id uuid;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS property_name text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS service_type text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS check_in date;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS check_out date;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS guests integer;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS type_of_stay text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS bedrooms integer;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS current_rent numeric(10,2);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS tenanted boolean;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS available_from date;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS current_situation text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS goals text;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS imported boolean DEFAULT false;

-- Refresh PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
