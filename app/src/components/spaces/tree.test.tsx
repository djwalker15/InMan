import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tree } from './tree'
import type { SpaceNode } from './types'

const nodes: SpaceNode[] = [
  { space_id: 'p1', parent_id: null, unit_type: 'premises', name: 'My House' },
  { space_id: 'a1', parent_id: 'p1', unit_type: 'area', name: 'Kitchen' },
  { space_id: 'z1', parent_id: 'a1', unit_type: 'zone', name: 'Back Wall' },
]

describe('Tree', () => {
  it('renders nothing-state when empty', () => {
    render(<Tree nodes={[]} emptyState="No spaces yet." />)
    expect(screen.getByText('No spaces yet.')).toBeInTheDocument()
  })

  it('renders nodes with their unit_type label', () => {
    render(<Tree nodes={nodes} />)
    expect(screen.getByText('My House')).toBeInTheDocument()
    expect(screen.getByText('Kitchen')).toBeInTheDocument()
    expect(screen.getByText('Back Wall')).toBeInTheDocument()
    // Three unit-type labels
    expect(screen.getByText('Premises')).toBeInTheDocument()
    expect(screen.getByText('Area')).toBeInTheDocument()
    expect(screen.getByText('Zone')).toBeInTheDocument()
  })

  it('indents children based on parent chain depth', () => {
    const { container } = render(<Tree nodes={nodes} />)
    const items = container.querySelectorAll('li[data-unit-type]')
    expect(items).toHaveLength(3)
    expect(items[0].getAttribute('data-depth')).toBe('0')
    expect(items[1].getAttribute('data-depth')).toBe('1')
    expect(items[2].getAttribute('data-depth')).toBe('2')
    expect((items[2] as HTMLElement).style.paddingLeft).toBe('32px')
  })

  it('hides soft-deleted nodes', () => {
    const withDeleted: SpaceNode[] = [
      ...nodes,
      {
        space_id: 's1',
        parent_id: 'a1',
        unit_type: 'section',
        name: 'Above',
        deleted_at: '2026-04-29T00:00:00Z',
      },
    ]
    render(<Tree nodes={withDeleted} />)
    expect(screen.queryByText('Above')).not.toBeInTheDocument()
  })

  it('skips orphans whose parent is missing', () => {
    const orphan: SpaceNode[] = [
      { space_id: 'a1', parent_id: 'missing', unit_type: 'area', name: 'Orphan' },
    ]
    render(<Tree nodes={orphan} emptyState="empty" />)
    expect(screen.queryByText('Orphan')).not.toBeInTheDocument()
    expect(screen.getByText('empty')).toBeInTheDocument()
  })
})
