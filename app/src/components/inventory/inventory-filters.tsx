import type { ChangeEvent } from 'react'
import { Search, X } from 'lucide-react'
import { Chip } from '@/components/ds'
import { cn } from '@/lib/utils'
import {
  EMPTY_FILTERS,
  type InventoryFiltersState,
} from './inventory-filters-state'
import {
  ALERT_LABEL,
  type InventoryAlert,
} from './inventory-status'

interface CategoryOption {
  category_id: string
  name: string
}

interface SpaceOption {
  space_id: string
  /** Pre-built breadcrumb label (e.g. "Kitchen › Cabinet 1"). */
  label: string
}

interface InventoryFiltersProps {
  state: InventoryFiltersState
  onChange: (next: InventoryFiltersState) => void
  categories: CategoryOption[]
  spaces: SpaceOption[]
  /** Whether at least one alert exists in the current data, used to show
   *  the alert filter chips. */
  alertFiltersAvailable?: boolean
}

const ALL_ALERTS: InventoryAlert[] = [
  'out_of_stock',
  'low_stock',
  'expiring_soon',
  'expired',
  'displaced',
]

export function InventoryFilters({
  state,
  onChange,
  categories,
  spaces,
  alertFiltersAvailable = true,
}: InventoryFiltersProps) {
  function update(patch: Partial<InventoryFiltersState>) {
    onChange({ ...state, ...patch })
  }

  function toggleCategory(id: string) {
    const next = new Set(state.categoryIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    update({ categoryIds: next })
  }

  function toggleAlert(alert: InventoryAlert) {
    const next = new Set(state.alerts)
    if (next.has(alert)) next.delete(alert)
    else next.add(alert)
    update({ alerts: next })
  }

  const anyActive =
    state.query.length > 0 ||
    state.categoryIds.size > 0 ||
    state.spaceId !== '' ||
    state.alerts.size > 0

  return (
    <section
      aria-label="Inventory filters"
      className="flex flex-col gap-3 rounded-2xl bg-paper-100 p-4"
    >
      <label className="flex items-center gap-2 rounded-lg bg-paper-50 px-3">
        <Search size={16} aria-hidden className="text-ink-500" />
        <input
          aria-label="Search inventory"
          type="search"
          placeholder="Search by name, brand, notes, or barcode"
          value={state.query}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            update({ query: e.target.value })
          }
          className="h-12 w-full bg-transparent font-body text-base text-ink-900 outline-none placeholder:text-ink-500"
        />
        {state.query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => update({ query: '' })}
            className="flex size-7 items-center justify-center rounded-full text-ink-600 hover:bg-paper-200"
          >
            <X size={14} />
          </button>
        )}
      </label>

      {categories.length > 0 && (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-300">
            Category
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => {
              const active = state.categoryIds.has(c.category_id)
              return (
                <button
                  key={c.category_id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCategory(c.category_id)}
                  className="appearance-none border-0 bg-transparent p-0"
                >
                  <Chip variant={active ? 'sage' : 'default'}>
                    {c.name}
                  </Chip>
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {spaces.length > 0 && (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-300">
            Space
          </legend>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by space"
              value={state.spaceId}
              onChange={(e) => update({ spaceId: e.target.value })}
              className="h-10 rounded-lg bg-paper-50 px-2 font-body text-sm text-ink-900 outline-none focus:bg-paper-250"
            >
              <option value="">Any space</option>
              {spaces.map((s) => (
                <option key={s.space_id} value={s.space_id}>
                  {s.label}
                </option>
              ))}
            </select>
            <label
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs',
                state.spaceId
                  ? 'bg-paper-50 text-ink-700'
                  : 'bg-paper-50 text-ink-400',
              )}
            >
              <input
                type="checkbox"
                checked={state.spaceIncludeChildren}
                disabled={!state.spaceId}
                onChange={(e) =>
                  update({ spaceIncludeChildren: e.target.checked })
                }
                className="accent-sage-700"
              />
              Include children
            </label>
          </div>
        </fieldset>
      )}

      {alertFiltersAvailable && (
        <fieldset className="flex flex-col gap-1.5">
          <legend className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-300">
            Status
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {ALL_ALERTS.map((a) => {
              const active = state.alerts.has(a)
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleAlert(a)}
                  className="appearance-none border-0 bg-transparent p-0"
                >
                  <Chip
                    variant={
                      active
                        ? a === 'out_of_stock' || a === 'expired'
                          ? 'error'
                          : a === 'low_stock' || a === 'expiring_soon'
                            ? 'warn'
                            : 'sage'
                        : 'default'
                    }
                  >
                    {ALERT_LABEL[a]}
                  </Chip>
                </button>
              )
            })}
          </div>
        </fieldset>
      )}

      {anyActive && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="self-start font-display text-xs font-bold uppercase tracking-[0.55px] text-sage-700 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </section>
  )
}
