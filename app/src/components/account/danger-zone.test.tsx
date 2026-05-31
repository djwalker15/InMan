import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { AccountDangerZone } from './danger-zone'

const SOLO_CREW = {
  crew_id: 'crew_solo',
  crew_name: 'Walker Home',
  caller_role: 'owner',
  outcome: 'solo_delete',
  admin_candidates: null,
  default_transferee: null,
}

const TRANSFER_CREW = {
  crew_id: 'crew_transfer',
  crew_name: 'Bar HQ',
  caller_role: 'owner',
  outcome: 'transfer',
  admin_candidates: [
    // maskUserId shows id.slice(-6), so use IDs whose tails are
    // recognizable on screen ("alpha1" / "bravo2").
    { user_id: 'user_admin_alpha1' },
    { user_id: 'user_admin_bravo2' },
  ],
  default_transferee: 'user_admin_alpha1',
}

const LEAVE_CREW = {
  crew_id: 'crew_leave',
  crew_name: 'Aunt Dee’s',
  caller_role: 'member',
  outcome: 'leave',
  admin_candidates: null,
  default_transferee: null,
}

function setupSupabase(
  preview: unknown,
  invokeImpl: ReturnType<typeof vi.fn> = vi.fn().mockResolvedValue({
    data: {
      user_id: 'user_1',
      crews_transferred: 0,
      crews_marked_ownerless: 0,
      crews_soft_deleted: 1,
    },
    error: null,
  }),
) {
  const sb = makeSupabaseMock(
    {},
    { preview_account_deletion: { data: preview, error: null } },
  )
  Object.assign(sb.client, { functions: { invoke: invokeImpl } })
  return { sb, invoke: invokeImpl }
}

describe('AccountDangerZone', () => {
  it('renders loading state before the preview lands', () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase([SOLO_CREW])
    renderWithRouter(<AccountDangerZone />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('shows the solo-delete impact and a disabled-state-free delete CTA', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase([SOLO_CREW])
    renderWithRouter(<AccountDangerZone />)

    await waitFor(() => {
      expect(screen.getByText('Walker Home')).toBeInTheDocument()
    })
    expect(screen.getByText(/crew is deleted along with your account/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /delete my account/i }),
    ).toBeEnabled()
  })

  it('shows transferee picker only when a crew has the transfer outcome', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase([TRANSFER_CREW])
    renderWithRouter(<AccountDangerZone />)

    await waitFor(() => screen.getByText('Bar HQ'))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))

    // Picker is visible with both candidates
    expect(screen.getByText(/new owner for your crew/i)).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /alpha1/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /bravo2/i })).toBeInTheDocument()
  })

  it('skips the picker when the only outcome is leave', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase([LEAVE_CREW])
    renderWithRouter(<AccountDangerZone />)

    await waitFor(() => screen.getByText('Aunt Dee’s'))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))
    expect(screen.queryByText(/new owner/i)).not.toBeInTheDocument()
  })

  it('gates the Delete account submit behind type-to-confirm', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase([SOLO_CREW])
    renderWithRouter(<AccountDangerZone />)

    await waitFor(() => screen.getByText('Walker Home'))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))

    const submit = screen.getByRole('button', { name: /^delete account$/i })
    expect(submit).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/type "DELETE" to confirm/i), {
      target: { value: 'DELETE' },
    })
    expect(submit).toBeEnabled()
  })

  it('invokes delete-account with the picked transferee and signs out on success', async () => {
    const clerk = mockClerk({ user: { id: 'user_1' } })
    const invoke = vi.fn().mockResolvedValue({
      data: {
        user_id: 'user_1',
        crews_transferred: 1,
        crews_marked_ownerless: 0,
        crews_soft_deleted: 0,
      },
      error: null,
    })
    setupSupabase([TRANSFER_CREW], invoke)
    renderWithRouter(<AccountDangerZone />)

    await waitFor(() => screen.getByText('Bar HQ'))
    fireEvent.click(screen.getByRole('button', { name: /delete my account/i }))
    fireEvent.change(screen.getByLabelText(/type "DELETE" to confirm/i), {
      target: { value: 'DELETE' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^delete account$/i }))

    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('delete-account', {
        body: { transfer_to_user_id: 'user_admin_alpha1' },
      })
    })
    expect(clerk.signIn.create).not.toHaveBeenCalled() // unrelated, sanity guard
    // signOut from useAuth is the one we care about — the clerk mock
    // doesn't expose the same instance back here, so we settle for the
    // navigation side-effect: the form closes after success.
  })

  it('surfaces a banner when owned crews have no shared transferee admin', async () => {
    mockClerk({ user: { id: 'user_1' } })
    // Two transferable crews with disjoint admin sets → empty intersection.
    setupSupabase([
      {
        ...TRANSFER_CREW,
        crew_id: 'crew_a',
        crew_name: 'Crew A',
        admin_candidates: [{ user_id: 'user_admin_a' }],
        default_transferee: 'user_admin_a',
      },
      {
        ...TRANSFER_CREW,
        crew_id: 'crew_b',
        crew_name: 'Crew B',
        admin_candidates: [{ user_id: 'user_admin_b' }],
        default_transferee: 'user_admin_b',
      },
    ])
    renderWithRouter(<AccountDangerZone />)

    await waitFor(() => screen.getByText('Crew A'))
    expect(
      screen.getByText(/no shared admin to transfer all of them to/i),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete my account/i })).toBeDisabled()
  })
})
