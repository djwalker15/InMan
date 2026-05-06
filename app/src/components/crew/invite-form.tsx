import { useState, type FormEvent } from 'react'
import { Check, Copy, Mail } from 'lucide-react'
import { Field, PrimaryButton, SecondaryButton } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'

type InviteRole = 'admin' | 'member' | 'viewer'

const ROLE_OPTIONS: { id: InviteRole; label: string; sub: string }[] = [
  { id: 'admin', label: 'Admin', sub: 'Manage members + spaces' },
  { id: 'member', label: 'Member', sub: 'Edit inventory' },
  { id: 'viewer', label: 'Viewer', sub: 'Browse only' },
]

interface InviteFormProps {
  crewId: string
  invitedBy: string
  /** Called once a fresh invite row has been created. Triggers a refetch in the parent. */
  onSent: () => void
  onCancel: () => void
}

export function InviteForm({
  crewId,
  invitedBy,
  onSent,
  onCancel,
}: InviteFormProps) {
  const supabase = useSupabase()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InviteRole>('member')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentLink, setSentLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const trimmed = email.trim()
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault()
    if (!valid || busy) return
    setBusy(true)
    setError(null)
    const code = generateCode()
    const { error: insertError } = await supabase.from('invites').insert({
      crew_id: crewId,
      code,
      email: trimmed,
      role,
      invited_by: invitedBy,
    })
    setBusy(false)
    if (insertError) {
      setError(insertError.message ?? 'Failed to send invite.')
      return
    }
    setSentLink(buildInviteUrl(code))
    onSent()
  }

  async function handleCopy() {
    if (!sentLink) return
    try {
      await navigator.clipboard.writeText(sentLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Some browsers block clipboard writes outside of a user gesture; we
      // surface the link in the input below regardless, so failure here is
      // a soft case — show a hint instead of crashing.
      setError('Could not copy automatically — select the link below.')
    }
  }

  if (sentLink) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-700"
          >
            <Check size={16} />
          </span>
          <div className="flex flex-col">
            <p className="font-display text-base font-bold text-ink-900">
              Invite created
            </p>
            <p className="font-body text-sm text-ink-600">
              Share this link with {trimmed}. Email delivery is not yet wired
              up — copy and send manually.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span
            id="invite-link-label"
            className="px-1 font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500"
          >
            Invite link
          </span>
          <div className="flex gap-2">
            <input
              readOnly
              value={sentLink}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-xl bg-paper-100 px-3 py-2 font-body text-sm text-ink-900 outline-none"
              aria-labelledby="invite-link-label"
            />
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="flex size-10 items-center justify-center rounded-full bg-sage-100 text-sage-700 transition hover:bg-sage-100/80"
              aria-label="Copy invite link"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <SecondaryButton
            type="button"
            onClick={onCancel}
            className="!h-10 !w-auto px-3 !text-sm"
          >
            Done
          </SecondaryButton>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="flex flex-col gap-3 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm"
    >
      <Field
        label="Email"
        type="email"
        placeholder="teammate@example.com"
        value={email}
        onValueChange={setEmail}
        leading={<Mail size={16} aria-hidden />}
        required
      />
      <fieldset className="flex flex-col gap-2">
        <legend className="px-1 font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
          Role
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {ROLE_OPTIONS.map((opt) => {
            const selected = role === opt.id
            return (
              <label
                key={opt.id}
                className={
                  selected
                    ? 'flex cursor-pointer flex-col gap-1 rounded-xl border border-sage-700 bg-sage-100 p-3 text-sage-700'
                    : 'flex cursor-pointer flex-col gap-1 rounded-xl border border-transparent bg-paper-100 p-3 text-ink-700'
                }
              >
                <input
                  type="radio"
                  name="invite-role"
                  value={opt.id}
                  checked={selected}
                  onChange={() => setRole(opt.id)}
                  className="sr-only"
                />
                <span className="font-display text-sm font-bold">
                  {opt.label}
                </span>
                <span className="font-body text-xs">{opt.sub}</span>
              </label>
            )
          })}
        </div>
      </fieldset>
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <SecondaryButton
          type="button"
          onClick={onCancel}
          className="!h-10 !w-auto px-3 !text-sm"
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          type="submit"
          disabled={!valid || busy}
          className="!h-10 !w-auto px-4 !text-sm"
        >
          {busy ? 'Sending…' : 'Send invite'}
        </PrimaryButton>
      </div>
    </form>
  )
}

function generateCode(): string {
  // 32 hex chars (16 random bytes) — matches what the lookup_invite RPC
  // reads on the join side. Strip dashes from randomUUID so the code can
  // travel cleanly in URLs and is a uniform shape.
  const id =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
  return id.replace(/-/g, '')
}

function buildInviteUrl(code: string): string {
  if (typeof window === 'undefined') return `/invite/${code}`
  return `${window.location.origin}/invite/${code}`
}
