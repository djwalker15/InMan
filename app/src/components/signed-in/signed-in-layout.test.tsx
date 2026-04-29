import { describe, expect, it } from 'vitest'
import { fireEvent, screen, within } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { SignedInLayout } from './signed-in-layout'

function openSidenav() {
  fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
  return screen.getByRole('dialog', { name: /inman navigation/i })
}

describe('SignedInLayout', () => {
  it('renders children inside the main region', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p data-testid="child">hello</p>
      </SignedInLayout>,
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('Sidenav is closed by default and the menu button opens it', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p>x</p>
      </SignedInLayout>,
    )
    expect(
      screen.queryByRole('dialog', { name: /inman navigation/i }),
    ).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(
      screen.getByRole('dialog', { name: /inman navigation/i }),
    ).toBeInTheDocument()
  })

  it('Sidenav exposes Home + Spaces destinations as links', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p>x</p>
      </SignedInLayout>,
    )
    const dialog = openSidenav()
    const home = within(dialog).getByRole('link', { name: /^home$/i })
    expect(home).toHaveAttribute('href', '/dashboard')
    const spaces = within(dialog).getByRole('link', { name: /^spaces$/i })
    expect(spaces).toHaveAttribute('href', '/spaces')
  })

  it('Sidenav lists pending phase destinations as disabled', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p>x</p>
      </SignedInLayout>,
    )
    const dialog = openSidenav()
    // Inventory, Shopping, Batches, Crew settings appear in the Sidenav as
    // text rows (not links). Scope queries to the dialog so we don't match
    // BottomNav's Inventory tab.
    const inventory = within(dialog).getByText(/^inventory$/i)
    const inventoryRow = inventory.closest('[aria-disabled="true"]')
    expect(inventoryRow).not.toBeNull()
    expect(
      within(dialog).queryByRole('link', { name: /^inventory$/i }),
    ).toBeNull()
  })

  it('clicking a Sidenav link closes the drawer', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p>x</p>
      </SignedInLayout>,
    )
    const dialog = openSidenav()
    fireEvent.click(within(dialog).getByRole('link', { name: /^spaces$/i }))
    expect(
      screen.queryByRole('dialog', { name: /inman navigation/i }),
    ).toBeNull()
  })

  it('Sign out button is rendered', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p>x</p>
      </SignedInLayout>,
    )
    const dialog = openSidenav()
    expect(
      within(dialog).getByRole('button', { name: /sign out/i }),
    ).toBeInTheDocument()
  })
})
