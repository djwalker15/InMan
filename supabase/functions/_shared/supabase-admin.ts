// Service-role Supabase client. Bypasses RLS — used only for the
// inbound Clerk webhook path where we don't have a user JWT to
// forward. The user-context client (built per-request from the
// caller's Authorization header) lives in each function's index.ts.

import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the edge-function environment.',
  )
}

export function createAdminClient(): SupabaseClient {
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
