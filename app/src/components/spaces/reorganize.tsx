import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRightLeft,
  GitMerge,
  Scissors,
  Trash2,
} from 'lucide-react'
import { PrimaryButton, SecondaryButton, TextButton } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'
import { Tree } from './tree'
import {
  descendantIds,
  validMergeTargetIds,
  validMoveParentIds,
} from './tree-helpers'
import type { SpaceNode } from './types'

export type ReorganizeOperation = 'move' | 'merge' | 'delete' | 'split'

export interface ReorganizeItem {
  inventory_item_id: string
  name: string
  current_space_id: string
  home_space_id: string | null
}

const OPERATIONS: {
  id: ReorganizeOperation
  label: string
  blurb: string
  icon: React.ComponentType<{ size?: number; 'aria-hidden'?: boolean }>
  /** Phase the operation's behavior is queued behind. */
  phase: 'P6.3' | 'P6.4'
}[] = [
  {
    id: 'move',
    label: 'Move',
    blurb: 'Relocate a Space (and its children) to a new parent. No item Flows.',
    icon: ArrowRightLeft,
    phase: 'P6.3',
  },
  {
    id: 'merge',
    label: 'Merge',
    blurb:
      'Combine two Spaces. Items move to the target with transfer Flows; source is soft-deleted.',
    icon: GitMerge,
    phase: 'P6.3',
  },
  {
    id: 'delete',
    label: 'Delete',
    blurb:
      'Remove a Space and reassign / clear its items and children explicitly.',
    icon: Trash2,
    phase: 'P6.4',
  },
  {
    id: 'split',
    label: 'Split',
    blurb:
      'Divide one Space into two. Pick which items and child Spaces go where.',
    icon: Scissors,
    phase: 'P6.4',
  },
]

interface ReorganizeModeProps {
  crewId: string
  nodes: SpaceNode[]
  items: ReorganizeItem[]
  onExit: () => void
  /** Called after a successful mutation so the parent can refetch. */
  onApplied: () => void
}

export function ReorganizeMode({
  crewId,
  nodes,
  items,
  onExit,
  onApplied,
}: ReorganizeModeProps) {
  const [operation, setOperation] = useState<ReorganizeOperation | null>(null)

  const liveNodes = useMemo(
    () => nodes.filter((n) => !n.deleted_at),
    [nodes],
  )
  const selected = OPERATIONS.find((o) => o.id === operation) ?? null

  return (
    <section
      aria-label="Reorganize spaces"
      className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm"
    >
      <header className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
            Reorganize mode
          </span>
          <h2 className="font-display text-lg font-bold text-ink-900">
            Restructure the hierarchy
          </h2>
        </div>
        <TextButton type="button" onClick={onExit}>
          <ArrowLeft size={14} aria-hidden />
          Done
        </TextButton>
      </header>

      <p className="font-body text-sm text-ink-600">
        Pick an operation. The preview panel updates as you configure the
        change — nothing is saved until you confirm.
      </p>

      <fieldset
        aria-label="Operation"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
      >
        {OPERATIONS.map((op) => {
          const isActive = op.id === operation
          const Icon = op.icon
          return (
            <button
              key={op.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setOperation(op.id)}
              className={
                isActive
                  ? 'flex flex-col items-start gap-1 rounded-xl border border-sage-700 bg-sage-100 p-3 text-sage-700 transition'
                  : 'flex flex-col items-start gap-1 rounded-xl border border-transparent bg-paper-100 p-3 text-ink-700 transition hover:bg-paper-200'
              }
            >
              <span className="flex items-center gap-2">
                <Icon size={16} aria-hidden />
                <span className="font-display text-sm font-bold">
                  {op.label}
                </span>
              </span>
              <span className="font-body text-xs text-ink-500">
                {op.blurb}
              </span>
            </button>
          )
        })}
      </fieldset>

      {operation === 'move' ? (
        <MovePanel
          nodes={liveNodes}
          items={items}
          onConfirmed={() => {
            onApplied()
            setOperation(null)
          }}
        />
      ) : operation === 'merge' ? (
        <MergePanel
          crewId={crewId}
          nodes={liveNodes}
          items={items}
          onConfirmed={() => {
            onApplied()
            setOperation(null)
          }}
        />
      ) : selected ? (
        <ComingSoonPanel operation={selected} />
      ) : (
        <p className="rounded-xl bg-paper-100 p-4 font-body text-sm text-ink-600">
          Pick an operation above to begin. The currently-shipped tree editor
          remains available — return to it any time with “Done”.
        </p>
      )}

      <footer className="flex justify-end">
        <SecondaryButton
          type="button"
          onClick={onExit}
          className="!h-10 !w-auto px-3 !text-sm"
        >
          Cancel
        </SecondaryButton>
      </footer>
    </section>
  )
}

function ComingSoonPanel({
  operation,
}: {
  operation: (typeof OPERATIONS)[number]
}) {
  const Icon = operation.icon
  return (
    <div
      aria-label={`${operation.label} configuration`}
      className="flex items-start gap-3 rounded-xl bg-paper-100 p-4"
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-200 text-ink-700"
      >
        <Icon size={16} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-base font-bold text-ink-900">
          {operation.label} — coming with {operation.phase}
        </p>
        <p className="font-body text-sm text-ink-600">{operation.blurb}</p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Move
 * ───────────────────────────────────────────────────────────────── */

interface MovePanelProps {
  nodes: SpaceNode[]
  items: ReorganizeItem[]
  onConfirmed: () => void
}

function MovePanel({ nodes, items, onConfirmed }: MovePanelProps) {
  const supabase = useSupabase()
  const [sourceId, setSourceId] = useState<string>('')
  const [targetId, setTargetId] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sources: every non-Premises live node.
  const sourceOptions = useMemo(
    () =>
      nodes
        .filter((n) => n.parent_id !== null)
        .map((n) => ({ id: n.space_id, label: pathLabel(nodes, n.space_id) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [nodes],
  )

  const validParentIds = useMemo(
    () => (sourceId ? validMoveParentIds(nodes, sourceId) : new Set<string>()),
    [nodes, sourceId],
  )

  const targetOptions = useMemo(
    () =>
      nodes
        .filter((n) => validParentIds.has(n.space_id))
        .map((n) => ({ id: n.space_id, label: pathLabel(nodes, n.space_id) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [nodes, validParentIds],
  )

  const subtreeCount = useMemo(() => {
    if (!sourceId) return 0
    return descendantIds(nodes, sourceId).length + 1
  }, [nodes, sourceId])

  const itemsInSubtree = useMemo(() => {
    if (!sourceId) return 0
    const ids = new Set<string>([sourceId, ...descendantIds(nodes, sourceId)])
    return items.filter((it) => ids.has(it.current_space_id)).length
  }, [nodes, items, sourceId])

  const valid = sourceId !== '' && targetId !== '' && !busy

  async function handleSubmit() {
    if (!valid) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('move_space', {
      p_space_id: sourceId,
      p_new_parent_id: targetId,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to move Space.')
      return
    }
    setSourceId('')
    setTargetId('')
    onConfirmed()
  }

  return (
    <div
      aria-label="Move configuration"
      className="flex flex-col gap-3 rounded-xl bg-paper-100 p-4"
    >
      <PickerSelect
        label="Move this Space"
        value={sourceId}
        onChange={(v) => {
          setSourceId(v)
          setTargetId('')
        }}
        options={sourceOptions}
      />
      <PickerSelect
        label="To this new parent"
        value={targetId}
        onChange={setTargetId}
        options={targetOptions}
        disabled={!sourceId}
        emptyHint={
          sourceId && targetOptions.length === 0
            ? 'No valid parents — check unit-type compatibility.'
            : undefined
        }
      />
      {sourceId && (
        <ImpactSummary
          rows={[
            {
              label: 'Spaces in the moving subtree',
              value: subtreeCount.toLocaleString(),
            },
            {
              label: 'Items affected (no Flows)',
              value: itemsInSubtree.toLocaleString(),
            },
            { label: 'Transfer Flows generated', value: '0' },
          ]}
        />
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <PrimaryButton
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!valid}
          className="!h-10 !w-auto px-4 !text-sm"
        >
          {busy ? 'Moving…' : 'Confirm move'}
        </PrimaryButton>
      </div>
      <PreviewTree nodes={nodes} highlightedSourceId={sourceId} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Merge
 * ───────────────────────────────────────────────────────────────── */

interface MergePanelProps {
  crewId: string
  nodes: SpaceNode[]
  items: ReorganizeItem[]
  onConfirmed: () => void
}

function MergePanel({ nodes, items, onConfirmed }: MergePanelProps) {
  const supabase = useSupabase()
  const [sourceId, setSourceId] = useState<string>('')
  const [targetId, setTargetId] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sourceOptions = useMemo(
    () =>
      nodes
        .filter((n) => n.parent_id !== null)
        .map((n) => ({ id: n.space_id, label: pathLabel(nodes, n.space_id) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [nodes],
  )

  const validTargetIds = useMemo(
    () => (sourceId ? validMergeTargetIds(nodes, sourceId) : new Set<string>()),
    [nodes, sourceId],
  )

  const targetOptions = useMemo(
    () =>
      nodes
        .filter((n) => validTargetIds.has(n.space_id))
        .map((n) => ({ id: n.space_id, label: pathLabel(nodes, n.space_id) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [nodes, validTargetIds],
  )

  const itemsAtSource = useMemo(
    () =>
      sourceId
        ? items.filter((it) => it.current_space_id === sourceId).length
        : 0,
    [items, sourceId],
  )
  const homeReferencingSource = useMemo(
    () =>
      sourceId
        ? items.filter((it) => it.home_space_id === sourceId).length
        : 0,
    [items, sourceId],
  )
  const childCount = useMemo(
    () =>
      sourceId
        ? nodes.filter((n) => n.parent_id === sourceId).length
        : 0,
    [nodes, sourceId],
  )

  const valid = sourceId !== '' && targetId !== '' && !busy

  async function handleSubmit() {
    if (!valid) return
    setBusy(true)
    setError(null)
    const { error: rpcError } = await supabase.rpc('merge_spaces', {
      p_source_id: sourceId,
      p_target_id: targetId,
    })
    setBusy(false)
    if (rpcError) {
      setError(rpcError.message ?? 'Failed to merge Spaces.')
      return
    }
    setSourceId('')
    setTargetId('')
    onConfirmed()
  }

  return (
    <div
      aria-label="Merge configuration"
      className="flex flex-col gap-3 rounded-xl bg-paper-100 p-4"
    >
      <PickerSelect
        label="Merge this Space"
        value={sourceId}
        onChange={(v) => {
          setSourceId(v)
          setTargetId('')
        }}
        options={sourceOptions}
      />
      <PickerSelect
        label="Into this Space"
        value={targetId}
        onChange={setTargetId}
        options={targetOptions}
        disabled={!sourceId}
        emptyHint={
          sourceId && targetOptions.length === 0
            ? 'No valid targets — at least one of source’s children would lose its position.'
            : undefined
        }
      />
      {sourceId && (
        <ImpactSummary
          rows={[
            {
              label: 'Items moving',
              value: itemsAtSource.toLocaleString(),
            },
            {
              label: 'Transfer Flows',
              value: itemsAtSource.toLocaleString(),
            },
            {
              label: 'Home updates',
              value: homeReferencingSource.toLocaleString(),
            },
            {
              label: 'Children re-parented',
              value: childCount.toLocaleString(),
            },
          ]}
        />
      )}
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end">
        <PrimaryButton
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!valid}
          className="!h-10 !w-auto px-4 !text-sm"
        >
          {busy ? 'Merging…' : 'Confirm merge'}
        </PrimaryButton>
      </div>
      <PreviewTree nodes={nodes} highlightedSourceId={sourceId} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
 * Shared bits
 * ───────────────────────────────────────────────────────────────── */

interface PickerSelectProps {
  label: string
  value: string
  onChange: (id: string) => void
  options: { id: string; label: string }[]
  disabled?: boolean
  emptyHint?: string
}

function PickerSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  emptyHint,
}: PickerSelectProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="px-1 font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || options.length === 0}
        className="rounded-xl bg-paper-50 px-3 py-3 font-body text-base text-ink-900 outline-none transition focus:bg-paper-200 disabled:opacity-50"
      >
        <option value="">Pick a Space…</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      {emptyHint && (
        <span className="px-1 font-body text-xs text-ink-500">{emptyHint}</span>
      )}
    </label>
  )
}

function ImpactSummary({
  rows,
}: {
  rows: { label: string; value: string }[]
}) {
  return (
    <dl
      aria-label="Impact summary"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
    >
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex flex-col gap-1 rounded-lg bg-paper-50 p-3"
        >
          <dt className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
            {row.label}
          </dt>
          <dd className="font-display text-base font-bold text-ink-900">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function PreviewTree({
  nodes,
  highlightedSourceId,
}: {
  nodes: SpaceNode[]
  highlightedSourceId: string
}) {
  return (
    <section
      aria-label="Reorganize preview"
      className="flex flex-col gap-2 rounded-lg bg-paper-50 p-3"
    >
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
        Current hierarchy
      </span>
      <Tree nodes={nodes} emptyState="No spaces to preview yet." />
      {highlightedSourceId && (
        <p className="px-1 font-body text-xs text-ink-500">
          Source: <strong>{pathLabel(nodes, highlightedSourceId)}</strong>
        </p>
      )}
    </section>
  )
}

function pathLabel(nodes: SpaceNode[], id: string): string {
  const byId = new Map(nodes.map((n) => [n.space_id, n]))
  const parts: string[] = []
  let cursor: SpaceNode | undefined = byId.get(id)
  while (cursor) {
    parts.unshift(cursor.name)
    cursor = cursor.parent_id ? byId.get(cursor.parent_id) : undefined
  }
  return parts.join(' › ')
}
