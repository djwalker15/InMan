import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { InventoryFilters } from './inventory-filters'
import {
  EMPTY_FILTERS,
  type InventoryFiltersState,
} from './inventory-filters-state'

const categories = [
  { category_id: 'c1', name: 'Spices' },
  { category_id: 'c2', name: 'Pantry' },
]

const spaces = [
  { space_id: 's_a', label: 'My House › Kitchen' },
  { space_id: 's_b', label: 'My House › Bar' },
]

describe('InventoryFilters', () => {
  it('fires onChange with the new query as the user types', () => {
    const onChange = vi.fn()
    render(
      <InventoryFilters
        state={EMPTY_FILTERS}
        onChange={onChange}
        categories={categories}
        spaces={spaces}
      />,
    )
    fireEvent.change(screen.getByLabelText(/search inventory/i), {
      target: { value: 'cinn' },
    })
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'cinn' }),
    )
  })

  it('toggles a category chip on click', () => {
    const onChange = vi.fn()
    render(
      <InventoryFilters
        state={EMPTY_FILTERS}
        onChange={onChange}
        categories={categories}
        spaces={spaces}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Spices' }))
    const next: InventoryFiltersState = onChange.mock.calls[0][0]
    expect(next.categoryIds.has('c1')).toBe(true)
  })

  it('toggles an alert chip on click', () => {
    const onChange = vi.fn()
    render(
      <InventoryFilters
        state={EMPTY_FILTERS}
        onChange={onChange}
        categories={categories}
        spaces={spaces}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /low stock/i }))
    const next: InventoryFiltersState = onChange.mock.calls[0][0]
    expect(next.alerts.has('low_stock')).toBe(true)
  })

  it('selecting a space sets spaceId and enables the include-children toggle', () => {
    const onChange = vi.fn()
    render(
      <InventoryFilters
        state={EMPTY_FILTERS}
        onChange={onChange}
        categories={categories}
        spaces={spaces}
      />,
    )
    fireEvent.change(screen.getByLabelText(/filter by space/i), {
      target: { value: 's_a' },
    })
    const next: InventoryFiltersState = onChange.mock.calls[0][0]
    expect(next.spaceId).toBe('s_a')
    expect(next.spaceIncludeChildren).toBe(true)
  })

  it('shows Clear all when any filter is active and resets to EMPTY', () => {
    const onChange = vi.fn()
    const active: InventoryFiltersState = {
      ...EMPTY_FILTERS,
      query: 'tom',
    }
    render(
      <InventoryFilters
        state={active}
        onChange={onChange}
        categories={categories}
        spaces={spaces}
      />,
    )
    const clear = screen.getByRole('button', { name: /clear all filters/i })
    fireEvent.click(clear)
    expect(onChange).toHaveBeenCalledWith(EMPTY_FILTERS)
  })

  it('does not show Clear all when filters are empty', () => {
    render(
      <InventoryFilters
        state={EMPTY_FILTERS}
        onChange={() => {}}
        categories={categories}
        spaces={spaces}
      />,
    )
    expect(
      screen.queryByRole('button', { name: /clear all filters/i }),
    ).toBeNull()
  })
})
