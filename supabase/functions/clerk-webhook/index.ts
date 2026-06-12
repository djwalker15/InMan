// clerk-webhook
//
// Inbound reconciliation. Called by Clerk's servers when a user is
// deleted directly via the Clerk dashboard (i.e., not via our own
// outbound delete-account flow). Svix-signed; CLERK_WEBHOOK_SECRET
// is set via `supabase secrets set`.
//
// On user.deleted:
//   - Look up the user in our DB.
//   - If they don't exist here yet, return 200 (nothing to do).
//   - If they're already soft-deleted, return 200 (idempotent; likely
//     our own outbound call already ran).
//   - Otherwise, call request_account_deletion(null, p_target_user_id)
//     via the service-role client. The RPC's "target user without JWT
//     context" branch handles the admin-initiated path.
//
// Only user.deleted is wired today. Other event types return 200
// silently so Clerk doesn't retry.
//
// Configure in Clerk Dashboard → Webhooks: subscribe to user.deleted,
// point at this function's public URL.

import { Webhook } from 'npm:svix@1'
import { createAdminClient } from '../_shared/supabase-admin.ts'

const webhookSecret = Deno.env.get('CLERK_WEBHOOK_SECRET')
if (!webhookSecret) {
  throw new Error(
    'CLERK_WEBHOOK_SECRET is not set in the edge-function environment.',
  )
}

interface ClerkUserDeletedEvent {
  type: 'user.deleted'
  data: { id: string; deleted?: boolean }
}

interface ClerkEnvelope {
  type: string
  data: { id?: string; [k: string]: unknown }
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const payload = await req.text()
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  }

  let evt: ClerkEnvelope
  try {
    const wh = new Webhook(webhookSecret!)
    evt = wh.verify(payload, svixHeaders) as ClerkEnvelope
  } catch (err) {
    console.warn('Webhook signature verification failed:', err)
    return new Response('Invalid signature', { status: 401 })
  }

  // We only care about user.deleted today. Anything else: 200 silently.
  if (evt.type !== 'user.deleted') {
    return new Response('Event ignored', { status: 200 })
  }

  const userEvt = evt as unknown as ClerkUserDeletedEvent
  const clerkUserId = userEvt.data?.id
  if (!clerkUserId) {
    return new Response('Missing user id in payload', { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: existing, error: lookupErr } = await supabase
    .from('users')
    .select('user_id, deleted_at')
    .eq('user_id', clerkUserId)
    .maybeSingle()

  if (lookupErr) {
    console.error('users lookup failed for', clerkUserId, lookupErr)
    return new Response(lookupErr.message, { status: 500 })
  }

  if (!existing) {
    return new Response('User not in InMan', { status: 200 })
  }
  if (existing.deleted_at) {
    return new Response('Already deleted', { status: 200 })
  }

  const { error: rpcErr } = await supabase.rpc('request_account_deletion', {
    p_transfer_to_user_id: null,
    p_target_user_id: clerkUserId,
  })

  if (rpcErr) {
    console.error('request_account_deletion failed for', clerkUserId, rpcErr)
    return new Response(rpcErr.message, { status: 500 })
  }

  return new Response('ok', { status: 200 })
})
