import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { PermissionsGrid } from './permissions-grid'

describe('PermissionsGrid', () => {
  it('starts disabled and renders feature defaults for the role', () => {
    makeSupabaseMock({})
    renderWithRouter(
      <PermissionsGrid
        crewMemberId="cm_2"
        memberRole="member"
        initialOverrides={{}}
        memberDisplayName="Member · abc"
        onSaved={() => {}}
      />,
    )
    // Save is disabled when no override has changed.
    expect(
      screen.getByRole('button', { name: /save permissions/i }),
    ).toBeDisabled()
    // Three of the four Member-role defaults are "allow" — confirms the
    // role-default labels render (rather than overriden labels).
    expect(screen.getAllByText(/^default — allow$/i)).toHaveLength(3)
    expect(screen.getByText(/^default — deny$/i)).toBeInTheDocument()
  })

  it('saves overrides via the set_member_permissions RPC', async () => {
    const sb = makeSupabaseMock(
      {},
      { set_member_permissions: { error: null } },
    )
    const onSaved = vi.fn()
    renderWithRouter(
      <PermissionsGrid
        crewMemberId="cm_2"
        memberRole="member"
        initialOverrides={{}}
        memberDisplayName="Member · abc"
        onSaved={onSaved}
      />,
    )
    // Find the radio for "Manage spaces — Deny".
    const manageSpaces = screen.getByLabelText(/manage spaces access/i)
    const denyOption = within(manageSpaces).getByRole('radio', {
      name: /^deny$/i,
    })
    fireEvent.click(denyOption)
    // Save is enabled now.
    const save = screen.getByRole('button', { name: /save permissions/i })
    expect(save).toBeEnabled()
    fireEvent.click(save)
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('set_member_permissions', {
        p_crew_member_id: 'cm_2',
        p_overrides: { manage_spaces: 'deny' },
      })
    })
    expect(onSaved).toHaveBeenCalled()
  })

  it('Reset button reverts to the saved overrides', () => {
    makeSupabaseMock({})
    renderWithRouter(
      <PermissionsGrid
        crewMemberId="cm_2"
        memberRole="member"
        initialOverrides={{ edit_inventory: 'deny' }}
        memberDisplayName="Member · abc"
        onSaved={() => {}}
      />,
    )
    const editInventory = screen.getByLabelText(/edit inventory access/i)
    const allowOption = within(editInventory).getByRole('radio', {
      name: /^allow$/i,
    })
    fireEvent.click(allowOption)
    expect(allowOption).toBeChecked()
    fireEvent.click(screen.getByRole('button', { name: /reset/i }))
    // Back to deny.
    const denyOption = within(editInventory).getByRole('radio', {
      name: /^deny$/i,
    })
    expect(denyOption).toBeChecked()
  })

  it('surfaces a server error inline', async () => {
    makeSupabaseMock(
      {},
      {
        set_member_permissions: {
          error: new Error('not authorized'),
        },
      },
    )
    renderWithRouter(
      <PermissionsGrid
        crewMemberId="cm_2"
        memberRole="member"
        initialOverrides={{}}
        memberDisplayName="Member · abc"
        onSaved={() => {}}
      />,
    )
    const editInventory = screen.getByLabelText(/edit inventory access/i)
    fireEvent.click(
      within(editInventory).getByRole('radio', { name: /^deny$/i }),
    )
    fireEvent.click(screen.getByRole('button', { name: /save permissions/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/not authorized/i)
    })
  })
})
