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
    // Shopping, Batches, Crew settings still appear as disabled text rows
    // (Inventory promoted to a live link in P3.2). Scope to the dialog so we
    // don't match BottomNav.
    const shopping = within(dialog).getByText(/^shopping$/i)
    const shoppingRow = shopping.closest('[aria-disabled="true"]')
    expect(shoppingRow).not.toBeNull()
    expect(
      within(dialog).queryByRole('link', { name: /^shopping$/i }),
    ).toBeNull()
  })

  it('Sidenav exposes Inventory as a live link (P3.2)', () => {
    mockClerk({ user: { id: 'user_1' } })
    renderWithRouter(
      <SignedInLayout>
        <p>x</p>
      </SignedInLayout>,
    )
    const dialog = openSidenav()
    const inventory = within(dialog).getByRole('link', {
      name: /^inventory$/i,
    })
    expect(inventory).toHaveAttribute('href', '/inventory')
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
