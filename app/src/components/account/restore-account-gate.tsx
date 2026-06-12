import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useSupabase } from '@/lib/supabase'
import { checkRestoreEligibility, type RestoreEligibility } from '@/lib/account'
import { RestoreAccountPrompt } from './restore-account-prompt'

/**
 * Fires `check_restore_eligibility()` once per authenticated session and
 * renders the restore prompt if the caller has a soft-deleted user row
 * still inside the 30-day window. Mount this near the root so it covers
 * every route the signed-in user can land on (Onboarding included).
 *
 * No-op when:
 *   - Clerk is still loading
 *   - User is signed out
 *   - check_restore_eligibility() returns eligible = false
 *   - The user dismissed the prompt this session (Sign out resets it)
 */
export function RestoreAccountGate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const supabase = useSupabase()
  const [eligibility, setEligibility] = useState<RestoreEligibility | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || dismissed) return
    let cancelled = false
    void (async () => {
      try {
        const result = await checkRestoreEligibility(supabase)
        if (cancelled) return
        if (result.eligible) setEligibility(result)
      } catch (err) {
        // Silent — the gate is best-effort. If the check fails, we
        // simply don't surface the prompt and the user proceeds
        // through the normal sign-in flow.
        console.warn('checkRestoreEligibility failed', err)
      }
    })()
    return () => {
      cancelled = true
    }
    // user?.id is the stable identity key; supabase is per-render so we
    // depend on isSignedIn instead to avoid a re-fire on every render.
  }, [isLoaded, isSignedIn, user, dismissed, supabase])

  if (!eligibility?.eligible || !eligibility.deleted_at) return null
  return (
    <RestoreAccountPrompt
      deletedAt={eligibility.deleted_at}
      onRestored={() => {
        // Hard refresh so every consumer (active-crew, sidenav, etc.)
        // re-fetches against the restored user row.
        window.location.reload()
      }}
      onDismissed={() => setDismissed(true)}
    />
  )
}
