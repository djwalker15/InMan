import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Chip } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'

type Role = 'owner' | 'admin' | 'member' | 'viewer'

interface MemberRowActionsProps {
  crewMemberId: string
  /** The row's effective role, with the Owner row already mapped to 'owner'. */
  effectiveRole: Role
  /** Whether the viewer is allowed to change this row's role. */
  canChangeRole: boolean
  /** Whether the viewer is allowed to remove this row. */
  canRemove: boolean
  /** Display name for the confirm dialog (e.g., "Member · 2abc99"). */
  displayName: string
  /** Called after a successful mutation so the parent can refetch. */
  onChanged: () => void
}

const ROLE_CHOICES: { value: 'admin' | 'member' | 'viewer'; label: string }[] =
  [
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
    { value: 'viewer', label: 'Viewer' },
  ]

export function MemberRowActions({
  crewMemberId,
  effectiveRole,
  canChangeRole,
  canRemove,
  displayName,
  onChanged,
}: MemberRowActionsProps) {
  const supabase = useSupabase()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The Owner's role is presentational — there's no crew_members row to
  // mutate. Always render the static chip.
  if (effectiveRole === 'owner') {
    return <Chip variant="sage">Owner</Chip>
  }
  if (!canChangeRole && !canRemove) {
    return <Chip variant="default">{capitalize(effectiveRole)}</Chip>
  }

  async function handleRoleChange(next: 'admin' | 'member' | 'viewer') {
    if (busy || next === effectiveRole) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('change_member_role', {
      p_crew_member_id: crewMemberId,
      p_new_role: next,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to change role.')
      return
    }
    onChanged()
  }

  async function handleRemove() {
    if (busy) return
    const ok = window.confirm(
      `Remove ${displayName} from this crew? They'll lose access immediately. You can re-invite them later.`,
    )
    if (!ok) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('remove_crew_member', {
      p_crew_member_id: crewMemberId,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to remove member.')
      return
    }
    onChanged()
  }

  return (
    <div className="flex items-center gap-2">
      {canChangeRole ? (
        <label className="flex items-center">
          <span className="sr-only">Role for {displayName}</span>
          <select
            value={effectiveRole}
            disabled={busy}
            onChange={(e) =>
              void handleRoleChange(
                e.target.value as 'admin' | 'member' | 'viewer',
              )
            }
            className="rounded-full border border-paper-300 bg-paper-100 px-3 py-1.5 font-body text-xs text-ink-700 outline-none transition focus:border-sage-700"
          >
            {ROLE_CHOICES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <Chip variant="default">{capitalize(effectiveRole)}</Chip>
      )}
      {canRemove && (
        <button
          type="button"
          aria-label={`Remove ${displayName}`}
          disabled={busy}
          onClick={() => void handleRemove()}
          className="flex size-9 items-center justify-center rounded-full text-error transition hover:bg-paper-200 disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      )}
      {error && (
        <span
          role="alert"
          className="rounded-md bg-red-50 px-2 py-1 font-body text-xs text-red-700"
        >
          {error}
        </span>
      )}
    </div>
  )
}

function capitalize(s: string): string {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1)
}
