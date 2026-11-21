-- Run ONCE in Supabase -> SQL Editor (after schema.sql) to allow sign-up WITHOUT phone OTP.
-- Also enable: Authentication -> Sign In / Providers -> "Allow anonymous sign-ins".

-- 1) A profile can exist before the phone number is saved (the app writes it right after).
alter table public.profiles alter column phone drop not null;

-- 2) Auto-create the profile row for every new auth user (phone may be null/empty now).
create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, nullif(new.phone, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;
