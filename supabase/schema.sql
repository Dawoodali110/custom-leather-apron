-- Custom Leather Apron — database setup for Supabase
-- Run this once in Supabase: SQL Editor → New query → paste → Run.
-- Then add your admin email to the admins table (last line) and create that
-- user under Authentication → Users → Add user.

create extension if not exists pgcrypto;

-- Who may open the dashboard
create table if not exists public.admins (
  email text primary key
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

-- Orders placed at checkout
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  order_no text not null unique check (char_length(order_no) between 6 and 40),
  status text not null default 'new' check (status in ('new','awaiting_payment','paid','in_production','shipped','delivered','cancelled','refunded')),
  email text not null check (char_length(email) between 5 and 200),
  phone text check (char_length(phone) <= 40),
  first_name text not null check (char_length(first_name) <= 80),
  last_name text not null check (char_length(last_name) <= 80),
  company text check (char_length(company) <= 120),
  address1 text not null check (char_length(address1) <= 200),
  address2 text check (char_length(address2) <= 200),
  city text not null check (char_length(city) <= 100),
  state text check (char_length(state) <= 100),
  zip text not null check (char_length(zip) <= 30),
  country text not null check (char_length(country) <= 80),
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 1 and 50),
  subtotal numeric(10,2) not null check (subtotal >= 0 and subtotal < 100000),
  shipping numeric(10,2) check (shipping >= 0 and shipping < 10000),
  total numeric(10,2) not null check (total >= 0 and total < 100000),
  notes text check (char_length(notes) <= 2000),
  newsletter boolean default false,
  tracking text,
  carrier text,
  admin_notes text
);

-- Contact form messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  status text not null default 'new' check (status in ('new','replied','closed')),
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) between 5 and 200),
  phone text check (char_length(phone) <= 40),
  topic text check (char_length(topic) <= 60),
  business text check (char_length(business) <= 120),
  quantity text check (char_length(quantity) <= 20),
  order_no text check (char_length(order_no) <= 40),
  message text not null check (char_length(message) <= 5000),
  attachment_name text check (char_length(attachment_name) <= 200),
  admin_notes text
);

-- Newsletter subscribers
create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  email text not null unique check (char_length(email) between 5 and 200),
  source text check (char_length(source) <= 40)
);

-- Row-level security: visitors can only ADD rows; only admins can read/change them
alter table public.admins enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.subscribers enable row level security;

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins for select to authenticated using (public.is_admin());

drop policy if exists "public can place orders" on public.orders;
create policy "public can place orders" on public.orders for insert to anon, authenticated
  with check (status = 'new' and tracking is null and admin_notes is null);
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can send messages" on public.messages;
create policy "public can send messages" on public.messages for insert to anon, authenticated
  with check (status = 'new' and admin_notes is null);
drop policy if exists "admins manage messages" on public.messages;
create policy "admins manage messages" on public.messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public can subscribe" on public.subscribers;
create policy "public can subscribe" on public.subscribers for insert to anon, authenticated with check (true);
drop policy if exists "admins manage subscribers" on public.subscribers;
create policy "admins manage subscribers" on public.subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- >>> Replace with the email you will log in with, then run:
-- insert into public.admins (email) values ('sales@customleatherapron.com') on conflict do nothing;
