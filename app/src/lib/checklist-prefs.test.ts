import { describe, expect, it, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  readChecklistPrefs,
  writeChecklistPrefs,
  useChecklistPrefs,
} from './checklist-prefs'

const KEY_PREFIX = 'inman:onboarding-checklist:'
const CHANGE_EVENT = 'inman:onboarding-checklist-change'

describe('checklist-prefs helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns defaults when nothing is stored', () => {
    expect(readChecklistPrefs('user_1', 'crew_a')).toEqual({
      dismissed: false,
      cleared: [],
    })
  })

  it('returns defaults when the stored value is corrupt', () => {
    localStorage.setItem(KEY_PREFIX + 'user_1:crew_a', 'not json {')
    expect(readChecklistPrefs('user_1', 'crew_a')).toEqual({
      dismissed: false,
      cleared: [],
    })
  })

  it('round-trips prefs scoped by user and crew', () => {
    writeChecklistPrefs('user_1', 'crew_a', {
      dismissed: true,
      cleared: ['crew'],
    })
    writeChecklistPrefs('user_1', 'crew_b', {
      dismissed: false,
      cleared: ['spaces'],
    })
    expect(readChecklistPrefs('user_1', 'crew_a')).toEqual({
      dismissed: true,
      cleared: ['crew'],
    })
    expect(readChecklistPrefs('user_1', 'crew_b')).toEqual({
      dismissed: false,
      cleared: ['spaces'],
    })
    expect(readChecklistPrefs('user_2', 'crew_a')).toEqual({
      dismissed: false,
      cleared: [],
    })
    // Underlying key shape:
    expect(localStorage.getItem(KEY_PREFIX + 'user_1:crew_a')).toBe(
      JSON.stringify({ dismissed: true, cleared: ['crew'] }),
    )
  })

  it('dispatches a same-tab change event on write', () => {
    const spy = vi.fn()
    window.addEventListener(CHANGE_EVENT, spy)
    writeChecklistPrefs('user_1', 'crew_a', { dismissed: true, cleared: [] })
    expect(spy).toHaveBeenCalledTimes(1)
    window.removeEventListener(CHANGE_EVENT, spy)
  })
})

describe('useChecklistPrefs', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('exposes defaults and updates after dismissAll / clearStep', () => {
    const { result } = renderHook(() => useChecklistPrefs('user_1', 'crew_a'))

    expect(result.current.prefs).toEqual({ dismissed: false, cleared: [] })

    act(() => {
      result.current.clearStep('crew')
    })
    expect(result.current.prefs.cleared).toEqual(['crew'])

    // Idempotent: clearing twice does not duplicate the key.
    act(() => {
      result.current.clearStep('crew')
    })
    expect(result.current.prefs.cleared).toEqual(['crew'])

    act(() => {
      result.current.dismissAll()
    })
    expect(result.current.prefs).toEqual({ dismissed: true, cleared: ['crew'] })
  })

  it('does not write when userId or crewId is missing', () => {
    const { result } = renderHook(() => useChecklistPrefs('user_1', null))

    act(() => {
      result.current.dismissAll()
      result.current.clearStep('crew')
    })

    expect(result.current.prefs).toEqual({ dismissed: false, cleared: [] })
    expect(localStorage.length).toBe(0)
  })

  it('keeps independent hook instances in sync', () => {
    const a = renderHook(() => useChecklistPrefs('user_1', 'crew_a'))
    const b = renderHook(() => useChecklistPrefs('user_1', 'crew_a'))

    act(() => {
      a.result.current.dismissAll()
    })

    expect(b.result.current.prefs.dismissed).toBe(true)
  })
})
