import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { makeSupabaseMock } from '@/test/supabase-mock'
import {
  readPreference,
  writePreference,
  useActiveCrew,
} from './active-crew'

const KEY_PREFIX = 'inman:active-crew:'
const CHANGE_EVENT = 'inman:active-crew-change'

describe('active-crew preference helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no preference is stored', () => {
    expect(readPreference('user_1')).toBeNull()
  })

  it('round-trips a preference through localStorage scoped by user_id', () => {
    writePreference('user_1', 'crew_a')
    writePreference('user_2', 'crew_b')
    expect(readPreference('user_1')).toBe('crew_a')
    expect(readPreference('user_2')).toBe('crew_b')
    // Underlying key shape:
    expect(localStorage.getItem(KEY_PREFIX + 'user_1')).toBe('crew_a')
  })

  it('clears a preference when set to null', () => {
    writePreference('user_1', 'crew_a')
    writePreference('user_1', null)
    expect(readPreference('user_1')).toBeNull()
  })

  it('dispatches a same-tab change event on both set and clear', () => {
    const spy = vi.fn()
    window.addEventListener(CHANGE_EVENT, spy)
    writePreference('user_1', 'crew_a')
    expect(spy).toHaveBeenCalledTimes(1)
    writePreference('user_1', null)
    expect(spy).toHaveBeenCalledTimes(2)
    window.removeEventListener(CHANGE_EVENT, spy)
  })
})

const crewA = {
  crew_id: 'crew_a',
  role: 'admin',
  crews: { name: 'Crew A', owner_id: 'user_1' },
}
const crewB = {
  crew_id: 'crew_b',
  role: 'admin',
  crews: { name: 'Crew B', owner_id: 'user_1' },
}

describe('useActiveCrew', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('keeps independent hook instances in sync across setActive', async () => {
    makeSupabaseMock({
      crew_members: { select: { data: [crewA, crewB], error: null } },
    })

    const a = renderHook(() => useActiveCrew('user_1'))
    const b = renderHook(() => useActiveCrew('user_1'))

    await waitFor(() => expect(a.result.current.loading).toBe(false))
    await waitFor(() => expect(b.result.current.loading).toBe(false))

    // Both default to the most-recent membership (first row).
    expect(a.result.current.activeCrewId).toBe('crew_a')
    expect(b.result.current.activeCrewId).toBe('crew_a')

    // Switching in one instance must be observed by the other — this is the
    // dashboard-not-updating regression.
    act(() => {
      a.result.current.setActive('crew_b')
    })

    expect(a.result.current.activeCrewId).toBe('crew_b')
    expect(b.result.current.activeCrewId).toBe('crew_b')
  })

  it('ignores and cleans up a stored preference for a crew the user is not in', async () => {
    localStorage.setItem(KEY_PREFIX + 'user_1', 'crew_gone')
    makeSupabaseMock({
      crew_members: { select: { data: [crewA, crewB], error: null } },
    })

    const { result } = renderHook(() => useActiveCrew('user_1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    // Falls back to the most-recent membership, and the stale key is dropped.
    expect(result.current.activeCrewId).toBe('crew_a')
    expect(readPreference('user_1')).toBeNull()
  })
})
