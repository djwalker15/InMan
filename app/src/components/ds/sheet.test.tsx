import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Sheet } from './sheet'

describe('Sheet', () => {
  it('renders nothing when closed', () => {
    render(
      <Sheet open={false} onClose={() => {}} ariaLabel="Actions">
        <p>body</p>
      </Sheet>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders as a modal dialog with the given aria-label and title', () => {
    render(
      <Sheet open onClose={() => {}} ariaLabel="Actions" title="Manage space">
        <p>body</p>
      </Sheet>,
    )
    const dialog = screen.getByRole('dialog', { name: 'Actions' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('Manage space')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })

  it('fires onClose when the scrim is clicked', () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose}>
        <span>x</span>
      </Sheet>,
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does not fire onClose when the panel body is clicked', () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose}>
        <span data-testid="body">x</span>
      </Sheet>,
    )
    fireEvent.click(screen.getByTestId('body'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('fires onClose on the close affordance and on ESC', () => {
    const onClose = vi.fn()
    render(
      <Sheet open onClose={onClose}>
        <span>x</span>
      </Sheet>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('focuses the close affordance on open', () => {
    render(
      <Sheet open onClose={() => {}}>
        <span>x</span>
      </Sheet>,
    )
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: /close/i }),
    )
  })
})
