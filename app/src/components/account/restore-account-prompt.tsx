import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { PrimaryButton, SecondaryButton } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'
import { restoreAccount } from '@/lib/account'

interface Props {
  /** ISO timestamp from check_restore_eligibility — when the account was soft-deleted. */
  deletedAt: string
  /** Called after the restore RPC succeeds, before any navigation. */
  onRestored: () => void
  /** Called when the user chooses "Not now". */
  onDismissed: () => void
}

export function RestoreAccountPrompt({ deletedAt, onRestored, onDismissed }: Props) {
  const supabase = useSupabase()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletedDate = new Date(deletedAt)
  const deadline = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000)

  async function handleRestore() {
    setBusy(true)
    setError(null)
    try {
      await restoreAccount(supabase)
      onRestored()
    } catch (err) {
      setBusy(false)
      setError(err instanceof Error ? err.message : 'Could not restore your account.')
    }
  }

  async function handleSignOut() {
    onDismissed()
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="restore-prompt-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-4 sm:items-center"
    >
      <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-paper-50 p-6 shadow-ambient-lg">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700"
          >
            <RotateCcw size={20} />
          </span>
          <div className="flex flex-col gap-1">
            <h2
              id="restore-prompt-title"
              className="font-display text-lg font-bold text-ink-900"
            >
              Welcome back
            </h2>
            <p className="font-body text-sm text-ink-600">
              You deleted this account on {formatDate(deletedDate)}. You can
              restore it until {formatDate(deadline)}.
            </p>
          </div>
        </div>

        <p className="rounded-xl bg-paper-100 p-3 font-body text-xs text-ink-600">
          Restoring brings your account back. Crews that were transferred, marked
          ownerless, or deleted while your account was soft-deleted stay as they
          are — restoration doesn't un-cascade them.
        </p>

        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <SecondaryButton
            type="button"
            onClick={() => void handleSignOut()}
            className="!h-11 !w-full px-4 !text-sm sm:!w-auto"
          >
            Sign out
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={() => void handleRestore()}
            disabled={busy}
            className="!h-11 !w-full px-4 !text-sm sm:!w-auto"
          >
            {busy ? 'Restoring…' : 'Restore my account'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
