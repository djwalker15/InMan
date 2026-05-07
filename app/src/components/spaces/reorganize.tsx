import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRightLeft,
  GitMerge,
  Scissors,
  Trash2,
} from 'lucide-react'
import { SecondaryButton, TextButton } from '@/components/ds'
import { Tree } from './tree'
import type { SpaceNode } from './types'

/**
 * A reorganize "operation" — the four complex hierarchy mutations from
 * the Space Reorganization journey. The shell here lays out the picker
 * and the empty operation/preview panes; per-operation logic and the
 * atomic edge-function wiring lands in P6.3 (move + merge) and P6.4
 * (delete-with-items + split).
 */
export type ReorganizeOperation = 'move' | 'merge' | 'delete' | 'split'

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
  nodes: SpaceNode[]
  onExit: () => void
}

export function ReorganizeMode({ nodes, onExit }: ReorganizeModeProps) {
  const [operation, setOperation] = useState<ReorganizeOperation | null>(null)

  const liveNodes = nodes.filter((n) => !n.deleted_at)
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

      {selected ? (
        <OperationPanel operation={selected} />
      ) : (
        <p className="rounded-xl bg-paper-100 p-4 font-body text-sm text-ink-600">
          Pick an operation above to begin. The currently-shipped tree editor
          remains available — return to it any time with “Done”.
        </p>
      )}

      <PreviewPanel nodes={liveNodes} operation={selected?.id ?? null} />

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

function OperationPanel({
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

interface PreviewPanelProps {
  nodes: SpaceNode[]
  operation: ReorganizeOperation | null
}

/**
 * The preview panel reads the *configured* operation and renders the
 * impact summary the journey doc spells out — items moved, Flows
 * generated, home-location updates, warnings. The shell here renders
 * the read-only tree as the "before" view; the "after" diff and the
 * impact metrics become operation-specific in P6.3 / P6.4.
 */
function PreviewPanel({ nodes, operation }: PreviewPanelProps) {
  return (
    <section
      aria-label="Reorganize preview"
      className="flex flex-col gap-3 rounded-xl bg-paper-100 p-4"
    >
      <header className="flex items-center justify-between">
        <span className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
          Preview
        </span>
        {operation && (
          <span className="font-body text-xs text-ink-500">
            Configure the operation above to see its impact.
          </span>
        )}
      </header>

      <div className="flex flex-col gap-2">
        <span className="font-display text-xs font-bold text-ink-700">
          Current hierarchy
        </span>
        <div className="rounded-lg bg-paper-50 p-3">
          <Tree
            nodes={nodes}
            emptyState="No spaces to preview yet."
          />
        </div>
      </div>

      <ImpactStub />
    </section>
  )
}

function ImpactStub() {
  const rows: { label: string; value: string }[] = [
    { label: 'Items affected', value: '—' },
    { label: 'Transfer Flows', value: '—' },
    { label: 'Home location updates', value: '—' },
  ]
  return (
    <dl
      aria-label="Impact summary"
      className="grid grid-cols-3 gap-2"
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
