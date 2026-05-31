import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { AlertTriangle, Trash2, UserMinus } from 'lucide-react'
import { SecondaryButton, Field } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'
import {
  deleteAccount,
  previewAccountDeletion,
  type PreviewItem,
} from '@/lib/account'

const CONFIRM_PHRASE = 'DELETE'

type Outcome = PreviewItem['outcome']

const OUTCOME_COPY: Record<Outcome, { label: string; tone: 'sage' | 'amber' | 'red' }> = {
  transfer: { label: 'Owner transferred to picked Admin', tone: 'sage' },
  ownerless: {
    label: 'Crew becomes ownerless — remaining members pick a new Owner',
    tone: 'amber',
  },
  solo_delete: { label: 'Crew is deleted along with your account', tone: 'red' },
  leave: { label: 'You leave the crew (members + data stay)', tone: 'sage' },
}

export function AccountDangerZone() {
  const supabase = useSupabase()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const [preview, setPreview] = useState<PreviewItem[] | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [transferee, setTransferee] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const items = await previewAccountDeletion(supabase)
        if (cancelled) return
        setPreview(items)
        // Auto-select the first non-null default_transferee as a starting point.
        const firstDefault = items.find((i) => i.default_transferee !== null)
        if (firstDefault) setTransferee(firstDefault.default_transferee)
      } catch (err) {
        if (cancelled) return
        setPreviewError(err instanceof Error ? err.message : 'Could not load impact preview.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const transferCrews = useMemo(
    () => (preview ?? []).filter((i) => i.outcome === 'transfer'),
    [preview],
  )

  // Intersection of admin candidates across all transferable crews. The
  // picked transferee must be an Admin of every transferable crew or the
  // RPC will raise.
  const transferCandidates = useMemo(() => {
    if (transferCrews.length === 0) return [] as string[]
    const sets = transferCrews.map(
      (c) => new Set((c.admin_candidates ?? []).map((a) => a.user_id)),
    )
    const [first, ...rest] = sets
    if (!first) return []
    return Array.from(first).filter((id) => rest.every((s) => s.has(id))).sort()
  }, [transferCrews])

  const needsTransferee = transferCrews.length > 0
  const hasNoSharedTransferee = needsTransferee && transferCandidates.length === 0
  const transfereeReady = !needsTransferee || (transferee !== null && transferCandidates.includes(transferee))

  const phraseMatches = confirmText.trim() === CONFIRM_PHRASE
  const canSubmit = open && phraseMatches && transfereeReady && !busy && !hasNoSharedTransferee

  async function handleSubmit() {
    if (!canSubmit) return
    setBusy(true)
    setSubmitError(null)
    try {
      await deleteAccount(supabase, needsTransferee ? transferee : null)
      // Soft-delete committed — sign the user out client-side.
      await signOut()
      navigate('/sign-in?account-deleted=1', { replace: true })
    } catch (err) {
      setBusy(false)
      setSubmitError(err instanceof Error ? err.message : 'Account deletion failed.')
    }
  }

  if (previewError) {
    return (
      <DangerCard
        icon={<AlertTriangle size={18} aria-hidden />}
        title="Delete account"
        body="We couldn't load the impact preview. Refresh and try again — without it, we can't show you what'll happen, so the delete action is disabled."
        tone="error"
      >
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {previewError}
        </p>
      </DangerCard>
    )
  }

  if (preview === null) {
    return (
      <DangerCard
        icon={<Trash2 size={18} aria-hidden />}
        title="Delete account"
        body="Loading impact preview…"
      >
        <p className="font-body text-sm text-ink-500">Loading…</p>
      </DangerCard>
    )
  }

  return (
    <DangerCard
      icon={<Trash2 size={18} aria-hidden />}
      title="Delete account"
      tone="error"
      body="Soft-deletes your account with a 30-day restore window. Within 30 days you can sign back in to restore. After 30 days the deletion is permanent."
    >
      <ImpactList preview={preview} />

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={hasNoSharedTransferee}
          aria-disabled={hasNoSharedTransferee}
          className="inline-flex h-10 w-auto items-center justify-center self-start rounded-xl px-3 font-display text-sm font-bold text-error transition hover:bg-paper-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
        >
          Delete my account…
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          {needsTransferee && (
            <TransfereePicker
              candidates={transferCandidates}
              transferCrews={transferCrews}
              value={transferee}
              onChange={setTransferee}
            />
          )}

          <Field
            label={`Type "${CONFIRM_PHRASE}" to confirm`}
            placeholder={CONFIRM_PHRASE}
            value={confirmText}
            onValueChange={setConfirmText}
            autoFocus={!needsTransferee}
          />

          {submitError && (
            <p
              role="alert"
              className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
            >
              {submitError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <SecondaryButton
              type="button"
              onClick={() => {
                setOpen(false)
                setConfirmText('')
                setSubmitError(null)
              }}
              className="!h-10 !w-auto px-3 !text-sm"
            >
              Cancel
            </SecondaryButton>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit}
              className="inline-flex h-10 w-auto items-center justify-center rounded-xl bg-error px-4 font-display text-sm font-bold text-white shadow-cta transition hover:shadow-cta-strong disabled:opacity-50 disabled:shadow-none"
            >
              {busy ? 'Deleting…' : 'Delete account'}
            </button>
          </div>
        </div>
      )}

      {hasNoSharedTransferee && (
        <p
          role="alert"
          className="rounded-md bg-amber-50 px-3 py-2 font-body text-sm text-ink-700"
        >
          You own multiple crews with no shared Admin to transfer all of them
          to. Transfer or delete one of them via its crew settings first, then
          come back here.
        </p>
      )}
    </DangerCard>
  )
}

function ImpactList({ preview }: { preview: PreviewItem[] }) {
  if (preview.length === 0) {
    return (
      <p className="rounded-xl bg-paper-100 p-3 font-body text-sm text-ink-600">
        Your account isn't in any active crews. Deletion will soft-delete just
        the user row.
      </p>
    )
  }
  return (
    <ul className="flex flex-col gap-2">
      {preview.map((item) => (
        <ImpactRow key={item.crew_id} item={item} />
      ))}
    </ul>
  )
}

function ImpactRow({ item }: { item: PreviewItem }) {
  const copy = OUTCOME_COPY[item.outcome]
  const dotClass =
    copy.tone === 'red'
      ? 'bg-error'
      : copy.tone === 'amber'
        ? 'bg-amber-400'
        : 'bg-sage-700'
  return (
    <li className="flex items-start gap-3 rounded-xl bg-paper-100 p-3">
      <span aria-hidden className={`mt-1.5 size-2 shrink-0 rounded-full ${dotClass}`} />
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="font-display text-sm font-bold text-ink-900">{item.crew_name}</p>
        <p className="font-body text-xs text-ink-600">
          {item.caller_role === 'owner' ? 'Owner' : 'Member'} · {copy.label}
        </p>
      </div>
    </li>
  )
}

interface TransfereePickerProps {
  candidates: string[]
  transferCrews: PreviewItem[]
  value: string | null
  onChange: (next: string) => void
}

export function TransfereePicker({
  candidates,
  transferCrews,
  value,
  onChange,
}: TransfereePickerProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="px-1 font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
        New owner for {transferCrews.length === 1 ? 'your crew' : 'your crews'}
      </legend>
      <p className="px-1 font-body text-xs text-ink-500">
        Pick an Admin to receive ownership of:{' '}
        {transferCrews.map((c) => c.crew_name).join(', ')}.
      </p>
      <div className="flex flex-col gap-2">
        {candidates.map((userId) => {
          const checked = value === userId
          return (
            <label
              key={userId}
              className={
                checked
                  ? 'flex cursor-pointer items-center gap-3 rounded-xl border border-sage-700 bg-sage-100 p-3'
                  : 'flex cursor-pointer items-center gap-3 rounded-xl border border-transparent bg-paper-100 p-3'
              }
            >
              <input
                type="radio"
                name="transferee"
                checked={checked}
                onChange={() => onChange(userId)}
                className="sr-only"
              />
              <UserMinus
                size={16}
                aria-hidden
                className="text-ink-500"
              />
              <span className="font-display text-sm font-bold text-ink-900">
                {maskUserId(userId)}
              </span>
              <span className="ml-auto font-body text-xs text-ink-500">Admin</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

function DangerCard({
  icon,
  title,
  body,
  tone = 'neutral',
  children,
}: {
  icon: React.ReactNode
  title: string
  body: string
  tone?: 'neutral' | 'error'
  children: React.ReactNode
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
  return `Member · ${id.slice(-6)}`
}
