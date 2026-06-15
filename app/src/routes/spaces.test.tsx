import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import SpacesPage from './spaces'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('SpacesPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockClerk({ user: { id: 'user_1', firstName: 'Test' } })
    // Reset the persisted view choice so each test starts on the default (cards).
    localStorage.clear()
  })

  it('renders the Spaces title', () => {
    makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })
    renderWithRouter(<SpacesPage />)
    expect(
      screen.getByRole('heading', { name: /^spaces$/i }),
    ).toBeInTheDocument()
  })

  it('shows the empty state with a link to /onboarding/spaces when no premises exist', async () => {
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_abc',
              role: 'admin',
              crews: { name: 'Test', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { data: [], error: null } },
    })
    renderWithRouter(<SpacesPage />)
    await waitFor(() => {
      expect(screen.getByText(/no spaces yet/i)).toBeInTheDocument()
    })
    const link = screen.getByRole('link', { name: /set up spaces/i })
    expect(link).toHaveAttribute('href', '/onboarding/spaces')
  })

  it('defaults to the scoped card drill-down, with a toggle to the tree', async () => {
    const rows = [
      {
        space_id: 'p',
        parent_id: null,
        unit_type: 'premises',
        name: 'My House',
        deleted_at: null,
      },
      {
        space_id: 'a',
        parent_id: 'p',
        unit_type: 'area',
        name: 'Kitchen',
        deleted_at: null,
      },
    ]
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_abc',
              role: 'admin',
              crews: { name: 'Test', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { data: rows, error: null } },
      inventory_items: { select: { data: [], error: null } },
    })
    renderWithRouter(<SpacesPage />)
    // Default view: the premises shows as a card; nested rows stay collapsed.
    await waitFor(() => {
      expect(screen.getByText('My House')).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'Spaces' })).toBeInTheDocument()
    expect(screen.queryByText('Kitchen')).toBeNull()
    expect(
      screen.queryByRole('list', { name: /editable spaces tree/i }),
    ).toBeNull()

    // Toggling to Tree view reveals the always-expanded editable tree.
    fireEvent.click(screen.getByRole('button', { name: /^tree$/i }))
    expect(
      screen.getByRole('list', { name: /editable spaces tree/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
  })

  it('clicking Reorganize swaps the drill-down for the reorganize-mode shell', async () => {
    const rows = [
      {
        space_id: 'p',
        parent_id: null,
        unit_type: 'premises',
        name: 'My House',
        deleted_at: null,
      },
      {
        space_id: 'a',
        parent_id: 'p',
        unit_type: 'area',
        name: 'Kitchen',
        deleted_at: null,
      },
    ]
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_abc',
              role: 'admin',
              crews: { name: 'Test', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { data: rows, error: null } },
      inventory_items: { select: { data: [], error: null } },
    })
    renderWithRouter(<SpacesPage />)
    await waitFor(() => {
      expect(screen.getByText('My House')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /^reorganize$/i }))
    // The reorganize shell shows up, the browser drops out.
    expect(screen.getByLabelText(/reorganize spaces/i)).toBeInTheDocument()
    // Done returns to the default card drill-down.
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }))
    expect(screen.queryByLabelText(/reorganize spaces/i)).toBeNull()
    expect(screen.getByText('My House')).toBeInTheDocument()
  })

  it('Reorganize is disabled until a non-Premises space exists', async () => {
    const rows = [
      {
        space_id: 'p',
        parent_id: null,
        unit_type: 'premises',
        name: 'My House',
        deleted_at: null,
      },
    ]
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_abc',
              role: 'admin',
              crews: { name: 'Test', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { data: rows, error: null } },
      inventory_items: { select: { data: [], error: null } },
    })
    renderWithRouter(<SpacesPage />)
    await waitFor(() => {
      expect(screen.getByText('My House')).toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: /^reorganize$/i }),
    ).toBeDisabled()
  })
})
