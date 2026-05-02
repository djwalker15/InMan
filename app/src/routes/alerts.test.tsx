import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import AlertsPage from './alerts'

const items = [
  {
    inventory_item_id: 'i_out',
    product_id: 'p1',
    current_space_id: 's_a',
    home_space_id: null,
    quantity: 0,
    unit: 'count',
    category_id: null,
    min_stock: 1,
    expiry_date: null,
  },
  {
    inventory_item_id: 'i_low',
    product_id: 'p2',
    current_space_id: 's_a',
    home_space_id: 's_a',
    quantity: 1,
    unit: 'count',
    category_id: null,
    min_stock: 5,
    expiry_date: null,
  },
]

const products = [
  { product_id: 'p1', name: 'Tomato Paste', brand: null },
  { product_id: 'p2', name: 'Olive Oil', brand: null },
]

const spaces = [
  { space_id: 's_p', parent_id: null, name: 'My House' },
  { space_id: 's_a', parent_id: 's_p', name: 'Kitchen' },
]

describe('AlertsPage', () => {
  it('shows the all-caught-up state when no items have alerts', async () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({
      crew_members: {
        maybeSingle: { data: { crew_id: 'crew_abc' }, error: null },
      },
      inventory_items: { select: { data: [], error: null } },
    })
    renderWithRouter(<AlertsPage />)
    await waitFor(() => {
      expect(screen.getByText(/all caught up/i)).toBeInTheDocument()
    })
  })

  it('groups items by alert and shows counts per group', async () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({
      crew_members: {
        maybeSingle: { data: { crew_id: 'crew_abc' }, error: null },
      },
      inventory_items: { select: { data: items, error: null } },
      products: { select: { data: products, error: null } },
      spaces: { select: { data: spaces, error: null } },
    })
    renderWithRouter(<AlertsPage />)
    await waitFor(() => {
      expect(
        screen.getByRole('region', { name: /out of stock \(1\)/i }),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('region', { name: /low stock \(1\)/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tomato Paste')).toBeInTheDocument()
    expect(screen.getByText('Olive Oil')).toBeInTheDocument()
  })

  it('focuses on the requested alert when ?focus= is set', async () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({
      crew_members: {
        maybeSingle: { data: { crew_id: 'crew_abc' }, error: null },
      },
      inventory_items: { select: { data: items, error: null } },
      products: { select: { data: products, error: null } },
      spaces: { select: { data: spaces, error: null } },
    })
    renderWithRouter(<AlertsPage />, { route: '/alerts?focus=low_stock' })
    await waitFor(() => {
      expect(
        screen.getByRole('region', { name: /low stock \(1\)/i }),
      ).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('region', { name: /out of stock/i }),
    ).toBeNull()
    expect(
      screen.getByRole('link', { name: /show all alert groups/i }),
    ).toBeInTheDocument()
  })
})
