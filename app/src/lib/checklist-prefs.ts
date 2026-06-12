import { useMemo, useSyncExternalStore } from 'react'

/**
 * Onboarding-checklist dismissal preferences.
 *
 * The dashboard checklist is derived data (no DB table), so its dismissal
 * state lives client-side: per user + crew in localStorage, mirroring the
 * active-crew preference plumbing. `dismissed` hides the whole block;
 * `cleared` holds the step keys the user removed individually.
 */

const STORAGE_PREFIX = 'inman:onboarding-checklist:'
/**
 * Same-tab change signal. The native `storage` event only fires in *other*
 * tabs, never the one that wrote — the custom event keeps every hook
 * instance in the writing tab in sync.
 */
const CHANGE_EVENT = 'inman:onboarding-checklist-change'

export interface ChecklistPrefs {
  dismissed: boolean
  cleared: string[]
}

const DEFAULT_PREFS: ChecklistPrefs = { dismissed: false, cleared: [] }

function storageKey(userId: string, crewId: string): string {
  return `${STORAGE_PREFIX}${userId}:${crewId}`
}

function parsePrefs(raw: string | null): ChecklistPrefs {
  if (!raw) return DEFAULT_PREFS
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULT_PREFS
    const candidate = parsed as Partial<ChecklistPrefs>
    return {
      dismissed: candidate.dismissed === true,
      cleared: Array.isArray(candidate.cleared)
        ? candidate.cleared.filter((k): k is string => typeof k === 'string')
        : [],
    }
  } catch {
    return DEFAULT_PREFS
  }
}

export function readChecklistPrefs(
  userId: string,
  crewId: string,
): ChecklistPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  return parsePrefs(window.localStorage.getItem(storageKey(userId, crewId)))
}

export function writeChecklistPrefs(
  userId: string,
  crewId: string,
  prefs: ChecklistPrefs,
): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey(userId, crewId), JSON.stringify(prefs))
  // Notify same-tab subscribers so every hook instance re-reads.
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function subscribePrefs(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export interface ChecklistPrefsState {
  prefs: ChecklistPrefs
  /** Hide the whole checklist block. */
  dismissAll: () => void
  /** Remove a single completed step from the list (idempotent). */
  clearStep: (key: string) => void
}

export function useChecklistPrefs(
  userId: string | null,
  crewId: string | null,
): ChecklistPrefsState {
  // Snapshot the raw string — it has stable identity between writes, which
  // useSyncExternalStore requires. Parsing happens in the memo below.
  const raw = useSyncExternalStore(
    subscribePrefs,
    () =>
      userId && crewId && typeof window !== 'undefined'
        ? window.localStorage.getItem(storageKey(userId, crewId))
        : null,
    () => null,
  )
  const prefs = useMemo(() => parsePrefs(raw), [raw])

  function dismissAll() {
    if (!userId || !crewId) return
    writeChecklistPrefs(userId, crewId, { ...prefs, dismissed: true })
  }

  function clearStep(key: string) {
    if (!userId || !crewId) return
    if (prefs.cleared.includes(key)) return
    writeChecklistPrefs(userId, crewId, {
      ...prefs,
      cleared: [...prefs.cleared, key],
    })
  }

  return { prefs, dismissAll, clearStep }
}
