import { useMemo, useState } from 'react'
import { useSupabase } from '@/lib/supabase'
import { PrimaryButton, SecondaryButton } from '@/components/ds'
import { PERMISSION_FEATURES, type OverrideValue } from './permissions'

interface PermissionsGridProps {
  crewMemberId: string
  /** The member's role — drives the per-feature defaults. The Owner
   *  is filtered out before reaching this component. */
  memberRole: 'admin' | 'member' | 'viewer'
  /** Current overrides (the row's permission_overrides JSON). */
  initialOverrides: Record<string, OverrideValue>
  /** Friendly label for confirm copy / aria. */
  memberDisplayName: string
  /** Called after a successful save so the parent can refetch. */
  onSaved: () => void
}

export function PermissionsGrid({
  crewMemberId,
  memberRole,
  initialOverrides,
  memberDisplayName,
  onSaved,
}: PermissionsGridProps) {
  const supabase = useSupabase()
  // The parent gives this component a fresh `key` whenever the selected
  // member changes, so useState's lazy initializer fires per-member and
  // we never need an effect-driven reset. The draft starts seeded from
  // the row's saved overrides.
  const [draft, setDraft] = useState<Record<string, OverrideValue>>(
    () => ({ ...initialOverrides }),
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = useMemo(
    () => !shallowEqual(draft, initialOverrides),
    [draft, initialOverrides],
  )

  function setOverride(featureId: string, next: OverrideValue | null) {
    setDraft((prev) => {
      const copy = { ...prev }
      if (next === null) delete copy[featureId]
      else copy[featureId] = next
      return copy
    })
  }

  async function handleSave() {
    if (saving || !dirty) return
    setSaving(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('set_member_permissions', {
      p_crew_member_id: crewMemberId,
      p_overrides: draft,
    })
    setSaving(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to save permissions.')
      return
    }
    onSaved()
  }

  function handleReset() {
    setDraft({ ...initialOverrides })
    setError(null)
  }

  return (
    <div
      aria-label={`Permissions for ${memberDisplayName}`}
      className="flex flex-col gap-3"
    >
      <ul className="flex flex-col gap-2">
        {PERMISSION_FEATURES.map((feature) => {
          const roleDefault = feature.defaultByRole[memberRole]
          const override = draft[feature.id]
          const effective: OverrideValue = override ?? roleDefault
          return (
            <li
              key={feature.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm"
            >
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <span className="font-display text-base font-bold text-ink-900">
                  {feature.label}
                </span>
                <span className="font-body text-xs text-ink-500">
                  {override
                    ? `Overridden — role default is ${roleDefault}`
                    : `Default — ${roleDefault}`}
                </span>
              </div>
              <fieldset
                aria-label={`${feature.label} access`}
                className="flex gap-1 rounded-full bg-paper-100 p-1"
              >
                {(
                  [
                    { id: null, label: 'Default' },
                    { id: 'allow' as OverrideValue, label: 'Allow' },
                    { id: 'deny' as OverrideValue, label: 'Deny' },
                  ] as const
                ).map((opt) => {
                  const selected =
                    (opt.id === null && override === undefined) ||
                    opt.id === override
                  return (
                    <label
                      key={opt.label}
                      className={
                        selected
                          ? 'flex cursor-pointer items-center justify-center rounded-full bg-white px-3 py-1 font-display text-xs font-bold text-sage-700 shadow-ambient-sm'
                          : 'flex cursor-pointer items-center justify-center rounded-full px-3 py-1 font-display text-xs font-bold text-ink-600 hover:text-ink-900'
                      }
                    >
                      <input
                        type="radio"
                        name={`override-${feature.id}`}
                        checked={selected}
                        onChange={() => setOverride(feature.id, opt.id)}
                        className="sr-only"
                      />
                      {opt.label}
                    </label>
                  )
                })}
              </fieldset>
              <span className="sr-only">
                Currently {effective} for {memberDisplayName}
              </span>
            </li>
          )
        })}
      </ul>
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
          onClick={handleReset}
          disabled={saving || !dirty}
          className="!h-10 !w-auto px-3 !text-sm"
        >
          Reset
        </SecondaryButton>
        <PrimaryButton
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !dirty}
          className="!h-10 !w-auto px-4 !text-sm"
        >
          {saving ? 'Saving…' : 'Save permissions'}
        </PrimaryButton>
      </div>
    </div>
  )
}

function shallowEqual(
  a: Record<string, OverrideValue>,
  b: Record<string, OverrideValue>,
): boolean {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (aKeys.length !== bKeys.length) return false
  for (const k of aKeys) if (a[k] !== b[k]) return false
  return true
}
