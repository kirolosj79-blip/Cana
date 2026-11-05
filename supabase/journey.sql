-- ============================================================
-- CANA — Journey tables (run AFTER schema.sql, once)
-- Chat, introduction progress, contact exchange, reports, blocks,
-- feedback, welcome-back tracking, + a privacy fix for profiles.
-- Safe to re-run.
-- ============================================================

-- ---------- 0) PRIVACY FIX ----------
-- The first schema let ANY signed-in member read every column of every
-- profile (phone, email, health, ...). Lock the table down to its owner
-- and admins, and expose only safe, display-level fields through a view.
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create or replace view public.public_profiles as
select
  p.id,
  p.gender,
  p.personal->>'firstName'           as first_name,
  p.personal->>'lastName'            as last_name,
  p.personal->>'dateOfBirth'         as date_of_birth,
  p.personal->>'cityState'           as city_state,
  p.personal->>'countryOfResidence'  as country,
  p.personal->>'profilePhotoUrl'     as profile_photo_url,
  p.personal->>'bio'                 as bio,
  p.employment->>'occupation'        as occupation,
  p.education->>'level'              as education_level,
  p.church->>'churchName'            as church_name,
  p.church->>'diocese'               as diocese,
  p.compatibility_preferences        as compatibility_preferences,
  (
    p.is_paid_member
    and not exists (
      select 1 from public.admin_reviews r
      where r.profile_id = p.id and r.state <> 'approved'
    )
    and (select count(*) from public.admin_reviews r where r.profile_id = p.id) >= 4
  )                                  as is_verified
from public.profiles p;

-- The view runs with its owner's rights, so signed-in members can read
-- these safe columns for everyone, but nothing else.
revoke all on public.public_profiles from anon;
grant select on public.public_profiles to authenticated;


-- ---------- 1) per-member journey state ----------
create table if not exists public.journey_state (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  submitted_seen boolean not null default false,
  safety_accepted boolean not null default false,
  contact_policy_accepted boolean not null default false,
  feedback_owed boolean not null default false,
  account_status text not null default 'active'
    check (account_status in ('active', 'paused')),
  last_active_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ---------- 2) introduction state on connection_requests ----------
alter table public.connection_requests
  add column if not exists outcome text not null default 'active'
    check (outcome in ('active', 'completed', 'ended', 'blocked')),
  add column if not exists ended_by uuid references public.profiles(id);

-- per-person progress inside one introduction
create table if not exists public.introduction_progress (
  connection_id uuid not null references public.connection_requests(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  guidelines_accepted boolean not null default false,
  ready_outside boolean not null default false,
  primary key (connection_id, profile_id)
);


-- ---------- 3) chat ----------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  connection_id uuid not null references public.connection_requests(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists messages_conn_idx on public.messages(connection_id, created_at);


-- ---------- 4) contact exchange (simultaneous reveal) ----------
create table if not exists public.contact_shares (
  connection_id uuid not null references public.connection_requests(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  share_whatsapp boolean not null default false,
  share_call boolean not null default false,
  share_email boolean not null default false,
  extra_channel text,
  created_at timestamptz not null default now(),
  primary key (connection_id, profile_id)
);


-- ---------- 5) reports, blocks, feedback ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_id uuid not null references public.profiles(id) on delete cascade,
  connection_id uuid references public.connection_requests(id) on delete set null,
  reasons text[] not null default '{}',
  note text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table if not exists public.introduction_feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  connection_id uuid references public.connection_requests(id) on delete set null,
  answers jsonb not null default '{}',
  created_at timestamptz not null default now()
);


-- ---------- 6) row level security ----------
alter table public.journey_state enable row level security;
alter table public.introduction_progress enable row level security;
alter table public.messages enable row level security;
alter table public.contact_shares enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;
alter table public.introduction_feedback enable row level security;

-- helper: is the caller a party of this connection?
create or replace function public.is_connection_party(conn uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.connection_requests c
    where c.id = conn and (c.from_profile_id = auth.uid() or c.to_profile_id = auth.uid())
  );
$$;

drop policy if exists "journey_state_own" on public.journey_state;
create policy "journey_state_own" on public.journey_state for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "intro_progress_own" on public.introduction_progress;
create policy "intro_progress_own" on public.introduction_progress for all
  using (profile_id = auth.uid() and public.is_connection_party(connection_id))
  with check (profile_id = auth.uid() and public.is_connection_party(connection_id));

-- chat: both parties read; only an accepted, still-active introduction accepts new messages
drop policy if exists "messages_select_party" on public.messages;
create policy "messages_select_party" on public.messages for select
  using (public.is_connection_party(connection_id));

drop policy if exists "messages_insert_party" on public.messages;
create policy "messages_insert_party" on public.messages for insert
  with check (
    sender_id = auth.uid()
    and public.is_connection_party(connection_id)
    and exists (
      select 1 from public.connection_requests c
      where c.id = connection_id and c.status = 'accepted' and c.outcome = 'active'
    )
  );

-- contact exchange: you always see your own row; you only see the other
-- person's row once BOTH of you have submitted (simultaneous reveal).
drop policy if exists "contact_shares_insert_own" on public.contact_shares;
create policy "contact_shares_insert_own" on public.contact_shares for insert
  with check (profile_id = auth.uid() and public.is_connection_party(connection_id));

drop policy if exists "contact_shares_select" on public.contact_shares;
create policy "contact_shares_select" on public.contact_shares for select
  using (
    profile_id = auth.uid()
    or (
      public.is_connection_party(connection_id)
      and exists (
        select 1 from public.contact_shares mine
        where mine.connection_id = contact_shares.connection_id and mine.profile_id = auth.uid()
      )
    )
  );

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports for insert with check (reporter_id = auth.uid());
drop policy if exists "reports_select" on public.reports;
create policy "reports_select" on public.reports for select using (reporter_id = auth.uid() or public.is_admin());
drop policy if exists "reports_admin_update" on public.reports;
create policy "reports_admin_update" on public.reports for update using (public.is_admin());

drop policy if exists "blocks_own" on public.blocks;
create policy "blocks_own" on public.blocks for all
  using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

drop policy if exists "feedback_insert_own" on public.introduction_feedback;
create policy "feedback_insert_own" on public.introduction_feedback for insert with check (profile_id = auth.uid());
drop policy if exists "feedback_select" on public.introduction_feedback;
create policy "feedback_select" on public.introduction_feedback for select using (profile_id = auth.uid() or public.is_admin());


-- ---------- 7) actions that must be atomic (called with supabase.rpc) ----------
-- End an introduction (the "End This Introduction" / "End" buttons).
create or replace function public.end_introduction(conn uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_connection_party(conn) then raise exception 'not a party'; end if;
  update public.connection_requests
     set status = 'cancelled', outcome = 'ended', ended_by = auth.uid(), responded_at = now()
   where id = conn;
  insert into public.journey_state (profile_id, feedback_owed)
  select p, true from unnest(array[
    (select from_profile_id from public.connection_requests where id = conn),
    (select to_profile_id   from public.connection_requests where id = conn)
  ]) p
  on conflict (profile_id) do update set feedback_owed = true, updated_at = now();
end $$;

-- Block & conclude: ends the introduction and records the block.
create or replace function public.block_and_conclude(conn uuid)
returns void language plpgsql security definer set search_path = public as $$
declare other uuid;
begin
  if not public.is_connection_party(conn) then raise exception 'not a party'; end if;
  select case when from_profile_id = auth.uid() then to_profile_id else from_profile_id end
    into other from public.connection_requests where id = conn;
  insert into public.blocks (blocker_id, blocked_id) values (auth.uid(), other) on conflict do nothing;
  update public.connection_requests
     set status = 'cancelled', outcome = 'blocked', ended_by = auth.uid(), responded_at = now()
   where id = conn;
  insert into public.journey_state (profile_id, feedback_owed) values (auth.uid(), true)
  on conflict (profile_id) do update set feedback_owed = true, updated_at = now();
end $$;

-- Complete an introduction once BOTH people shared contact details:
-- marks it completed and pauses both profiles (Profiles Paused screen).
create or replace function public.complete_introduction(conn uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare a uuid; b uuid;
begin
  if not public.is_connection_party(conn) then raise exception 'not a party'; end if;
  if (select count(*) from public.contact_shares where connection_id = conn) < 2 then
    return false;
  end if;
  select from_profile_id, to_profile_id into a, b from public.connection_requests where id = conn;
  update public.connection_requests set outcome = 'completed' where id = conn;
  insert into public.journey_state (profile_id, account_status)
    values (a, 'paused'), (b, 'paused')
  on conflict (profile_id) do update set account_status = 'paused', updated_at = now();
  return true;
end $$;

grant execute on function public.end_introduction(uuid) to authenticated;
grant execute on function public.block_and_conclude(uuid) to authenticated;
grant execute on function public.complete_introduction(uuid) to authenticated;


-- ---------- 8) realtime chat ----------
do $$ begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null; when undefined_object then null; end $$;
