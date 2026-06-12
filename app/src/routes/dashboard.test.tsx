import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import DashboardPage from './dashboard'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('DashboardPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  it('queries crew_members via useActiveCrew (joined select, deleted_at IS NULL)', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    const sb = makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })

    renderWithRouter(<DashboardPage />)

    await waitFor(() => {
      expect(sb.from).toHaveBeenCalledWith('crew_members')
    })
    expect(sb.tables.crew_members.select).toHaveBeenCalledWith(
      'crew_id, role, crews(name, owner_id)',
    )
    expect(sb.tables.crew_members.is).toHaveBeenCalledWith('deleted_at', null)
  })

  it('marks "Create your Crew" complete (line-through) when user has a membership', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'admin',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { count: 0, error: null } },
      inventory_items: { select: { count: 0, error: null } },
      invites: { select: { count: 0, error: null } },
    })

    renderWithRouter(<DashboardPage />)

    const label = await screen.findByText('Create your Crew')
    await waitFor(() => {
      expect(label).toHaveClass('line-through')
    })
  })

  it('does not mark crew row complete when there is no membership', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })

    renderWithRouter(<DashboardPage />)
    const label = await screen.findByText('Create your Crew')
    expect(label).not.toHaveClass('line-through')
  })

  it('renders the user firstName in the welcome heading', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })

    renderWithRouter(<DashboardPage />)
    expect(
      await screen.findByRole('heading', { name: /welcome, davontae/i }),
    ).toBeInTheDocument()
  })

  it('falls back to "there" when no firstName or username is set', async () => {
    mockClerk({
      user: { id: 'user_1', firstName: null, username: null },
    })
    makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })

    renderWithRouter(<DashboardPage />)
    expect(
      await screen.findByRole('heading', { name: /welcome, there/i }),
    ).toBeInTheDocument()
  })

  it('Path A: renders 5-item checklist with only Sign Up + Crew complete for a fresh owner account', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'admin',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { count: 1, error: null } },
      inventory_items: { select: { count: 0, error: null } },
      invites: { select: { count: 0, error: null } },
    })

    renderWithRouter(<DashboardPage />)

    // All 5 Path A labels are present
    expect(await screen.findByText('Sign Up')).toBeInTheDocument()
    expect(screen.getByText('Create your Crew')).toBeInTheDocument()
    expect(screen.getByText('Set up spaces')).toBeInTheDocument()
    expect(screen.getByText('Add first items')).toBeInTheDocument()
    expect(screen.getByText('Invite crew members')).toBeInTheDocument()

    // No Path B-only label
    expect(screen.queryByText(/^Joined /i)).not.toBeInTheDocument()

    // Sign Up + Create your Crew are complete (line-through)
    await waitFor(() => {
      expect(screen.getByText('Sign Up')).toHaveClass('line-through')
      expect(screen.getByText('Create your Crew')).toHaveClass('line-through')
    })

    // Remaining three are incomplete
    expect(screen.getByText('Set up spaces')).not.toHaveClass('line-through')
    expect(screen.getByText('Add first items')).not.toHaveClass('line-through')
    expect(screen.getByText('Invite crew members')).not.toHaveClass('line-through')
  })

  it('renders no checklist block for an invited (non-admin) member', async () => {
    mockClerk({ user: { id: 'user_2', firstName: 'Alex' } })
    const sb = makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'member',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
    })

    renderWithRouter(<DashboardPage />)

    await screen.findByRole('heading', { name: /welcome, alex/i })
    await waitFor(() => {
      expect(sb.from).toHaveBeenCalledWith('crew_members')
    })

    expect(screen.queryByText('Setup Progress')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
    expect(screen.queryByText('Finish setup')).not.toBeInTheDocument()

    // The checklist count queries are skipped for members. (spaces /
    // inventory_items may still be hit by the alerts widget, so assert on
    // the checklist-specific call shapes instead.)
    expect(sb.from).not.toHaveBeenCalledWith('invites')
    if (sb.tables.spaces) {
      expect(sb.tables.spaces.select).not.toHaveBeenCalledWith('space_id', {
        count: 'exact',
        head: true,
      })
    }
  })

  it('auto-hides the checklist (and slim row) once every step is complete', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    const sb = makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'admin',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { count: 2, error: null } },
      inventory_items: { select: { count: 1, error: null } },
      invites: { select: { count: 1, error: null } },
    })

    renderWithRouter(<DashboardPage />)

    await screen.findByRole('heading', { name: /welcome, davontae/i })
    await waitFor(() => {
      expect(sb.from).toHaveBeenCalledWith('invites')
    })

    expect(screen.queryByText('Setup Progress')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument()
    expect(screen.queryByText('Finish setup')).not.toBeInTheDocument()
  })

  it('dismissing the block swaps in the slim "Finish setup" resume row', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'admin',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { count: 1, error: null } },
      inventory_items: { select: { count: 0, error: null } },
      invites: { select: { count: 0, error: null } },
    })

    renderWithRouter(<DashboardPage />)

    const dismiss = await screen.findByRole('button', {
      name: 'Dismiss setup checklist',
    })
    await userEvent.click(dismiss)

    expect(screen.queryByText('Setup Progress')).not.toBeInTheDocument()
    expect(screen.getByText('Finish setup')).toBeInTheDocument()
    // Resume still points at the next incomplete step (spaces).
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      '/onboarding/spaces',
    )
    // Persisted per user + crew.
    expect(
      JSON.parse(
        localStorage.getItem('inman:onboarding-checklist:user_1:crew_1') ??
          '{}',
      ),
    ).toMatchObject({ dismissed: true })
  })

  it('renders the slim row on first paint when dismissal is already stored', async () => {
    localStorage.setItem(
      'inman:onboarding-checklist:user_1:crew_1',
      JSON.stringify({ dismissed: true, cleared: [] }),
    )
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'admin',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { count: 1, error: null } },
      inventory_items: { select: { count: 0, error: null } },
      invites: { select: { count: 0, error: null } },
    })

    renderWithRouter(<DashboardPage />)

    expect(await screen.findByText('Finish setup')).toBeInTheDocument()
    expect(screen.queryByText('Setup Progress')).not.toBeInTheDocument()
  })

  it('clearing a completed item removes it from the list but keeps the full counter', async () => {
    mockClerk({ user: { id: 'user_1', firstName: 'Davontae' } })
    makeSupabaseMock({
      crew_members: {
        select: {
          data: [
            {
              crew_id: 'crew_1',
              role: 'admin',
              crews: { name: 'Walker Home', owner_id: 'user_1' },
            },
          ],
          error: null,
        },
      },
      spaces: { select: { count: 1, error: null } },
      inventory_items: { select: { count: 0, error: null } },
      invites: { select: { count: 0, error: null } },
    })

    renderWithRouter(<DashboardPage />)

    const clearCrew = await screen.findByRole('button', {
      name: 'Clear Create your Crew',
    })
    await userEvent.click(clearCrew)

    expect(screen.queryByText('Create your Crew')).not.toBeInTheDocument()
    // Counter stays computed over the full step set, and the block remains.
    expect(screen.getByText('2/5 Complete')).toBeInTheDocument()
    expect(screen.getByText('Setup Progress')).toBeInTheDocument()
    expect(
      JSON.parse(
        localStorage.getItem('inman:onboarding-checklist:user_1:crew_1') ??
          '{}',
      ).cleared,
    ).toContain('crew')
  })
})
