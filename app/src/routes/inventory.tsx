import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ShoppingBasket } from 'lucide-react'
import { PrimaryButton } from '@/components/ds'
import { InventoryList } from '@/components/inventory/inventory-list'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { useSupabase } from '@/lib/supabase'

interface MembershipRow {
  crew_id: string
}

export default function InventoryPage() {
  const supabase = useSupabase()
  const [crewId, setCrewId] = useState<string | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data: membership } = await supabase
        .from('crew_members')
        .select('crew_id')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cancelled) return
      const row = membership as MembershipRow | null
      if (!row?.crew_id) {
        setCount(0)
        return
      }
      setCrewId(row.crew_id)

      const { count: itemCount, error: itemErr } = await supabase
        .from('inventory_items')
        .select('inventory_item_id', { count: 'exact', head: true })
        .eq('crew_id', row.crew_id)
        .is('deleted_at', null)
      if (cancelled) return
      if (itemErr) {
        setLoadError(itemErr.message ?? 'Failed to load inventory.')
        setCount(0)
        return
      }
      setCount(itemCount ?? 0)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [supabase])

  return (
    <SignedInLayout>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6 pt-4 pb-12">
        <header className="flex items-center justify-between">
          <h1 className="font-display text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-ink-900">
            Inventory
          </h1>
          {count !== null && count > 0 && (
            <Link to="/inventory/add" aria-label="Add item">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-sage-700 to-sage-600 text-white shadow-cta transition active:scale-[0.98]">
                <Plus size={20} strokeWidth={2.5} />
              </span>
            </Link>
          )}
        </header>

        {loadError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {loadError}
          </p>
        ) : count === null ? (
          <p className="font-body text-sm text-ink-600">Loading…</p>
        ) : count === 0 ? (
          <EmptyState hasCrew={crewId !== null} />
        ) : (
          crewId && <InventoryList crewId={crewId} />
        )}
      </div>
    </SignedInLayout>
  )
}

interface EmptyStateProps {
  hasCrew: boolean
}

function EmptyState({ hasCrew }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-start gap-4 rounded-2xl bg-paper-100 p-6">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-full bg-paper-50 text-sage-700"
      >
        <ShoppingBasket size={22} strokeWidth={2} />
      </span>
      <div className="flex flex-col gap-1">
        <h2 className="font-display text-xl font-bold text-ink-900">
          Your inventory is empty
        </h2>
        <p className="font-body text-base leading-6 text-ink-700">
          Add your first item to start tracking what's in stock, where it
          lives, and how much is left.
        </p>
      </div>
      {hasCrew ? (
        <Link to="/inventory/add">
          <PrimaryButton arrow>Add an item</PrimaryButton>
        </Link>
      ) : (
        <Link to="/onboarding">
          <PrimaryButton arrow>Finish onboarding first</PrimaryButton>
        </Link>
      )}
    </section>
  )
}
