-- Create waitlist table for collecting emails
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.waitlist enable row level security;

-- Allow anyone to insert into waitlist (for public signup)
drop policy if exists "waitlist_insert_public" on public.waitlist;
create policy "waitlist_insert_public"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- Allow reading own entries (optional, in case we want to check if email exists)
drop policy if exists "waitlist_select_public" on public.waitlist;
create policy "waitlist_select_public"
  on public.waitlist for select
  to anon, authenticated
  using (true);

-- Create index for email lookups
create index if not exists idx_waitlist_email
  on public.waitlist (email);