import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when both env vars are set. The app still runs fully on localStorage when false. */
export const supabaseEnabled = Boolean(url && anonKey)

/** Browser client — only ever uses the public anon key (Row Level Security protects the data). */
export const supabase: SupabaseClient | null = supabaseEnabled ? createClient(url!, anonKey!) : null
