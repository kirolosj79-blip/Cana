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
