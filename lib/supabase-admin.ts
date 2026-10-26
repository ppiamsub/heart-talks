import "server-only";
import { createClient } from "@supabase/supabase-js";

// Publishable project settings are safe to ship with the application. RLS and
// explicit grants remain the authorization boundary for database access.
const DEFAULT_SUPABASE_URL = "https://zhmkazgbtunlrkilfmjh.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1x2LEYSIAFHi3VKRsJpH0Q_V2UWvi5r";

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const supabasePublishableKey =
    process.env.SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

  return createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
