import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRightLeft, LogOut, Trash2 } from 'lucide-react'
import { useSupabase } from '@/lib/supabase'
import {
  Field,
  PrimaryButton,
  SecondaryButton,
  TextButton,
} from '@/components/ds'

interface MemberRow {
  crew_member_id: string
  user_id: string
  role: string
}

interface DangerZoneTabProps {
  crewId: string
  crewName: string
  ownerId: string
  userRole: 'owner' | 'admin' | 'member' | 'viewer'
  /**
   * crews.deletion_requested_at — when set, the crew is in the 48-hour
   * cooling-off window and we render the countdown instead of the
   * delete request form.
   */
  deletionRequestedAt: string | null
  /** Active members of the crew, used to populate the transfer-target list. */
  members: MemberRow[]
  /** Refetch hook so the countdown / delete state surfaces after a mutation. */
  onChanged: () => void
}

export function DangerZoneTab({
  crewId,
  crewName,
  ownerId,
  userRole,
  deletionRequestedAt,
  members,
  onChanged,
}: DangerZoneTabProps) {
  const isOwner = userRole === 'owner'
  // Anyone except the Owner can leave. The Owner has to transfer first.
  const canLeave = !isOwner

  return (
    <section
      role="tabpanel"
      aria-label="Danger zone"
      className="flex flex-col gap-4"
    >
      {isOwner && deletionRequestedAt && (
        <DeletionCountdown
          crewId={crewId}
          deletionRequestedAt={deletionRequestedAt}
          onCancelled={onChanged}
        />
      )}

      {isOwner && !deletionRequestedAt && (
        <TransferOwnershipSection
          crewId={crewId}
          crewName={crewName}
          ownerId={ownerId}
          members={members}
          onTransferred={onChanged}
        />
      )}

      {canLeave && <LeaveCrewSection crewId={crewId} crewName={crewName} />}

      {isOwner && !deletionRequestedAt && (
        <DeleteCrewSection
          crewId={crewId}
          crewName={crewName}
          onRequested={onChanged}
        />
      )}

      {!isOwner && userRole !== 'admin' && (
        <p className="rounded-2xl bg-paper-100 p-5 font-body text-sm text-ink-600">
          Only the Owner can transfer ownership or delete this crew. You can
          leave the crew above.
        </p>
      )}

      {!isOwner && userRole === 'admin' && (
        <p className="rounded-2xl bg-paper-100 p-5 font-body text-sm text-ink-600">
          Transferring ownership and deleting the crew are Owner-only
          actions. You can leave the crew above.
        </p>
      )}
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Transfer ownership
 * ───────────────────────────────────────────────────────────────── */

function TransferOwnershipSection({
  crewId,
  crewName,
  ownerId,
  members,
  onTransferred,
}: {
  crewId: string
  crewName: string
  ownerId: string
  members: MemberRow[]
  onTransferred: () => void
}) {
  const supabase = useSupabase()
  const [open, setOpen] = useState(false)
  const [pickedUserId, setPickedUserId] = useState<string | null>(null)
  const [confirmName, setConfirmName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only Admins (other than the current Owner) qualify as transfer targets.
  const candidates = members.filter(
    (m) => m.role === 'admin' && m.user_id !== ownerId,
  )

  const nameMatches = confirmName.trim() === crewName
  const valid = pickedUserId !== null && nameMatches && !busy

  async function handleSubmit() {
    if (!valid || pickedUserId === null) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc(
      'transfer_crew_ownership',
      { p_crew_id: crewId, p_new_owner_user_id: pickedUserId },
    )
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to transfer ownership.')
      return
    }
    setOpen(false)
    setPickedUserId(null)
    setConfirmName('')
    onTransferred()
  }

  return (
    <DangerCard
      icon={<ArrowRightLeft size={18} aria-hidden />}
      title="Transfer ownership"
      body={
        candidates.length === 0
          ? "Promote a member to Admin first — only Admins can become Owner."
          : "Hand the crew over to another Admin. You'll keep your Admin role; the new Owner gains delete + ownership-transfer rights."
      }
    >
      {!open ? (
        <SecondaryButton
          type="button"
          onClick={() => setOpen(true)}
          disabled={candidates.length === 0}
          className="!h-10 !w-auto self-start px-3 !text-sm"
        >
          Start transfer
        </SecondaryButton>
      ) : (
        <div className="flex flex-col gap-3">
          <fieldset className="flex flex-col gap-2">
            <legend className="px-1 font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
              New owner
            </legend>
            <div className="flex flex-col gap-2">
              {candidates.map((c) => {
                const checked = pickedUserId === c.user_id
                return (
                  <label
                    key={c.crew_member_id}
                    className={
                      checked
                        ? 'flex cursor-pointer items-center gap-3 rounded-xl border border-sage-700 bg-sage-100 p-3'
                        : 'flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-paper-100 p-3'
                    }
                  >
                    <input
                      type="radio"
                      name="transfer-target"
                      checked={checked}
                      onChange={() => setPickedUserId(c.user_id)}
                      className="sr-only"
                    />
                    <span className="font-display text-sm font-bold text-ink-900">
                      {maskUserId(c.user_id)}
                    </span>
                    <span className="ml-auto font-body text-xs text-ink-500">
                      Admin
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <Field
            label={`Type "${crewName}" to confirm`}
            placeholder={crewName}
            value={confirmName}
            onValueChange={setConfirmName}
          />
          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <SecondaryButton
              type="button"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
              className="!h-10 !w-auto px-3 !text-sm"
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!valid}
              className="!h-10 !w-auto px-4 !text-sm"
            >
              {busy ? 'Transferring…' : 'Confirm transfer'}
            </PrimaryButton>
          </div>
        </div>
      )}
    </DangerCard>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Leave crew
 * ───────────────────────────────────────────────────────────────── */

function LeaveCrewSection({
  crewId,
  crewName,
}: {
  crewId: string
  crewName: string
}) {
  const supabase = useSupabase()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLeave() {
    if (busy) return
    const ok = window.confirm(
      `Leave "${crewName}"? You'll lose access immediately. You can rejoin if invited again.`,
    )
    if (!ok) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('leave_crew', {
      p_crew_id: crewId,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to leave crew.')
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <DangerCard
      icon={<LogOut size={18} aria-hidden />}
      title="Leave crew"
      body="You'll lose access to this crew's inventory, spaces, and history. Your past actions stay attributed."
    >
      <div className="flex flex-col gap-2">
        <SecondaryButton
          type="button"
          onClick={() => void handleLeave()}
          disabled={busy}
          className="!h-10 !w-auto self-start px-3 !text-sm"
        >
          {busy ? 'Leaving…' : 'Leave crew'}
        </SecondaryButton>
        {error && (
          <p
            role="alert"
            className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>
    </DangerCard>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Delete crew (request)
 * ───────────────────────────────────────────────────────────────── */

function DeleteCrewSection({
  crewId,
  crewName,
  onRequested,
}: {
  crewId: string
  crewName: string
  onRequested: () => void
}) {
  const supabase = useSupabase()
  const [open, setOpen] = useState(false)
  const [confirmName, setConfirmName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = confirmName.trim() === crewName && !busy

  async function handleSubmit() {
    if (!valid) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('request_crew_deletion', {
      p_crew_id: crewId,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to request deletion.')
      return
    }
    setOpen(false)
    setConfirmName('')
    onRequested()
  }

  return (
    <DangerCard
      icon={<Trash2 size={18} aria-hidden />}
      title="Delete crew"
      tone="error"
      body="Schedules deletion of this crew with a 48-hour cooling-off window. All members are notified. You can cancel any time before the deadline."
    >
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-auto items-center justify-center self-start rounded-xl px-3 font-display text-sm font-bold text-error transition hover:bg-paper-200"
        >
          Schedule deletion…
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <Field
            label={`Type "${crewName}" to confirm`}
            placeholder={crewName}
            value={confirmName}
            onValueChange={setConfirmName}
          />
          {error && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
            >
              {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <SecondaryButton
              type="button"
              onClick={() => {
                setOpen(false)
                setError(null)
              }}
              className="!h-10 !w-auto px-3 !text-sm"
            >
              Cancel
            </SecondaryButton>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!valid}
              className="inline-flex h-10 w-auto items-center justify-center rounded-xl bg-error px-4 font-display text-sm font-bold text-white shadow-cta transition hover:shadow-cta-strong disabled:opacity-50 disabled:shadow-none"
            >
              {busy ? 'Scheduling…' : 'Schedule deletion'}
            </button>
          </div>
        </div>
      )}
    </DangerCard>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Deletion countdown (after request)
 * ───────────────────────────────────────────────────────────────── */

const COOLOFF_MS = 48 * 60 * 60 * 1000

function DeletionCountdown({
  crewId,
  deletionRequestedAt,
  onCancelled,
}: {
  crewId: string
  deletionRequestedAt: string
  onCancelled: () => void
}) {
  const supabase = useSupabase()
  const deletionAt = new Date(deletionRequestedAt).getTime() + COOLOFF_MS
  const [now, setNow] = useState(() => Date.now())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Tick once per second so the countdown stays alive while the user
  // looks at the tab.
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const remaining = Math.max(0, deletionAt - now)
  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1_000)

  async function handleCancel() {
    if (busy) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('cancel_crew_deletion', {
      p_crew_id: crewId,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to cancel deletion.')
      return
    }
    onCancelled()
  }

  return (
    <div
      aria-label="Deletion countdown"
      className="flex flex-col gap-3 rounded-2xl border border-error/30 bg-error/5 p-5"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-error/15 text-error"
        >
          <AlertTriangle size={18} />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-base font-bold text-error">
            Crew deletion in progress
          </p>
          <p className="font-body text-sm text-ink-700">
            Scheduled for {formatDateTime(new Date(deletionAt))}. All members
            were notified. Cancel any time before the deadline.
          </p>
        </div>
      </div>
      <div className="flex gap-2" aria-live="polite">
        <CountdownBlock label="hours" value={String(hours).padStart(2, '0')} />
        <CountdownBlock
          label="minutes"
          value={String(minutes).padStart(2, '0')}
        />
        <CountdownBlock
          label="seconds"
          value={String(seconds).padStart(2, '0')}
        />
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <TextButton type="button" onClick={() => void handleCancel()}>
          {busy ? 'Cancelling…' : 'Cancel deletion'}
        </TextButton>
      </div>
    </div>
  )
}

function CountdownBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-xl bg-white p-3">
      <span className="font-display text-2xl font-bold tabular-nums text-ink-900">
        {value}
      </span>
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
        {label}
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Shared danger card
 * ───────────────────────────────────────────────────────────────── */

function DangerCard({
  icon,
  title,
  body,
  tone = 'neutral',
  children,
}: {
  icon: ReactNode
  title: string
  body: string
  tone?: 'neutral' | 'error'
  children: ReactNode
}) {
  const titleClass =
    tone === 'error'
      ? 'font-display text-base font-bold text-error'
      : 'font-display text-base font-bold text-ink-900'
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-paper-50 p-5 shadow-ambient-sm">
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-200 text-ink-700"
        >
          {icon}
        </span>
        <div className="flex flex-col gap-1">
          <p className={titleClass}>{title}</p>
          <p className="font-body text-sm text-ink-600">{body}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function maskUserId(id: string): string {
  // Same masking as the Members tab — surface the readable Clerk-id tail
  // until full Clerk-name resolution lands.
  return `Member · ${id.slice(-6)}`
}

function formatDateTime(d: Date): string {
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
