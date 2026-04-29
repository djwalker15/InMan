import { describe, expect, it } from 'vitest'
import {
  ALLOWED_CHILD_TYPES,
  SMART_CHILD_TYPE,
  canReclassifyTo,
  descendantIds,
  hasChildren,
  reclassifySuggestions,
} from './tree-helpers'
import type { SpaceNode } from './types'

const tree: SpaceNode[] = [
  { space_id: 'p', parent_id: null, unit_type: 'premises', name: 'My House' },
  { space_id: 'a', parent_id: 'p', unit_type: 'area', name: 'Kitchen' },
  { space_id: 'z', parent_id: 'a', unit_type: 'zone', name: 'Back' },
  { space_id: 's', parent_id: 'z', unit_type: 'section', name: 'Above' },
  { space_id: 'sub', parent_id: 's', unit_type: 'sub_section', name: 'Cabinet 1' },
  { space_id: 'sh1', parent_id: 'sub', unit_type: 'shelf', name: 'Shelf 1' },
  { space_id: 'sh2', parent_id: 'sub', unit_type: 'shelf', name: 'Shelf 2' },
]

describe('SMART_CHILD_TYPE', () => {
  it('maps each parent type to a sensible default child', () => {
    expect(SMART_CHILD_TYPE.premises).toBe('area')
    expect(SMART_CHILD_TYPE.area).toBe('zone')
    expect(SMART_CHILD_TYPE.zone).toBe('section')
    expect(SMART_CHILD_TYPE.section).toBe('sub_section')
    expect(SMART_CHILD_TYPE.sub_section).toBe('shelf')
    expect(SMART_CHILD_TYPE.container).toBe('shelf')
    expect(SMART_CHILD_TYPE.shelf).toBeNull()
  })
})

describe('ALLOWED_CHILD_TYPES', () => {
  it('shelf has no allowed children', () => {
    expect(ALLOWED_CHILD_TYPES.shelf).toEqual([])
  })

  it('area allows zone, section, sub_section, container, shelf (skip levels)', () => {
    expect(ALLOWED_CHILD_TYPES.area).toContain('zone')
    expect(ALLOWED_CHILD_TYPES.area).toContain('shelf')
  })
})

describe('descendantIds', () => {
  it('returns every descendant of a node, excluding itself', () => {
    const ids = descendantIds(tree, 'a').sort()
    expect(ids).toEqual(['s', 'sh1', 'sh2', 'sub', 'z'])
  })

  it('returns an empty array for a leaf', () => {
    expect(descendantIds(tree, 'sh1')).toEqual([])
  })

  it('skips soft-deleted descendants', () => {
    const withDeleted: SpaceNode[] = [
      ...tree,
      {
        space_id: 'gone',
        parent_id: 'sub',
        unit_type: 'shelf',
        name: 'Shelf 3',
        deleted_at: '2026-04-29T00:00:00Z',
      },
    ]
    const ids = descendantIds(withDeleted, 'sub')
    expect(ids).not.toContain('gone')
  })
})

describe('hasChildren', () => {
  it('returns true when a node has live children', () => {
    expect(hasChildren(tree, 'sub')).toBe(true)
  })

  it('returns false for a leaf', () => {
    expect(hasChildren(tree, 'sh1')).toBe(false)
  })
})

describe('reclassifySuggestions', () => {
  it('refuses to reclassify a Premises (root)', () => {
    const result = reclassifySuggestions(tree, 'p')
    expect(result.valid).toBe(false)
    expect(result.suggestions).toEqual([])
    expect(result.reason).toMatch(/premises is the root/i)
  })

  it('suggests valid alternatives for a sub_section with shelf children', () => {
    // sub_section children: shelf. New type must allow shelf as a child.
    // sub_section's parent (section) allows: sub_section, container, shelf.
    // Excluding current type sub_section: container (allows shelf ✓), shelf
    // (no children allowed ✗). So container is the only suggestion.
    const result = reclassifySuggestions(tree, 'sub')
    expect(result.suggestions).toContain('container')
    expect(result.suggestions).not.toContain('shelf')
  })

  it('returns no suggestions when nothing is valid', () => {
    // A leaf shelf at /Cabinet 1 — parent is sub_section (allowed children:
    // container, shelf). Excluding shelf, only container is left. The leaf
    // has no children, so container is valid. We expect at least one.
    const result = reclassifySuggestions(tree, 'sh1')
    expect(result.suggestions.length).toBeGreaterThan(0)
  })
})

describe('canReclassifyTo', () => {
  it('honors the suggestion list', () => {
    expect(canReclassifyTo(tree, 'sub', 'container')).toBe(true)
    expect(canReclassifyTo(tree, 'sub', 'shelf')).toBe(false)
  })
})
