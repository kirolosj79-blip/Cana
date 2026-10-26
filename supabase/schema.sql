-- ============================================================
-- CANA — Supabase schema
-- Run this ENTIRE file once in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run (uses "if not exists" / "on conflict" where possible).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- ENUM TYPES ----------
do $$ begin
  create type gender_type as enum ('male', 'female');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('member', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method_type as enum ('paypal', 'instapay');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_status_type as enum ('pending_review', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_state_type as enum ('waiting_review', 'approved', 'rejected', 'needs_more_documents');
exception when duplicate_object then null; end $$;

do $$ begin
  create type connection_status_type as enum ('pending', 'accepted', 'rejected', 'cancelled', 'expired');
exception when duplicate_object then null; end $$;


-- ============================================================
-- PROFILES — one row per member. id = auth.users.id.
-- Supabase Auth (phone provider) handles phone identity + OTP natively;
-- this table holds everything else, mirroring the app's own registration
-- draft shape closely (one JSONB column per wizard section) so the data
-- model needs no migration every time a field is added inside a section.
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text not null,
  email text,
  role user_role not null default 'member',
  is_onboarded boolean not null default false,
  is_paid_member boolean not null default false,
  gender gender_type,

  personal jsonb not null default '{}',
  church jsonb not null default '{}',
  eligibility jsonb not null default '{}',
  family jsonb not null default '{}',
  education jsonb not null default '{}',
  employment jsonb not null default '{}',
  lifestyle jsonb not null default '{}',
  getting_to_know_you jsonb not null default '{}',
  men_specific jsonb not null default '{}',
  women_specific jsonb not null default '{}',
  compatibility_preferences jsonb not null default '{}',
  safety_declaration jsonb not null default '{}',
  health jsonb not null default '{}',

  -- Per-field visibility map, e.g. {"personal.displayName": true}
  field_visibility jsonb not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- ⭐ Exactly what was asked for: no two profiles may share a phone
  -- number or a (non-null) email — enforced by the database itself, not
  -- just app code. Postgres UNIQUE allows multiple NULL emails (members
  -- who skip the optional email field), only actual duplicate values are
  -- rejected, which is the correct behavior here.
  constraint profiles_phone_unique unique (phone),
  constraint profiles_email_unique unique (email)
);

create index if not exists profiles_role_idx on public.profiles(role);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create a profile row the moment someone verifies their phone via
-- Supabase Auth, so the app never has to manually "create" a profile.
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();


-- ============================================================
-- ADMIN REVIEWS — Identity / Church & Faith / Marriage Eligibility / Medical
-- ============================================================
create table if not exists public.admin_reviews (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  section text not null,
  state review_state_type not null default 'waiting_review',
  note text,
  updated_at timestamptz not null default now(),
  unique (profile_id, section)
);

drop trigger if exists admin_reviews_set_updated_at on public.admin_reviews;
create trigger admin_reviews_set_updated_at
before update on public.admin_reviews
for each row execute function public.set_updated_at();


-- ============================================================
-- PENDING SENSITIVE-FIELD CHANGES (edits awaiting admin approval)
-- ============================================================
create table if not exists public.pending_changes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  field_label text not null,
  section text not null,
  patch jsonb not null,
  old_summary text,
  new_summary text,
  created_at timestamptz not null default now()
);


-- ============================================================
-- PAYMENT REQUESTS
-- ============================================================
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  method payment_method_type not null,
  screenshot_path text,
  status payment_status_type not null default 'pending_review',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_note text
);

create index if not exists payment_requests_profile_idx on public.payment_requests(profile_id);
create index if not exists payment_requests_status_idx on public.payment_requests(status);


-- ============================================================
-- CONNECTION REQUESTS — enforced "one active state at a time" at the
-- database layer via partial unique indexes, so it holds even against a
-- direct API call, not just the app's own UI logic.
-- ============================================================
create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  from_profile_id uuid not null references public.profiles(id) on delete cascade,
  to_profile_id uuid not null references public.profiles(id) on delete cascade,
  status connection_status_type not null default 'pending',
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  constraint no_self_request check (from_profile_id <> to_profile_id)
);

create index if not exists connection_requests_from_idx on public.connection_requests(from_profile_id);
create index if not exists connection_requests_to_idx on public.connection_requests(to_profile_id);

drop index if exists one_active_outgoing_per_profile;
create unique index one_active_outgoing_per_profile
  on public.connection_requests (from_profile_id)
  where status in ('pending', 'accepted');

drop index if exists one_active_incoming_per_profile;
create unique index one_active_incoming_per_profile
  on public.connection_requests (to_profile_id)
  where status in ('pending', 'accepted');


-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  target text,
  related_user_id uuid references public.profiles(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_profile_idx on public.notifications(profile_id);


-- ============================================================
-- COMPLAINTS
-- ============================================================
create table if not exists public.complaints (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  description text not null,
  against_user_id uuid references public.profiles(id) on delete set null,
  screenshot_path text,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.profiles enable row level security;
alter table public.admin_reviews enable row level security;
alter table public.pending_changes enable row level security;
alter table public.payment_requests enable row level security;
alter table public.connection_requests enable row level security;
alter table public.notifications enable row level security;
alter table public.complaints enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- profiles
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or public.is_admin() or auth.role() = 'authenticated');
-- ^ any authenticated member can read profiles (needed for Discover/matching);
--   the app itself decides what subset of columns to actually query/show.

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- admin_reviews
drop policy if exists "admin_reviews_select_own" on public.admin_reviews;
create policy "admin_reviews_select_own" on public.admin_reviews for select
  using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "admin_reviews_admin_write" on public.admin_reviews;
create policy "admin_reviews_admin_write" on public.admin_reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- pending_changes
drop policy if exists "pending_changes_select_own" on public.pending_changes;
create policy "pending_changes_select_own" on public.pending_changes for select
  using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "pending_changes_insert_own" on public.pending_changes;
create policy "pending_changes_insert_own" on public.pending_changes for insert
  with check (profile_id = auth.uid());

drop policy if exists "pending_changes_admin_delete" on public.pending_changes;
create policy "pending_changes_admin_delete" on public.pending_changes for delete
  using (public.is_admin());

-- payment_requests
drop policy if exists "payment_requests_select_own" on public.payment_requests;
create policy "payment_requests_select_own" on public.payment_requests for select
  using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own" on public.payment_requests for insert
  with check (profile_id = auth.uid());

drop policy if exists "payment_requests_admin_update" on public.payment_requests;
create policy "payment_requests_admin_update" on public.payment_requests for update
  using (public.is_admin());

-- connection_requests
drop policy if exists "connections_select_party" on public.connection_requests;
create policy "connections_select_party" on public.connection_requests for select
  using (from_profile_id = auth.uid() or to_profile_id = auth.uid());

drop policy if exists "connections_insert_sender" on public.connection_requests;
create policy "connections_insert_sender" on public.connection_requests for insert
  with check (from_profile_id = auth.uid());

drop policy if exists "connections_update_party" on public.connection_requests;
create policy "connections_update_party" on public.connection_requests for update
  using (to_profile_id = auth.uid() or from_profile_id = auth.uid());

-- notifications
drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select
  using (profile_id = auth.uid());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications for update
  using (profile_id = auth.uid());

drop policy if exists "notifications_insert_any" on public.notifications;
create policy "notifications_insert_any" on public.notifications for insert
  with check (true); -- typically written by a server-side function / service_role

-- complaints
drop policy if exists "complaints_select_own" on public.complaints;
create policy "complaints_select_own" on public.complaints for select
  using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "complaints_insert_own" on public.complaints;
create policy "complaints_insert_own" on public.complaints for insert
  with check (profile_id = auth.uid());

drop policy if exists "complaints_admin_update" on public.complaints;
create policy "complaints_admin_update" on public.complaints for update
  using (public.is_admin());


-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('verification-documents', 'verification-documents', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('payment-proofs', 'payment-proofs', false)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
  values ('profile-photos', 'profile-photos', true)
  on conflict (id) do nothing;

-- Convention: file path is "{user_id}/filename.ext" — these policies key
-- off the first path segment matching the uploader's own auth.uid().
drop policy if exists "verification_docs_own" on storage.objects;
create policy "verification_docs_own" on storage.objects for all
  using (bucket_id = 'verification-documents' and (auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'verification-documents' and (auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists "payment_proofs_own" on storage.objects;
create policy "payment_proofs_own" on storage.objects for all
  using (bucket_id = 'payment-proofs' and (auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'payment-proofs' and (auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists "profile_photos_own_write" on storage.objects;
create policy "profile_photos_own_write" on storage.objects for insert
  with check (bucket_id = 'profile-photos' and (auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists "profile_photos_public_read" on storage.objects;
create policy "profile_photos_public_read" on storage.objects for select
  using (bucket_id = 'profile-photos');

-- ============================================================
-- Done. Next: Authentication → Sign In / Up → Phone, enable a phone
-- provider (Twilio etc.) so real OTP SMS/WhatsApp can send.
-- To make yourself an admin after signing up once through the app:
--   update public.profiles set role = 'admin' where phone = '+201xxxxxxxxx';
-- ============================================================
