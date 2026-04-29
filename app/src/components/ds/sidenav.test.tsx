import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Sidenav } from './sidenav'

describe('Sidenav', () => {
  it('renders nothing when closed', () => {
    render(
      <Sidenav open={false} onClose={() => {}} ariaLabel="App nav">
        <a href="/dashboard">Home</a>
      </Sidenav>,
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders as a dialog with the given aria-label when open', () => {
    render(
      <Sidenav open onClose={() => {}} ariaLabel="App nav" title="InMan">
        <a href="/dashboard">Home</a>
      </Sidenav>,
    )
    const dialog = screen.getByRole('dialog', { name: 'App nav' })
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByText('InMan')).toBeInTheDocument()
  })

  it('renders the children passed in', () => {
    render(
      <Sidenav open onClose={() => {}}>
        <a href="/dashboard">Home</a>
      </Sidenav>,
    )
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
  })

  it('fires onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <Sidenav open onClose={onClose}>
        <span>x</span>
      </Sidenav>,
    )
    fireEvent.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalled()
  })

  it('does not fire onClose when the panel itself is clicked', () => {
    const onClose = vi.fn()
    render(
      <Sidenav open onClose={onClose}>
        <span data-testid="panel-content">x</span>
      </Sidenav>,
    )
    fireEvent.click(screen.getByTestId('panel-content'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('fires onClose when the close button is clicked', () => {
    const onClose = vi.fn()
    render(
      <Sidenav open onClose={onClose}>
        <span>x</span>
      </Sidenav>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close navigation/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('fires onClose on ESC keydown', () => {
    const onClose = vi.fn()
    render(
      <Sidenav open onClose={onClose}>
        <span>x</span>
      </Sidenav>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('focuses the close button on open', () => {
    render(
      <Sidenav open onClose={() => {}}>
        <span>x</span>
      </Sidenav>,
    )
    const closeBtn = screen.getByRole('button', { name: /close navigation/i })
    expect(document.activeElement).toBe(closeBtn)
  })
})
