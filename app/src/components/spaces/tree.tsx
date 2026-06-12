import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  UNIT_TYPE_GLYPH,
  UNIT_TYPE_LABEL,
  type SpaceNode,
} from './types'

interface TreeProps {
  nodes: SpaceNode[]
  emptyState?: string
  className?: string
}

interface DepthNode extends SpaceNode {
  depth: number
}

/**
 * Walks the (parent_id) chain to assign a depth to each non-deleted node.
 * Roots (parent_id === null) sit at depth 0. Orphaned nodes (parent missing or
 * soft-deleted) are skipped.
 */
function withDepth(nodes: SpaceNode[]): DepthNode[] {
  const live = nodes.filter((n) => !n.deleted_at)
  const byId = new Map<string, SpaceNode>()
  for (const n of live) byId.set(n.space_id, n)

  function depthOf(node: SpaceNode, seen = new Set<string>()): number | null {
    if (node.parent_id === null) return 0
    if (seen.has(node.space_id)) return null
    const parent = byId.get(node.parent_id)
    if (!parent) return null
    seen.add(node.space_id)
    const parentDepth = depthOf(parent, seen)
    return parentDepth === null ? null : parentDepth + 1
  }

  const out: DepthNode[] = []
  for (const node of live) {
    const d = depthOf(node)
    if (d !== null) out.push({ ...node, depth: d })
  }
  return out
}

export function Tree({ nodes, emptyState, className }: TreeProps) {
  const flat = useMemo(() => withDepth(nodes), [nodes])

  if (flat.length === 0) {
    return (
      <p className={cn('font-body text-sm text-ink-600', className)}>
        {emptyState ?? 'Your tree is empty.'}
      </p>
    )
  }

  return (
    <ol
      aria-label="Spaces tree"
      className={cn('flex flex-col gap-1.5', className)}
    >
      {flat.map((node) => (
        <li
          key={node.space_id}
          className="flex items-center gap-2.5"
          style={{ paddingLeft: `${node.depth * 16}px` }}
          data-unit-type={node.unit_type}
          data-depth={node.depth}
        >
          <span
            aria-hidden
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-paper-50 text-base"
          >
            {UNIT_TYPE_GLYPH[node.unit_type]}
          </span>
          <span className="font-body text-sm text-ink-900">
            {node.name}
            <span className="ml-2 font-body text-xs text-ink-500">
              {UNIT_TYPE_LABEL[node.unit_type]}
            </span>
          </span>
        </li>
      ))}
    </ol>
  )
}
