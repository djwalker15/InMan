import { describe, expect, it, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import InventoryPage from './inventory'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('InventoryPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockClerk({ user: { id: 'user_1' } })
  })

  it('renders the Inventory heading', () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<InventoryPage />)
    expect(
      screen.getByRole('heading', { name: /^inventory$/i }),
    ).toBeInTheDocument()
  })

  it('shows the empty state with an Add-item CTA when crew has zero items', async () => {
    makeSupabaseMock({
      crew_members: {
        maybeSingle: { data: { crew_id: 'crew_abc' }, error: null },
      },
      inventory_items: { select: { count: 0, error: null } },
    })
    renderWithRouter(<InventoryPage />)
    await waitFor(() => {
      expect(screen.getByText(/your inventory is empty/i)).toBeInTheDocument()
    })
    const link = screen.getByRole('link', { name: /add an item/i })
    expect(link).toHaveAttribute('href', '/inventory/add')
  })

  it('routes the empty CTA to onboarding when there is no crew yet', async () => {
    makeSupabaseMock({
      crew_members: { maybeSingle: { data: null, error: null } },
    })
    renderWithRouter(<InventoryPage />)
    await waitFor(() => {
      expect(
        screen.getByText(/your inventory is empty/i),
      ).toBeInTheDocument()
    })
    const link = screen.getByRole('link', { name: /finish onboarding first/i })
    expect(link).toHaveAttribute('href', '/onboarding')
  })

  it('renders the InventoryList with the Add CTA when items exist', async () => {
    makeSupabaseMock({
      crew_members: {
        maybeSingle: { data: { crew_id: 'crew_abc' }, error: null },
      },
      // The page itself uses { count }; the list pulls real rows. Provide
      // both — count drives the empty-vs-list branch, data drives the list.
      inventory_items: {
        select: {
          count: 1,
          data: [
            {
              inventory_item_id: 'i1',
              product_id: 'p1',
              current_space_id: 's_a',
              home_space_id: null,
              quantity: 2,
              unit: 'count',
              category_id: null,
              min_stock: null,
              expiry_date: null,
            },
          ],
          error: null,
        },
      },
      products: {
        select: {
          data: [
            {
              product_id: 'p1',
              name: 'Tomato Paste',
              brand: null,
              default_category_id: null,
            },
          ],
          error: null,
        },
      },
      categories: { select: { data: [], error: null } },
      spaces: {
        select: {
          data: [
            { space_id: 's_p', parent_id: null, name: 'My House' },
            { space_id: 's_a', parent_id: 's_p', name: 'Kitchen' },
          ],
          error: null,
        },
      },
    })
    renderWithRouter(<InventoryPage />)
    await waitFor(() => {
      expect(screen.getByText('Tomato Paste')).toBeInTheDocument()
    })
    // The header CTA shows once items exist.
    expect(screen.getByLabelText(/add item/i)).toBeInTheDocument()
    expect(
      screen.getByRole('list', { name: /inventory items/i }),
    ).toBeInTheDocument()
  })

  it('shows the load error when the inventory query fails', async () => {
    makeSupabaseMock({
      crew_members: {
        maybeSingle: { data: { crew_id: 'crew_abc' }, error: null },
      },
      inventory_items: {
        select: { count: null, error: new Error('boom') },
      },
    })
    renderWithRouter(<InventoryPage />)
    await waitFor(() => {
      expect(screen.getByText('boom')).toBeInTheDocument()
    })
  })
})
