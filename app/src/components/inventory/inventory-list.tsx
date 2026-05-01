import { useEffect, useMemo, useState } from 'react'
import { Chip } from '@/components/ds'
import { useSupabase } from '@/lib/supabase'
import {
  EMPTY_FILTERS,
  InventoryFilters,
  type InventoryFiltersState,
} from './inventory-filters'
import {
  ALERT_LABEL,
  alertScore,
  deriveAlerts,
  type InventoryAlert,
} from './inventory-status'

interface InventoryItemRow {
  inventory_item_id: string
  product_id: string
  current_space_id: string
  home_space_id: string | null
  quantity: number
  unit: string
  category_id: string | null
  min_stock: number | null
  expiry_date: string | null
  notes: string | null
}

interface ProductRow {
  product_id: string
  name: string
  brand: string | null
  default_category_id: string | null
}

interface CategoryRow {
  category_id: string
  name: string
}

interface SpaceLite {
  space_id: string
  parent_id: string | null
  name: string
}

interface RenderRow {
  item: InventoryItemRow
  product: ProductRow
  categoryName: string | null
  effectiveCategoryId: string | null
  locationPath: string
  alerts: InventoryAlert[]
  score: number
  /** Pre-built lowercased haystack for the search box. */
  search: string
}

interface InventoryListProps {
  crewId: string
}

export function InventoryList({ crewId }: InventoryListProps) {
  const supabase = useSupabase()
  const [rows, setRows] = useState<RenderRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<InventoryFiltersState>(EMPTY_FILTERS)
  // Cached refs for the filter UI:
  const [categoryOptions, setCategoryOptions] = useState<
    { category_id: string; name: string }[]
  >([])
  const [spaceOptions, setSpaceOptions] = useState<
    { space_id: string; label: string }[]
  >([])
  const [spaceChildren, setSpaceChildren] = useState<
    Map<string, Set<string>>
  >(() => new Map())

  useEffect(() => {
    let cancelled = false
    async function load() {
      setError(null)
      const { data: itemData, error: itemErr } = await supabase
        .from('inventory_items')
        .select(
          'inventory_item_id, product_id, current_space_id, home_space_id, quantity, unit, category_id, min_stock, expiry_date, notes',
        )
        .eq('crew_id', crewId)
        .is('deleted_at', null)
      if (cancelled) return
      if (itemErr) {
        setError(itemErr.message ?? 'Failed to load inventory.')
        setRows([])
        return
      }
      const items = (Array.isArray(itemData) ? itemData : []) as InventoryItemRow[]
      if (items.length === 0) {
        setRows([])
        return
      }

      const productIds = Array.from(new Set(items.map((i) => i.product_id)))
      const categoryIds = Array.from(
        new Set(items.map((i) => i.category_id).filter((id): id is string => id !== null)),
      )

      const [productsRes, categoriesRes, spacesRes] = await Promise.all([
        supabase
          .from('products')
          .select('product_id, name, brand, default_category_id')
          .in('product_id', productIds)
          .is('deleted_at', null),
        categoryIds.length > 0
          ? supabase
              .from('categories')
              .select('category_id, name')
              .in('category_id', categoryIds)
              .is('deleted_at', null)
          : Promise.resolve({ data: [], error: null }),
        supabase
          .from('spaces')
          .select('space_id, parent_id, name')
          .eq('crew_id', crewId)
          .is('deleted_at', null),
      ])
      if (cancelled) return

      const products = new Map<string, ProductRow>()
      for (const p of (Array.isArray(productsRes.data)
        ? productsRes.data
        : []) as ProductRow[]) {
        products.set(p.product_id, p)
      }
      // Hydrate the category lookup with both per-item categories and
      // product default categories so badges can show either.
      const allDefaultCategoryIds = Array.from(
        new Set(
          [...products.values()]
            .map((p) => p.default_category_id)
            .filter((id): id is string => id !== null),
        ),
      )
      const missingDefaults = allDefaultCategoryIds.filter(
        (id) => !categoryIds.includes(id),
      )
      let defaultCategoriesData: CategoryRow[] = []
      if (missingDefaults.length > 0) {
        const { data } = await supabase
          .from('categories')
          .select('category_id, name')
          .in('category_id', missingDefaults)
          .is('deleted_at', null)
        if (cancelled) return
        defaultCategoriesData = (Array.isArray(data) ? data : []) as CategoryRow[]
      }

      const categories = new Map<string, CategoryRow>()
      for (const c of (Array.isArray(categoriesRes.data)
        ? categoriesRes.data
        : []) as CategoryRow[]) {
        categories.set(c.category_id, c)
      }
      for (const c of defaultCategoriesData) {
        categories.set(c.category_id, c)
      }

      const spaces = new Map<string, SpaceLite>()
      for (const s of (Array.isArray(spacesRes.data)
        ? spacesRes.data
        : []) as SpaceLite[]) {
        spaces.set(s.space_id, s)
      }

      const today = new Date().toISOString().slice(0, 10)

      const rendered: RenderRow[] = items.map((item) => {
        const product = products.get(item.product_id) ?? {
          product_id: item.product_id,
          name: 'Unknown product',
          brand: null,
          default_category_id: null,
        }
        const effectiveCategoryId =
          item.category_id ?? product.default_category_id
        const categoryName = effectiveCategoryId
          ? (categories.get(effectiveCategoryId)?.name ?? null)
          : null
        const alerts = deriveAlerts({
          quantity: item.quantity,
          min_stock: item.min_stock,
          expiry_date: item.expiry_date,
          current_space_id: item.current_space_id,
          home_space_id: item.home_space_id,
          today,
        })
        return {
          item,
          product,
          categoryName,
          effectiveCategoryId,
          locationPath: buildLocationPath(item.current_space_id, spaces),
          alerts,
          score: alertScore(alerts),
          search: [
            product.name,
            product.brand ?? '',
            categoryName ?? '',
            item.notes ?? '',
          ]
            .join(' ')
            .toLowerCase(),
        }
      })

      rendered.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        return a.product.name.localeCompare(b.product.name)
      })
      setRows(rendered)

      // Build the filter UI's reference data.
      const categoryOpts = Array.from(categories.values())
        .map((c) => ({ category_id: c.category_id, name: c.name }))
        .sort((a, b) => a.name.localeCompare(b.name))
      setCategoryOptions(categoryOpts)

      const usedSpaceIds = new Set(items.map((i) => i.current_space_id))
      const ancestors = new Set<string>()
      for (const id of usedSpaceIds) {
        let cursor = spaces.get(id)
        while (cursor) {
          ancestors.add(cursor.space_id)
          cursor = cursor.parent_id ? spaces.get(cursor.parent_id) : undefined
        }
      }
      const spaceOpts = Array.from(ancestors)
        .map((id) => ({ space_id: id, label: buildLocationPath(id, spaces) }))
        .sort((a, b) => a.label.localeCompare(b.label))
      setSpaceOptions(spaceOpts)

      // Pre-compute "descendants" for each space so the include-children
      // toggle is O(1) at filter time.
      const childrenIndex = new Map<string, string[]>()
      for (const s of spaces.values()) {
        if (s.parent_id) {
          const arr = childrenIndex.get(s.parent_id) ?? []
          arr.push(s.space_id)
          childrenIndex.set(s.parent_id, arr)
        }
      }
      const descendants = new Map<string, Set<string>>()
      for (const s of spaces.values()) {
        const set = new Set<string>([s.space_id])
        const queue = [s.space_id]
        while (queue.length) {
          const id = queue.shift()!
          for (const c of childrenIndex.get(id) ?? []) {
            if (!set.has(c)) {
              set.add(c)
              queue.push(c)
            }
          }
        }
        descendants.set(s.space_id, set)
      }
      setSpaceChildren(descendants)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [supabase, crewId])

  const filtered = useMemo(() => {
    const all = rows ?? []
    const q = filters.query.trim().toLowerCase()
    const allowedSpaces =
      filters.spaceId === ''
        ? null
        : filters.spaceIncludeChildren
          ? (spaceChildren.get(filters.spaceId) ?? new Set([filters.spaceId]))
          : new Set([filters.spaceId])
    return all.filter((row) => {
      if (q && !row.search.includes(q)) return false
      if (
        filters.categoryIds.size > 0 &&
        (!row.effectiveCategoryId ||
          !filters.categoryIds.has(row.effectiveCategoryId))
      ) {
        return false
      }
      if (
        allowedSpaces &&
        !allowedSpaces.has(row.item.current_space_id)
      ) {
        return false
      }
      if (filters.alerts.size > 0) {
        const hit = row.alerts.some((a) => filters.alerts.has(a))
        if (!hit) return false
      }
      return true
    })
  }, [rows, filters, spaceChildren])

  if (error) {
    return (
      <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
        {error}
      </p>
    )
  }

  if (rows === null) {
    return <p className="font-body text-sm text-ink-600">Loading inventory…</p>
  }

  if (rows.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <InventoryFilters
        state={filters}
        onChange={setFilters}
        categories={categoryOptions}
        spaces={spaceOptions}
      />
      {filtered.length === 0 ? (
        <p className="rounded-2xl bg-paper-100 p-4 font-body text-sm text-ink-600">
          No items match your filters.
        </p>
      ) : (
        <ul aria-label="Inventory items" className="flex flex-col gap-2">
          {filtered.map((row) => (
            <li key={row.item.inventory_item_id}>
              <InventoryRow row={row} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface InventoryRowProps {
  row: RenderRow
}

function InventoryRow({ row }: InventoryRowProps) {
  const { item, product, categoryName, locationPath, alerts } = row
  return (
    <article
      className="flex items-start gap-3 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm"
      data-alert-score={row.score}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="font-display text-base font-bold text-ink-900">
          {product.name}
          {product.brand && (
            <span className="ml-1 font-body text-sm font-normal text-ink-600">
              · {product.brand}
            </span>
          )}
        </h3>
        <p className="font-body text-sm text-ink-700">
          <span className="font-numeric font-semibold">
            {item.quantity}
          </span>{' '}
          {item.unit}
          {locationPath && (
            <>
              <span className="mx-1.5 text-ink-400">·</span>
              <span className="text-ink-600">{locationPath}</span>
            </>
          )}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
          {categoryName && (
            <Chip variant="default">{categoryName}</Chip>
          )}
          {alerts.map((alert) => (
            <Chip key={alert} variant={chipVariantFor(alert)}>
              {ALERT_LABEL[alert]}
            </Chip>
          ))}
        </div>
      </div>
    </article>
  )
}

function chipVariantFor(alert: InventoryAlert): 'warn' | 'error' | 'default' {
  if (alert === 'out_of_stock' || alert === 'expired') return 'error'
  if (alert === 'low_stock' || alert === 'expiring_soon') return 'warn'
  return 'default'
}

function buildLocationPath(
  spaceId: string,
  spaces: Map<string, SpaceLite>,
): string {
  const parts: string[] = []
  let cursor: SpaceLite | undefined = spaces.get(spaceId)
  let depth = 0
  while (cursor && depth < 10) {
    parts.unshift(cursor.name)
    cursor = cursor.parent_id ? spaces.get(cursor.parent_id) : undefined
    depth++
  }
  return parts.join(' › ')
}
