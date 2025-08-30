-- USERS (1:1 with auth.users)
create table if not exists public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text unique,
  dominant_hand       text,              -- 'righty' | 'lefty'
  stroke_to_improve   text,              -- 'forehand' | 'backhand_1h' | 'backhand_2h' | 'serve'
  experience_level    text,
  created_at          timestamptz not null default now(),
  stripe_customer_id  text,
  plan                text,
  total_analyses      int4 not null default 0,
  survey_completed    boolean not null default false,
  survey_completed_at timestamptz
);

-- ANALYSES
create table if not exists public.analyses (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  video_filename   text,
  stroke_analyzed  text,
  analysis_result  jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists idx_analyses_user_created
  on public.analyses (user_id, created_at desc);

-- SURVEYS
create table if not exists public.surveys (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references public.users(id) on delete cascade,
  satisfaction_rating      int4,
  most_helpful_feature     text,
  improvement_suggestions  text,
  would_recommend          boolean,
  additional_comments      text,
  created_at               timestamptz not null default now()
);

create index if not exists idx_surveys_user_created
  on public.surveys (user_id, created_at desc);

-- RLS
alter table public.users    enable row level security;
alter table public.analyses enable row level security;
alter table public.surveys  enable row level security;

-- USERS policies
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
  on public.users for select
  using (id = auth.uid());

drop policy if exists "users_insert_self" on public.users;
create policy "users_insert_self"
  on public.users for insert
  with check (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ANALYSES policies
drop policy if exists "analyses_select_own" on public.analyses;
create policy "analyses_select_own"
  on public.analyses for select
  using (user_id = auth.uid());

drop policy if exists "analyses_insert_own" on public.analyses;
create policy "analyses_insert_own"
  on public.analyses for insert
  with check (user_id = auth.uid());

drop policy if exists "analyses_update_own" on public.analyses;
create policy "analyses_update_own"
  on public.analyses for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_delete_own"
  on public.analyses for delete
  using (user_id = auth.uid());

-- SURVEYS policies
drop policy if exists "surveys_select_own" on public.surveys;
create policy "surveys_select_own"
  on public.surveys for select
  using (user_id = auth.uid());

drop policy if exists "surveys_insert_own" on public.surveys;
create policy "surveys_insert_own"
  on public.surveys for insert
  with check (user_id = auth.uid());

drop policy if exists "surveys_update_own" on public.surveys;
create policy "surveys_update_own"
  on public.surveys for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "surveys_delete_own" on public.surveys;
create policy "surveys_delete_own"
  on public.surveys for delete
  using (user_id = auth.uid());