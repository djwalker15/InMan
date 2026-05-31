// delete-account
//
// Outbound deletion flow. Called by the Settings → Account UI after
// the user confirms (type-DELETE-to-confirm). Wraps the Supabase
// soft-delete RPC and signs the user out client-side after success.
//
// Sequence:
//   1. Validate the user's Clerk JWT (the user-context Supabase client
//      forwards Authorization: Bearer <jwt>; request_account_deletion
//      reads auth.jwt()->>'sub' to identify the caller).
//   2. Invoke request_account_deletion(transfer_to_user_id) — the RPC
//      handles all crew branches atomically.
//   3. Return the deletion summary. The UI then signs the user out.
//
// We intentionally do NOT call Clerk users.deleteUser here. The
// 30-day restore-within-cool-down decision requires the Clerk
// identity to remain valid during the window so the user can sign
// back in and trigger restoreAccount(). Clerk hard-delete is the
// concern of a future ticket — likely tied into process_due_user_deletions()
// at the 30-day mark, or a separate admin/dashboard flow.
//
// The clerk-webhook handler covers the reverse direction (admin
// deletes via the Clerk dashboard); in that scenario Clerk is gone
// and restore is naturally unavailable.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

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

  return jsonResponse(summary, 200)
})

function jsonResponse(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  })
}
