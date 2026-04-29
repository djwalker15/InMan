import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { CustomProductForm } from '@/components/inventory/custom-product-form'
import { ProductSearch } from '@/components/inventory/product-search'
import type { ProductRow, Selection } from '@/components/inventory/types'
import { useSupabase } from '@/lib/supabase'

interface MembershipRow {
  crew_id: string
}

type Phase =
  | { kind: 'search' }
  | { kind: 'custom' }
  | { kind: 'selected'; selection: Selection }

export default function AddInventoryPage() {
  const { user } = useUser()
  const supabase = useSupabase()
  const navigate = useNavigate()

  const [crewId, setCrewId] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>({ kind: 'search' })
  const [crewLoading, setCrewLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data } = await supabase
        .from('crew_members')
        .select('crew_id')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cancelled) return
      const row = data as MembershipRow | null
      if (row?.crew_id) setCrewId(row.crew_id)
      setCrewLoading(false)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [supabase])

  function handleSelect(selection: Selection) {
    setPhase({ kind: 'selected', selection })
  }

  function handleCustomCreated(product: ProductRow) {
    setPhase({
      kind: 'selected',
      selection: { kind: 'product', product },
    })
  }

  return (
    <SignedInLayout>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5 pt-4 pb-12">
        <header className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Back to inventory"
            onClick={() => navigate('/inventory')}
            className="flex size-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-200"
          >
            <ArrowLeft size={20} strokeWidth={2.25} />
          </button>
          <h1 className="font-display text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-ink-900">
            Add an item
          </h1>
        </header>

        {crewLoading ? (
          <p className="font-body text-sm text-ink-600">Loading…</p>
        ) : !crewId || !user ? (
          <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            We couldn't load your crew. Finish onboarding first.
          </p>
        ) : phase.kind === 'search' ? (
          <ProductSearch
            crewId={crewId}
            onSelect={handleSelect}
            onCreateCustom={() => setPhase({ kind: 'custom' })}
          />
        ) : phase.kind === 'custom' ? (
          <CustomProductForm
            crewId={crewId}
            userId={user.id}
            onCreated={handleCustomCreated}
            onCancel={() => setPhase({ kind: 'search' })}
          />
        ) : (
          <SelectedPlaceholder
            selection={phase.selection}
            onBack={() => setPhase({ kind: 'search' })}
          />
        )}
      </div>
    </SignedInLayout>
  )
}

interface SelectedPlaceholderProps {
  selection: Selection
  onBack: () => void
}

/**
 * Step 1 hands off to Step 2 (P3.4 — quantity, unit, location, etc.) and
 * the restock sub-flow (P3.5). Until those land, this placeholder confirms
 * the selection so the search experience is testable end-to-end.
 */
function SelectedPlaceholder({ selection, onBack }: SelectedPlaceholderProps) {
  const product =
    selection.kind === 'restock'
      ? selection.item.product
      : selection.product
  const headline =
    selection.kind === 'restock'
      ? 'Restock — coming next (P3.5)'
      : 'Step 2 — coming next (P3.4)'

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-paper-100 p-5">
      <h2 className="font-display text-base font-bold text-ink-900">
        {headline}
      </h2>
      <p className="font-body text-sm leading-5 text-ink-700">
        Selected: <strong>{product.name}</strong>
        {product.brand ? ` (${product.brand})` : ''}.{' '}
        {selection.kind === 'restock'
          ? `Existing stock: ${selection.item.item.quantity} ${selection.item.item.unit} at ${selection.item.locationPath || 'unknown'}.`
          : selection.kind === 'add-another'
            ? "We'll create a new inventory record at the location you pick next."
            : 'Pick how much and where, then save.'}
      </p>
      <button
        type="button"
        onClick={onBack}
        className="self-start font-display text-sm font-bold text-sage-700 hover:underline"
      >
        ← Pick a different product
      </button>
    </section>
  )
}
