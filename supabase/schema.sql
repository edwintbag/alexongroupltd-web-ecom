-- Alexon Group Ltd — website tables
-- Run this in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------- Quote requests ----------
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  phone text not null,
  email text not null,
  site_location text not null,
  enquiry_type text,
  project_description text,
  delivery_date date,
  notes text,
  items jsonb not null,
  status text not null default 'new'
);

-- ---------- Orders ----------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reference text not null unique,
  customer jsonb not null,
  delivery jsonb not null,
  lines jsonb not null,
  subtotal numeric(12,2) not null,
  payment_method text not null,
  payment_status text not null default 'pending',
  checkout_request_id text,
  mpesa_receipt text,
  mpesa_phone text,
  failure_reason text,
  status text not null default 'new'
);
create index if not exists orders_checkout_request_id_idx on orders (checkout_request_id);
create index if not exists orders_reference_idx on orders (reference);

-- ---------- Equipment bookings ----------
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  equipment text not null,
  name text not null,
  phone text not null,
  email text not null,
  site_location text not null,
  start_date date not null,
  duration text not null,
  notes text,
  status text not null default 'new'
);

-- ---------- Job applications ----------
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  location text not null,
  position text not null,
  message text,
  cv_path text,              -- path inside the private 'cvs' bucket, never a public URL
  status text not null default 'new'
);

-- ---------- General enquiries ----------
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  category text not null,
  message text not null,
  status text not null default 'new'
);

-- ---------- Lock everything down ----------
-- RLS on with no policies means the anon key can do nothing at all.
-- Only the service role key (server-side, in API routes) can read or write.
alter table quotes       enable row level security;
alter table orders       enable row level security;
alter table bookings     enable row level security;
alter table applications enable row level security;
alter table enquiries    enable row level security;

-- ---------- Private storage for CVs ----------
-- Run once. 'false' = private bucket; files are only reachable via signed URLs.
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;
