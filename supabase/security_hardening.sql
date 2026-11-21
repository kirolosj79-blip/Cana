-- ============================================================
-- CANA — SECURITY HARDENING.  Run AFTER schema.sql, journey.sql and no_otp.sql.
-- Safe to re-run. Fixes: privilege escalation, data leaks, forged payments,
-- spoofed notifications, anon access, storage limits.
-- ============================================================

-- 1) is_admin(): SECURITY DEFINER so policies on profiles can call it without
--    recursing into profiles' own RLS (and with a pinned search_path).
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- caller helpers (defined early: policies below use them)
create or replace function public.caller_is_verified()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.is_paid_member
      and (select count(*) from public.admin_reviews r where r.profile_id = p.id and r.state = 'approved') >= 4
  );
$$;

create or replace function public.caller_gender()
returns gender_type language sql stable security definer set search_path = public as $$
  select gender from public.profiles where id = auth.uid();
$$;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, nullif(new.phone, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

-- NOTE: the guard triggers are SECURITY INVOKER on purpose: inside a SECURITY DEFINER
-- trigger current_user would be the owner and the check would never fire.

-- 2) PROFILES: nobody can promote themselves or mark themselves paid/verified.
create or replace function public.guard_profile_update()
returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    new.role := old.role;
    new.is_paid_member := old.is_paid_member;
    new.id := old.id;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_guard_update on public.profiles;
create trigger profiles_guard_update before update on public.profiles
for each row execute function public.guard_profile_update();

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (auth.uid() = id and role = 'member' and is_paid_member = false);

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Only the owner or an admin may read a full profile row (phone, email, health...).
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select
  using (auth.uid() = id or public.is_admin());

-- 3) CONNECTION REQUESTS: parties can't rewrite who/what; only legal transitions.
drop policy if exists "connections_insert_sender" on public.connection_requests;
create policy "connections_insert_sender" on public.connection_requests for insert
  with check (from_profile_id = auth.uid() and status = 'pending' and outcome = 'active' and public.caller_is_verified());

create or replace function public.guard_connection_update()
returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    if new.from_profile_id <> old.from_profile_id or new.to_profile_id <> old.to_profile_id then
      raise exception 'parties cannot be changed';
    end if;
    if new.outcome is distinct from old.outcome or new.ended_by is distinct from old.ended_by then
      raise exception 'use the end/complete/block functions';
    end if;
    if new.status is distinct from old.status then
      if old.status = 'pending' and auth.uid() = old.to_profile_id and new.status in ('accepted', 'rejected') then
        null; -- recipient answers
      elsif old.status = 'pending' and auth.uid() = old.from_profile_id and new.status = 'cancelled' then
        null; -- sender withdraws
      else
        raise exception 'illegal status change';
      end if;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists connection_guard_update on public.connection_requests;
create trigger connection_guard_update before update on public.connection_requests
for each row execute function public.guard_connection_update();

-- 4) NOTIFICATIONS: clients can't write notifications for other people.
drop policy if exists "notifications_insert_any" on public.notifications;
-- (no insert policy: notifications are created by SECURITY DEFINER functions / service role only)

-- 5) PAYMENTS & COMPLAINTS: a member can only file a *pending* item.
drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own" on public.payment_requests for insert
  with check (profile_id = auth.uid() and status = 'pending_review' and reviewed_at is null and review_note is null);

drop policy if exists "complaints_insert_own" on public.complaints;
create policy "complaints_insert_own" on public.complaints for insert
  with check (profile_id = auth.uid() and status = 'submitted');

-- Admin approving a payment marks the member paid (members can never do this themselves).
create or replace function public.apply_payment_review()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    update public.profiles set is_paid_member = true where id = new.profile_id;
  end if;
  return new;
end;
$$;
drop trigger if exists payment_review_applies on public.payment_requests;
create trigger payment_review_applies after update on public.payment_requests
for each row execute function public.apply_payment_review();

-- 6) JOURNEY STATE: members can't flip "feedback owed" off or un-pause themselves.
create or replace function public.guard_journey_state()
returns trigger language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.feedback_owed := false; new.account_status := 'active';
    else
      new.feedback_owed := old.feedback_owed; new.account_status := old.account_status;
    end if;
  end if;
  return new;
end;
$$;
drop trigger if exists journey_state_guard on public.journey_state;
create trigger journey_state_guard before insert or update on public.journey_state
for each row execute function public.guard_journey_state();

-- 7) DISCOVER VIEW: only verified+paid members see it, only opposite gender,
--    no phone/email/DOB/health — age and last initial only.
create or replace function public.safe_age(d text)
returns int language plpgsql immutable as $$
begin
  return date_part('year', age(d::date))::int;
exception when others then
  return null;
end;
$$;

drop view if exists public.public_profiles;
create view public.public_profiles as
select
  p.id,
  p.gender,
  p.personal->>'firstName'                         as first_name,
  left(coalesce(p.personal->>'lastName', ''), 1)   as last_initial,
  public.safe_age(p.personal->>'dateOfBirth')      as age,
  p.personal->>'cityState'                         as city_state,
  p.personal->>'countryOfResidence'                as country,
  p.personal->>'profilePhotoUrl'                   as profile_photo_url,
  p.personal->>'bio'                               as bio,
  p.employment->>'occupation'                      as occupation,
  p.education->>'level'                            as education_level,
  p.church->>'denomination'                        as denomination,
  p.church->>'churchName'                          as church_name,
  p.church->>'diocese'                             as diocese
from public.profiles p
where p.id <> auth.uid()
  and p.is_paid_member
  and p.gender is not null
  and p.gender is distinct from public.caller_gender()
  and public.caller_is_verified()
  and (select count(*) from public.admin_reviews r where r.profile_id = p.id and r.state = 'approved') >= 4
  and not exists (select 1 from public.blocks b
                  where (b.blocker_id = auth.uid() and b.blocked_id = p.id)
                     or (b.blocker_id = p.id and b.blocked_id = auth.uid()));

-- 8) STORAGE: private buckets (+ admin can review docs), size/type limits, photos not world-readable.
update storage.buckets set public = false,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp','application/pdf']
where id in ('verification-documents', 'payment-proofs');
update storage.buckets set public = false,
  file_size_limit = 3145728,
  allowed_mime_types = array['image/jpeg','image/png','image/webp']
where id = 'profile-photos';

drop policy if exists "admin_read_docs" on storage.objects;
create policy "admin_read_docs" on storage.objects for select
  using (bucket_id in ('verification-documents', 'payment-proofs') and public.is_admin());

drop policy if exists "profile_photos_public_read" on storage.objects;
drop policy if exists "profile_photos_read_auth" on storage.objects;
create policy "profile_photos_read_auth" on storage.objects for select to authenticated
  using (bucket_id = 'profile-photos');

drop policy if exists "profile_photos_own_update" on storage.objects;
create policy "profile_photos_own_update" on storage.objects for update to authenticated
  using (bucket_id = 'profile-photos' and (auth.uid())::text = (storage.foldername(name))[1])
  with check (bucket_id = 'profile-photos' and (auth.uid())::text = (storage.foldername(name))[1]);

drop policy if exists "profile_photos_own_delete" on storage.objects;
create policy "profile_photos_own_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'profile-photos' and (auth.uid())::text = (storage.foldername(name))[1]);

-- 9) Belt and braces: the logged-out (anon) role gets nothing in public; functions are not callable by PUBLIC/anon.
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from public, anon;
grant execute on function public.end_introduction(uuid), public.block_and_conclude(uuid), public.complete_introduction(uuid) to authenticated;
grant select on public.public_profiles to authenticated;
grant execute on function public.safe_age(text) to authenticated;
grant execute on function public.is_admin(), public.is_connection_party(uuid), public.caller_is_verified(), public.caller_gender() to authenticated;
