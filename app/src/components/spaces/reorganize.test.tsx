import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { ReorganizeMode, type ReorganizeItem } from './reorganize'
import type { SpaceNode } from './types'

const baseNodes: SpaceNode[] = [
  { space_id: 'p', parent_id: null, unit_type: 'premises', name: 'My House' },
  { space_id: 'a', parent_id: 'p', unit_type: 'area', name: 'Kitchen' },
  { space_id: 'a2', parent_id: 'p', unit_type: 'area', name: 'Garage' },
  { space_id: 'z', parent_id: 'a', unit_type: 'zone', name: 'Back' },
  {
    space_id: 'sub1',
    parent_id: 'z',
    unit_type: 'sub_section',
    name: 'Cabinet 1',
  },
  {
    space_id: 'sub2',
    parent_id: 'z',
    unit_type: 'sub_section',
    name: 'Cabinet 2',
  },
]

const baseItems: ReorganizeItem[] = [
  {
    inventory_item_id: 'i_1',
    name: 'Salt',
    current_space_id: 'sub2',
    home_space_id: 'sub2',
  },
  {
    inventory_item_id: 'i_2',
    name: 'Sugar',
    current_space_id: 'sub2',
    home_space_id: 'sub1',
  },
  {
    inventory_item_id: 'i_3',
    name: 'Pepper',
    current_space_id: 'sub1',
    home_space_id: 'sub1',
  },
]

function defaultProps() {
  return {
    crewId: 'crew_a',
    nodes: baseNodes,
    items: baseItems,
    onExit: vi.fn(),
    onApplied: vi.fn(),
  }
}

describe('ReorganizeMode (shell)', () => {
  it('renders the four operation buttons and an empty default body', () => {
    makeSupabaseMock({})
    render(<ReorganizeMode {...defaultProps()} />)
    for (const label of ['Move', 'Merge', 'Delete', 'Split']) {
      expect(
        screen.getByRole('button', { name: new RegExp(`^${label}\\b`) }),
      ).toBeInTheDocument()
    }
    expect(
      screen.getByText(/pick an operation above to begin/i),
    ).toBeInTheDocument()
  })

  it('Delete still shows the P6.4 placeholder', () => {
    makeSupabaseMock({})
    render(<ReorganizeMode {...defaultProps()} />)
    fireEvent.click(screen.getByRole('button', { name: /^Delete\b/ }))
    expect(
      screen.getByText(/delete — coming with p6\.4/i),
    ).toBeInTheDocument()
  })

  it('Done and Cancel both invoke onExit', () => {
    makeSupabaseMock({})
    const props = defaultProps()
    render(<ReorganizeMode {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /^done$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }))
    expect(props.onExit).toHaveBeenCalledTimes(2)
  })
})

describe('ReorganizeMode › Move', () => {
  it('Confirm move is disabled until a source AND parent are picked', () => {
    makeSupabaseMock({})
    renderWithRouter(<ReorganizeMode {...defaultProps()} />)
    fireEvent.click(screen.getByRole('button', { name: /^Move\b/ }))
    const confirm = screen.getByRole('button', { name: /confirm move/i })
    expect(confirm).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/move this space/i), {
      target: { value: 'sub2' },
    })
    expect(confirm).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/to this new parent/i), {
      target: { value: 'sub1' },
    })
    // sub_section accepts container/shelf — sub2's only valid parents are
    // other sub_sections that the helper marked OK. sub1 is a sibling
    // sub_section, but sub_sections don't accept sub_sections (rank 4 ↛ 4).
    // Verify by checking the option is filtered out.
    expect(
      (screen.getByLabelText(/to this new parent/i) as HTMLSelectElement).value,
    ).toBe('')
  })

  it('valid move: sub2 → Garage (an area accepts sub_section)', async () => {
    const sb = makeSupabaseMock({}, { move_space: { error: null } })
    const props = defaultProps()
    renderWithRouter(<ReorganizeMode {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /^Move\b/ }))
    fireEvent.change(screen.getByLabelText(/move this space/i), {
      target: { value: 'sub2' },
    })
    fireEvent.change(screen.getByLabelText(/to this new parent/i), {
      target: { value: 'a2' },
    })
    fireEvent.click(screen.getByRole('button', { name: /confirm move/i }))
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('move_space', {
        p_space_id: 'sub2',
        p_new_parent_id: 'a2',
      })
    })
    expect(props.onApplied).toHaveBeenCalled()
  })

  it('Move impact summary reflects the source subtree size and item count', () => {
    makeSupabaseMock({})
    renderWithRouter(<ReorganizeMode {...defaultProps()} />)
    fireEvent.click(screen.getByRole('button', { name: /^Move\b/ }))
    fireEvent.change(screen.getByLabelText(/move this space/i), {
      target: { value: 'z' },
    })
    const impact = screen.getByLabelText(/impact summary/i)
    // Back has 2 sub_section descendants → subtree of 3 nodes total.
    expect(impact).toHaveTextContent('Spaces in the moving subtree')
    expect(impact).toHaveTextContent('3')
    // baseItems puts all 3 items inside the Back subtree.
    expect(impact).toHaveTextContent('Items affected (no Flows)')
    // Move never produces a Flow.
    expect(impact).toHaveTextContent('Transfer Flows generated')
    expect(impact).toHaveTextContent('0')
  })

  it('surfaces an RPC error inline', async () => {
    makeSupabaseMock(
      {},
      {
        move_space: {
          error: new Error('Cannot move a Space into its own subtree'),
        },
      },
    )
    renderWithRouter(<ReorganizeMode {...defaultProps()} />)
    fireEvent.click(screen.getByRole('button', { name: /^Move\b/ }))
    fireEvent.change(screen.getByLabelText(/move this space/i), {
      target: { value: 'sub2' },
    })
    fireEvent.change(screen.getByLabelText(/to this new parent/i), {
      target: { value: 'a2' },
    })
    fireEvent.click(screen.getByRole('button', { name: /confirm move/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/cannot move/i)
    })
  })
})

describe('ReorganizeMode › Merge', () => {
  it('valid merge calls merge_spaces with both ids', async () => {
    const sb = makeSupabaseMock({}, { merge_spaces: { error: null } })
    const props = defaultProps()
    renderWithRouter(<ReorganizeMode {...props} />)
    fireEvent.click(screen.getByRole('button', { name: /^Merge\b/ }))
    fireEvent.change(screen.getByLabelText(/merge this space/i), {
      target: { value: 'sub2' },
    })
    fireEvent.change(screen.getByLabelText(/into this space/i), {
      target: { value: 'sub1' },
    })
    fireEvent.click(screen.getByRole('button', { name: /confirm merge/i }))
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('merge_spaces', {
        p_source_id: 'sub2',
        p_target_id: 'sub1',
      })
    })
    expect(props.onApplied).toHaveBeenCalled()
  })

  it('Merge impact summary lists items moving + flow count + home updates', () => {
    makeSupabaseMock({})
    renderWithRouter(<ReorganizeMode {...defaultProps()} />)
    fireEvent.click(screen.getByRole('button', { name: /^Merge\b/ }))
    fireEvent.change(screen.getByLabelText(/merge this space/i), {
      target: { value: 'sub2' },
    })
    const impact = screen.getByLabelText(/impact summary/i)
    // sub2 has 2 items at it (i_1, i_2) and i_1's home references sub2.
    expect(impact).toHaveTextContent('Items moving')
    expect(impact).toHaveTextContent('Transfer Flows')
    expect(impact).toHaveTextContent('Home updates')
    expect(impact).toHaveTextContent('Children re-parented')
  })
})
