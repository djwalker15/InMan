import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { ReorganizeMode } from './reorganize'
import type { SpaceNode } from './types'

const baseNodes: SpaceNode[] = [
  { space_id: 'p', parent_id: null, unit_type: 'premises', name: 'My House' },
  { space_id: 'a', parent_id: 'p', unit_type: 'area', name: 'Kitchen' },
  { space_id: 'z', parent_id: 'a', unit_type: 'zone', name: 'Back' },
]

describe('ReorganizeMode', () => {
  it('renders the four operation buttons and a default empty body', () => {
    render(<ReorganizeMode nodes={baseNodes} onExit={() => {}} />)
    for (const label of ['Move', 'Merge', 'Delete', 'Split']) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}\\b`) }),
      ).toBeInTheDocument()
    }
    // Empty state text appears when no operation is picked.
    expect(
      screen.getByText(/pick an operation above to begin/i),
    ).toBeInTheDocument()
  })

  it('picking Move shows the P6.3 operation placeholder and toggles aria-pressed', () => {
    render(<ReorganizeMode nodes={baseNodes} onExit={() => {}} />)
    const move = screen.getByRole('button', { name: /^Move\b/ })
    expect(move).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(move)
    expect(move).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByText(/move — coming with p6\.3/i),
    ).toBeInTheDocument()
  })

  it('picking Delete shows the P6.4 operation placeholder', () => {
    render(<ReorganizeMode nodes={baseNodes} onExit={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /^Delete\b/ }))
    expect(
      screen.getByText(/delete — coming with p6\.4/i),
    ).toBeInTheDocument()
  })

  it('preview panel renders the read-only tree of live nodes', () => {
    const withDeleted: SpaceNode[] = [
      ...baseNodes,
      {
        space_id: 'gone',
        parent_id: 'a',
        unit_type: 'zone',
        name: 'Old Zone',
        deleted_at: '2026-04-01T00:00:00Z',
      },
    ]
    render(<ReorganizeMode nodes={withDeleted} onExit={() => {}} />)
    const preview = screen.getByLabelText(/reorganize preview/i)
    expect(preview).toHaveTextContent('My House')
    expect(preview).toHaveTextContent('Kitchen')
    // Soft-deleted nodes never appear in the preview tree.
    expect(preview).not.toHaveTextContent('Old Zone')
  })

  it('Done and Cancel both invoke onExit', () => {
    const onExit = vi.fn()
    render(<ReorganizeMode nodes={baseNodes} onExit={onExit} />)
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(onExit).toHaveBeenCalledTimes(2)
  })

  it('the impact summary lists the three preview metrics with placeholder values', () => {
    render(<ReorganizeMode nodes={baseNodes} onExit={() => {}} />)
    const impact = screen.getByLabelText(/impact summary/i)
    expect(impact).toHaveTextContent('Items affected')
    expect(impact).toHaveTextContent('Transfer Flows')
    expect(impact).toHaveTextContent('Home location updates')
  })
})
