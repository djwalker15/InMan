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

  it('renders the editor when premises + child rows exist', async () => {
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
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(
      screen.getByRole('list', { name: /editable spaces tree/i }),
    ).toBeInTheDocument()
  })

  it('clicking Reorganize swaps the editor for the reorganize-mode shell', async () => {
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
    // The reorganize shell shows up, the editable tree drops out.
    expect(
      screen.getByLabelText(/reorganize spaces/i),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('list', { name: /editable spaces tree/i }),
    ).toBeNull()
    // Done returns to the regular tree editor.
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }))
    expect(
      screen.getByRole('list', { name: /editable spaces tree/i }),
    ).toBeInTheDocument()
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
