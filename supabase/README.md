# Supabase Setup — Cana

## 1) Run the schema
1. Open your Supabase project → **SQL Editor** → **New query**
2. Paste the entire contents of `schema.sql` (in this folder) and click **Run**
3. This creates every table, the uniqueness rules (no duplicate phone/email — enforced by the database itself, not just app code), Row Level Security policies, and the three storage buckets (verification documents, payment proofs, profile photos)

## 1b) Run the journey tables (after schema.sql)
Same place: **SQL Editor** → **New query** → paste the entire contents of `journey.sql` → **Run**.
It adds: chat messages (realtime), introduction progress, contact exchange (simultaneous reveal), reports, blocks, feedback, welcome-back tracking, and three atomic actions (`end_introduction`, `block_and_conclude`, `complete_introduction`).
It also fixes a privacy issue in the first schema: signed-in members could read every column of every profile. After `journey.sql`, members only see safe fields through the `public_profiles` view.
Both files are safe to re-run.

## 2) Enable phone authentication (real OTP)
1. **Authentication** → **Sign In / Providers** → enable **Phone**
2. Pick an SMS/WhatsApp provider (Twilio is the most common) and enter its credentials — this is what actually sends the OTP code to a real phone
3. Without this step, phone sign-in won't send real codes

## 3) Get your API keys
**Settings** → **API**:
- **Project URL** → put in `.env.local` as `VITE_SUPABASE_URL`
- **anon / public key** → put in `.env.local` as `VITE_SUPABASE_ANON_KEY`

Copy `.env.example` (in the project root) to `.env.local` and fill these two in. Both are safe to expose in the frontend by design — Row Level Security (already set up by the schema) is what actually protects the data, not hiding these values.

**Never** put the `service_role` key in `.env.local` or anywhere in the frontend code — it bypasses Row Level Security entirely. It's only needed later for admin-only server-side actions (like approving a payment on someone else's behalf), and belongs in Vercel's own environment variable settings, not a file in this repo.

## 4) Make yourself an admin (after signing up once through the app)
Run in the SQL Editor:
```sql
update public.profiles set role = 'admin' where phone = '+201xxxxxxxxx';
```

## What is wired to Supabase so far (phase 1)
Only active when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set; otherwise the app keeps running on its local mock flow.
- **Login / OTP:** real phone OTP (`signInWithOtp` / `verifyOtp`). Test numbers from the dashboard work here too.
- **Session:** `RequireAuth` signs the member out locally if the Supabase session is gone.
- **Registration:** on the last step the full draft is saved to the member's `profiles` row and `is_onboarded` is set. A duplicate email is rejected by the database and shown as an error. Duplicate phone can't happen: the same number is the same account.
- Photos/documents are NOT uploaded yet (local blob URLs are skipped when saving) — Storage upload is next.

## Not wired yet
Payment requests, connection requests, chat, notifications, complaints, matching (needs the `public_profiles` view), admin review. These still use localStorage.

## Sign-up without OTP (testing mode)
The app no longer asks for an OTP code. To use Supabase like this:
1. Run `supabase/no_otp.sql` once in the SQL Editor.
2. Authentication -> Sign In / Providers -> turn ON **Allow anonymous sign-ins** (the Phone provider is no longer needed).
Each browser gets an anonymous session; the typed phone number is saved onto that profile row.
Note: without OTP, a phone number is not proven, and logging in again from another device creates a new profile.


## Security hardening (REQUIRED before any real test)
Run the SQL files in this order in the SQL Editor: `schema.sql` -> `journey.sql` -> `no_otp.sql` -> **`security_hardening.sql`**.
`security_hardening.sql` fixes (each one was tested on a real Postgres 16 with simulated Supabase roles):
- a member could set `role='admin'` / `is_paid_member=true` on their own profile (now blocked by a trigger)
- any logged-in (even anonymous) user could read every profile incl. phone/email/health (now: own row or admin only)
- discovery view `public_profiles`: only verified + paid members, opposite gender only, age + last initial only, blocks respected
- forged "approved" payment requests, spoofed notifications, self-accepted connection requests, un-pausing/clearing feedback flags
- `is_admin()` recursion risk, unpinned `search_path` on SECURITY DEFINER functions
- storage: buckets private, 5MB/3MB limits, image/PDF only, admin can read verification docs + payment proofs
- `anon` (logged-out) role has no table or function access

### Dashboard settings to turn on (cannot be done from SQL)
1. Authentication -> Sign In / Providers -> **Anonymous sign-ins: ON**
2. Authentication -> Attack Protection -> **Enable CAPTCHA (Cloudflare Turnstile / hCaptcha)** - otherwise bots can create unlimited anonymous accounts
3. Authentication -> Rate Limits: lower "Anonymous users" and "Sign-ups and sign-ins" to a small number per hour per IP
4. Authentication -> URL Configuration: set Site URL to your Vercel domain only (remove `localhost` before launch)
5. Settings -> API: never put the `service_role` key in the frontend or in `VITE_*` variables
6. To make an admin: `update public.profiles set role = 'admin' where id = '<auth user id>';` (run in the SQL Editor; the app can no longer do this itself)

### Known limits of the current build (be aware while testing)
- Right now only the **registration form** is saved to Supabase. Matching, requests, chat, payments and the approval journey still run on local mock data in the browser, so they are not protected by the database rules yet.
- Without OTP the phone number is not proven: anyone can type any number. Add OTP back before launch.
