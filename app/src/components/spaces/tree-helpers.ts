import type { SpaceNode, UnitType } from './types'

/**
 * Smart-default child type per parent's unit_type. Used by the tree editor
 * and guided wizard to pre-select the most-likely child type.
 */
export const SMART_CHILD_TYPE: Record<UnitType, UnitType | null> = {
  premises: 'area',
  area: 'zone',
  zone: 'section',
  section: 'sub_section',
  sub_section: 'shelf',
  container: 'shelf',
  shelf: null,
}

/** Levels the user can explicitly choose for a child of the given parent. */
export const ALLOWED_CHILD_TYPES: Record<UnitType, UnitType[]> = {
  premises: ['area', 'zone', 'section', 'sub_section', 'container', 'shelf'],
  area: ['zone', 'section', 'sub_section', 'container', 'shelf'],
  zone: ['section', 'sub_section', 'container', 'shelf'],
  section: ['sub_section', 'container', 'shelf'],
  sub_section: ['container', 'shelf'],
  container: ['shelf'],
  shelf: [],
}

const LEVEL_RANK: Record<UnitType, number> = {
  premises: 0,
  area: 1,
  zone: 2,
  section: 3,
  sub_section: 4,
  container: 5,
  shelf: 6,
}

/**
 * Returns the IDs of every descendant of `nodeId` in the given (live) tree —
 * NOT including nodeId itself. Skips soft-deleted nodes when walking.
 */
export function descendantIds(nodes: SpaceNode[], nodeId: string): string[] {
  const childrenByParent = new Map<string, string[]>()
  for (const n of nodes) {
    if (n.deleted_at) continue
    if (!n.parent_id) continue
    const list = childrenByParent.get(n.parent_id) ?? []
    list.push(n.space_id)
    childrenByParent.set(n.parent_id, list)
  }
  const out: string[] = []
  const queue: string[] = [...(childrenByParent.get(nodeId) ?? [])]
  while (queue.length > 0) {
    const id = queue.shift()!
    out.push(id)
    queue.push(...(childrenByParent.get(id) ?? []))
  }
  return out
}

/**
 * Returns true if a node currently has at least one non-deleted child.
 */
export function hasChildren(nodes: SpaceNode[], nodeId: string): boolean {
  return nodes.some((n) => n.parent_id === nodeId && !n.deleted_at)
}

/**
 * Reclassify validation. The new unit_type must:
 *  - be different from the current type
 *  - be a valid child of the parent's type (if parent exists)
 *  - if the node has children, the new type must be allowed to have children
 *    (i.e. not 'shelf')
 *  - if the node has children, every child's current unit_type must still be
 *    a legal child of the new type
 *
 * Premises (parent_id IS NULL) cannot be reclassified to anything else, and
 * non-premises cannot be reclassified to 'premises' (the CHECK constraint
 * spaces_premises_root_check enforces this server-side too).
 */
export interface ReclassifyValidation {
  valid: boolean
  reason?: string
  suggestions: UnitType[]
}

export function reclassifySuggestions(
  nodes: SpaceNode[],
  nodeId: string,
): ReclassifyValidation {
  const node = nodes.find((n) => n.space_id === nodeId)
  if (!node) return { valid: false, reason: 'Node not found.', suggestions: [] }
  if (node.parent_id === null) {
    return {
      valid: false,
      reason: 'A Premises is the root — change its name instead.',
      suggestions: [],
    }
  }
  const parent = nodes.find((n) => n.space_id === node.parent_id)
  if (!parent) {
    return { valid: false, reason: 'Parent missing.', suggestions: [] }
  }
  const allowedByParent = ALLOWED_CHILD_TYPES[parent.unit_type]
  const liveChildren = nodes.filter(
    (n) => n.parent_id === node.space_id && !n.deleted_at,
  )
  const candidates = allowedByParent.filter((t) => t !== node.unit_type)
  const suggestions: UnitType[] = []
  for (const candidate of candidates) {
    // Each existing child's unit_type must remain a legal child of the new type.
    const childrenOk = liveChildren.every((c) =>
      ALLOWED_CHILD_TYPES[candidate].includes(c.unit_type),
    )
    if (!childrenOk) continue
    suggestions.push(candidate)
  }
  return {
    valid: suggestions.length > 0,
    reason: suggestions.length === 0 ? 'No valid types for this position.' : undefined,
    suggestions,
  }
}

/**
 * Returns true if `candidate` would be a legal new unit_type for the given
 * node — i.e. it's in the suggestion list.
 */
export function canReclassifyTo(
  nodes: SpaceNode[],
  nodeId: string,
  candidate: UnitType,
): boolean {
  return reclassifySuggestions(nodes, nodeId).suggestions.includes(candidate)
}

/** Sort key for unit_types — useful when listing siblings deterministically. */
export function unitTypeRank(t: UnitType): number {
  return LEVEL_RANK[t]
}
