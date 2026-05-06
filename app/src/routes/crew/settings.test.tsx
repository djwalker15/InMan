import { describe, expect, it, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import CrewSettingsPage from './settings'

/**
 * One shared `crew_members` mock payload services both:
 *   1. useActiveCrew → reads { crew_id, role, crews: {name, owner_id} }
 *   2. The Members tab → reads { crew_member_id, user_id, role, created_at }
 * Each row carries enough columns for both consumers.
 */
const memberRows = [
  {
    crew_member_id: 'cm_1',
    crew_id: 'crew_a',
    user_id: 'user_1',
    role: 'admin',
    created_at: '2026-03-14T15:00:00Z',
    crews: { name: 'Walker Home', owner_id: 'user_1' },
  },
  {
    crew_member_id: 'cm_2',
    crew_id: 'crew_a',
    user_id: 'user_friend_2abc99',
    role: 'member',
    created_at: '2026-03-22T10:00:00Z',
    crews: { name: 'Walker Home', owner_id: 'user_1' },
  },
]

const crewARow = {
  crew_id: 'crew_a',
  name: 'Walker Home',
  owner_id: 'user_1',
  created_at: '2026-03-14T15:00:00Z',
  settings: {},
  deletion_requested_at: null,
}

const pendingInvite = {
  invite_id: 'inv_1',
  email: 'aunt.dee@example.com',
  role: 'member',
  status: 'pending',
  created_at: '2026-04-30T10:00:00Z',
  expires_at: '2026-05-07T10:00:00Z',
}

beforeEach(() => {
  localStorage.clear()
})

function setupSupabase(
  overrides: { invites?: unknown[]; members?: unknown[] } = {},
) {
  return makeSupabaseMock({
    crew_members: {
      select: { data: overrides.members ?? memberRows, error: null },
    },
    crews: {
      maybeSingle: { data: crewARow, error: null },
    },
    invites: {
      select: { data: overrides.invites ?? [], error: null },
    },
  })
}

describe('CrewSettingsPage', () => {
  it('redirects to /crews when the user is not a member of any crew', async () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    // useActiveCrew resolves with no memberships → <Navigate to="/crews" />
    // unmounts the page; the "Crew settings" heading is never rendered.
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /crew settings/i }),
      ).toBeNull()
    })
  })

  it('renders the hero and tab nav with the active crew', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: /walker home/i }),
      ).toBeInTheDocument()
    })
    expect(screen.getByRole('tab', { name: /^general$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^members$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /^permissions$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /danger zone/i }),
    ).toBeInTheDocument()
  })

  it('General tab is selected by default and shows crew detail cards', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: /walker home/i }),
      ).toBeInTheDocument()
    })
    const general = screen.getByRole('tab', { name: /^general$/i })
    expect(general).toHaveAttribute('aria-selected', 'true')
    const panel = screen.getByRole('tabpanel', { name: /general/i })
    expect(within(panel).getByText('Crew name')).toBeInTheDocument()
    expect(within(panel).getByText('Your role')).toBeInTheDocument()
  })

  it('Members tab marks the current user as You and lists the others', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    const list = screen.getByLabelText(/active members/i)
    expect(within(list).getByText(/^you$/i)).toBeInTheDocument()
    expect(within(list).getByText(/2abc99/)).toBeInTheDocument()
    expect(within(list).getByText(/^owner$/i)).toBeInTheDocument()
    expect(within(list).getByText(/^member$/i)).toBeInTheDocument()
  })

  it('Members tab shows pending invites when present', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase({ invites: [pendingInvite] })
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/pending invites/i)).toBeInTheDocument()
    })
    expect(
      within(screen.getByLabelText(/pending invites/i)).getByText(
        /aunt\.dee@example\.com/i,
      ),
    ).toBeInTheDocument()
  })

  it('Permissions tab shows the P5.5 placeholder', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=permissions',
    })
    await waitFor(() => {
      expect(screen.getByText(/coming with p5\.5/i)).toBeInTheDocument()
    })
  })

  it('Danger zone tab shows the P5.6 placeholder', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=danger',
    })
    await waitFor(() => {
      expect(screen.getByText(/coming with p5\.6/i)).toBeInTheDocument()
    })
  })

  it('clicking a tab updates aria-selected and swaps the panel', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: /walker home/i }),
      ).toBeInTheDocument()
    })
    const membersTab = screen.getByRole('tab', { name: /^members$/i })
    expect(membersTab).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(membersTab)
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    expect(membersTab).toHaveAttribute('aria-selected', 'true')
  })
})
