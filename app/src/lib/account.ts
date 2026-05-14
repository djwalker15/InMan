// Typed wrappers for the account-deletion / restore RPCs and the
// outbound delete-account edge function. Used by:
//   - The post-auth bootstrap (checkRestoreEligibility) to decide
//     whether to surface the "restore your account?" prompt.
//   - The restore prompt itself (restoreAccount).
//   - The Settings → Account Danger Zone (deleteAccount).

import type { SupabaseClient } from '@supabase/supabase-js'

export interface DeletionSummary {
  user_id: string
  crews_transferred: number
  crews_marked_ownerless: number
  crews_soft_deleted: number
  clerk_deletion_pending: boolean
}

export interface RestoreEligibility {
  eligible: boolean
  deleted_at: string | null
}

/**
 * Returns the caller's restore eligibility in a single round-trip.
 * `eligible` is true iff the caller has a soft-deleted user row and
 * the soft-delete is within the 30-day restore window.
 */
export async function checkRestoreEligibility(
  supabase: SupabaseClient,
): Promise<RestoreEligibility> {
  const { data, error } = await supabase.rpc('check_restore_eligibility')
  if (error) throw error
  const row = Array.isArray(data) ? data[0] : data
  if (!row) {
    return { eligible: false, deleted_at: null }
  }
  return {
    eligible: Boolean(row.eligible),
    deleted_at: (row.deleted_at as string | null) ?? null,
  }
}

/**
 * Lifts the soft-delete if the caller is inside the 30-day window.
 * Throws if outside the window or if there's no row to restore.
 * Returns the restored user_id.
 *
 * Note: restoration does NOT un-cascade crew memberships. The user
 * comes back to whatever crew shape exists now — transferred crews
 * stay transferred, ownerless flags persist, solo-deleted crews
 * remain soft-deleted.
 */
export async function restoreAccount(
  supabase: SupabaseClient,
): Promise<string> {
  const { data, error } = await supabase.rpc('restore_account')
  if (error) throw error
  return data as string
}

/**
 * Invokes the delete-account edge function. The session token is
 * forwarded automatically by the Supabase client.
 *
 * `transfer_to_user_id` should be set per crew the caller owns where
 * an Admin transferee was selected. Pass null to let the RPC fall
 * through to ownerless/solo branches.
 */
export async function deleteAccount(
  supabase: SupabaseClient,
  transferToUserId: string | null,
): Promise<DeletionSummary> {
  const { data, error } = await supabase.functions.invoke<DeletionSummary>(
    'delete-account',
    { body: { transfer_to_user_id: transferToUserId } },
  )
  if (error) throw error
  if (!data) throw new Error('delete-account returned no body')
  return data
}
