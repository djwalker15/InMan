import { useEffect, useState, useSyncExternalStore } from 'react'
import { useSupabase } from './supabase'

/**
 * Active-crew preference plumbing.
 *
 * Each user can be a member of multiple Crews. When the user has more
 * than one membership, we pin the "active" one to localStorage so the
 * dashboard / inventory / spaces views all reflect the same crew. If
 * the stored preference points at a crew the user has since been
 * removed from (or which has been soft-deleted), we silently fall back
 * to the most-recently-created active membership.
 *
 * The preference is keyed by Clerk user_id so it survives sign-outs of
 * other users on the same device.
 */

const STORAGE_PREFIX = 'inman:active-crew:'
/**
 * Same-tab change signal. The native `storage` event only fires in *other*
 * tabs, never the one that wrote — so a custom event is required for the
 * crew switcher in one component to notify hook instances in sibling
 * components (e.g. the dashboard) within the same tab.
 */
const CHANGE_EVENT = 'inman:active-crew-change'

export interface CrewMembership {
  crew_id: string
  role: string
  crew_name: string
  is_owner: boolean
}

export interface ActiveCrewState {
  loading: boolean
  error: string | null
  /** All active memberships for the signed-in user. */
  memberships: CrewMembership[]
  /** The selected crew (preference or most-recent fallback). */
  activeCrewId: string | null
  /** Switch to a different crew the user is a member of. */
  setActive: (crewId: string) => void
}

export function readPreference(userId: string): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_PREFIX + userId)
}

export function writePreference(userId: string, crewId: string | null): void {
  if (typeof window === 'undefined') return
  if (crewId === null) {
    window.localStorage.removeItem(STORAGE_PREFIX + userId)
  } else {
    window.localStorage.setItem(STORAGE_PREFIX + userId, crewId)
  }
  // Notify same-tab subscribers so every useActiveCrew instance re-reads.
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

/**
 * Subscribe to active-crew preference changes. Listens for the same-tab
 * custom event and the cross-tab native `storage` event. Used as the
 * `subscribe` arg to useSyncExternalStore so all hook instances stay in sync.
 */
function subscribePreference(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

interface RawCrew {
  name: string
  owner_id: string
}
/**
 * Supabase typing for foreign-table joins is permissive — the result
 * shape can be a single row or an array depending on the cardinality.
 * We accept both and normalize at read time.
 */
interface RawRow {
  crew_id: string
  role: string
  crews: RawCrew | RawCrew[] | null
}

export function useActiveCrew(userId: string | null): ActiveCrewState {
  const supabase = useSupabase()
  const [memberships, setMemberships] = useState<CrewMembership[]>([])
  // Initial loading reflects whether we'll actually run the effect: if
  // we already know there's no auth context, skip straight to "not
  // loading" so we don't have to setState from inside the effect's
  // early-return branch (react-hooks/set-state-in-effect).
  const [loading, setLoading] = useState(() => Boolean(userId && supabase))
  const [error, setError] = useState<string | null>(null)
  // Shared, reactive read of the stored preference. All hook instances in
  // the tab re-render together when writePreference dispatches its event,
  // so switching crews in one component (the switcher) updates them all.
  const storedPreference = useSyncExternalStore(
    subscribePreference,
    () => (userId ? readPreference(userId) : null),
    () => null,
  )

  useEffect(() => {
    if (!userId || !supabase) return
    const safeUserId: string = userId
    let cancelled = false
    async function load() {
      const { data, error: queryError } = await supabase
        .from('crew_members')
        .select('crew_id, role, crews(name, owner_id)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (queryError) {
        setError(queryError.message ?? 'Failed to load crews.')
        setLoading(false)
        return
      }
      const rows = (Array.isArray(data) ? data : []) as RawRow[]
      const next: CrewMembership[] = []
      for (const r of rows) {
        const crew = Array.isArray(r.crews) ? r.crews[0] : r.crews
        if (!crew) continue
        next.push({
          crew_id: r.crew_id,
          role: r.role,
          crew_name: crew.name,
          is_owner: crew.owner_id === safeUserId,
        })
      }
      setMemberships(next)
      // Drop a stored preference that points at a crew the user is no
      // longer a member of. activeCrewId already falls back inline, so this
      // is hygiene only — guarded so a clean load never re-dispatches.
      const stored = readPreference(safeUserId)
      if (stored && !next.some((m) => m.crew_id === stored)) {
        writePreference(safeUserId, null)
      }
      setLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [supabase, userId])

  const validPreference =
    storedPreference && memberships.some((m) => m.crew_id === storedPreference)
      ? storedPreference
      : null
  const activeCrewId =
    validPreference ??
    (memberships.length > 0 ? memberships[0].crew_id : null)

  function setActive(crewId: string) {
    if (!userId) return
    if (!memberships.some((m) => m.crew_id === crewId)) return
    // Dispatches CHANGE_EVENT → every useActiveCrew instance re-reads.
    writePreference(userId, crewId)
  }

  return {
    loading,
    error,
    memberships,
    activeCrewId,
    setActive,
  }
}
