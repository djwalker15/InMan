// delete-account
//
// Outbound deletion flow. Called by the Settings → Account UI after
// the user reauths and confirms. Wraps the Supabase RPC
// request_account_deletion() and the Clerk admin-API delete-user call
// in a single round-trip from the client.
//
// Sequence:
//   1. Validate the user's Clerk JWT (the user-context Supabase client
//      forwards Authorization: Bearer <jwt>; request_account_deletion
//      reads auth.jwt()->>'sub' to identify the caller).
//   2. Invoke request_account_deletion(transfer_to_user_id) — the RPC
//      handles all crew branches atomically.
//   3. Call Clerk users.deleteUser(userId) to purge PII server-side.
//   4. If the Clerk call fails after the Supabase soft-delete succeeded,
//      we log and return success with `clerk_deletion_pending: true`.
//      The clerk-webhook handler is idempotent and will reconcile if
//      a retry succeeds; otherwise support can manually delete the
//      Clerk user. Rolling back the soft-delete here is worse than the
//      brief divergence — the user already saw the goodbye screen.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { clerk } from '../_shared/clerk.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

interface RequestBody {
  transfer_to_user_id?: string | null
}

interface DeletionSummary {
  user_id: string
  crews_transferred: number
  crews_marked_ownerless: number
  crews_soft_deleted: number
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonResponse({ error: 'Missing or malformed Authorization header' }, 401)
  }

  // User-context Supabase client — forwards the Clerk JWT so the RPC
  // can read auth.jwt()->>'sub'.
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let body: RequestBody = {}
  try {
    if (req.headers.get('content-type')?.includes('application/json')) {
      body = (await req.json()) as RequestBody
    }
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const { data, error } = await supabase.rpc('request_account_deletion', {
    p_transfer_to_user_id: body.transfer_to_user_id ?? null,
  })

  if (error) {
    const status = error.code === 'P0002' || error.code === '22023' ? 400 : 500
    return jsonResponse({ error: error.message, code: error.code }, status)
  }

  const summary = Array.isArray(data) ? (data[0] as DeletionSummary | undefined) : undefined
  if (!summary) {
    return jsonResponse({ error: 'request_account_deletion returned no summary row' }, 500)
  }

  // Clerk deletion. Failures here do NOT roll back the Supabase soft-delete.
  let clerkDeletionPending = false
  try {
    await clerk.users.deleteUser(summary.user_id)
  } catch (clerkErr) {
    clerkDeletionPending = true
    console.error('Clerk deleteUser failed for', summary.user_id, clerkErr)
  }

  return jsonResponse({ ...summary, clerk_deletion_pending: clerkDeletionPending }, 200)
})

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  })
}
