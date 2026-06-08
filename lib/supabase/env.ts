// Vercel/dotenv env values can pick up a stray UTF-8 BOM (U+FEFF), which the
// Headers API rejects with "String contains non ISO-8859-1 code point" when
// building Supabase requests — silently breaking every query. Trim it away.
export function supabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
}

export function supabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();
}

export function supabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
}
