import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { InventoryRowDetails } from './row-details'

const baseProps = {
  inventoryItemId: 'i_1',
  productId: 'p_1',
  productName: 'Tomato Paste',
  productBrand: 'Heinz',
  productImageUrl: null,
  productSize: { value: 6, unit: 'oz' },
  productBarcode: '0123456',
  effectiveCategoryName: 'Pantry',
  categoryOverridden: false,
  quantity: 3,
  unit: 'count',
  currentLocationPath: 'Kitchen › Cabinet 1',
  homeLocationPath: 'Kitchen › Cabinet 1',
  displacementState: 'in_place' as const,
  lastUnitCost: 2.49,
  minStock: 2,
  expiryDate: null,
  notes: null,
  alerts: [] as never[],
}

describe('InventoryRowDetails', () => {
  it('renders product details + inventory metrics', async () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({
      flows: { select: { data: [], error: null } },
    })
    render(<InventoryRowDetails {...baseProps} />)
    expect(screen.getByText('Tomato Paste')).toBeInTheDocument()
    expect(screen.getByText(/heinz/i)).toBeInTheDocument()
    expect(screen.getByText(/upc 0123456/i)).toBeInTheDocument()
    expect(screen.getByText(/category: pantry/i)).toBeInTheDocument()
    // Inventory section
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText(/in place/i)).toBeInTheDocument()
    expect(screen.getByText(/\$2\.49/)).toBeInTheDocument()
    expect(screen.getByText(/2 count/)).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.getByText(/no activity recorded for this item yet/i),
      ).toBeInTheDocument()
    })
  })

  it('shows the last 5 flow rows from the supabase mock', async () => {
    mockClerk({ user: { id: 'user_1' } })
    const flows = [
      {
        flow_id: 'f1',
        flow_type: 'purchase',
        quantity: 2,
        unit: 'count',
        performed_at: new Date(Date.now() - 60_000).toISOString(),
        performed_by: 'user_1',
        notes: 'first stock',
      },
      {
        flow_id: 'f2',
        flow_type: 'consumption',
        quantity: 1,
        unit: 'count',
        performed_at: new Date(Date.now() - 3_600_000).toISOString(),
        performed_by: 'user_1',
        notes: null,
      },
    ]
    makeSupabaseMock({
      flows: { select: { data: flows, error: null } },
    })
    render(<InventoryRowDetails {...baseProps} />)
    await waitFor(() => {
      expect(screen.getByText(/purchased 2 count/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/used 1 count/i)).toBeInTheDocument()
    // Attribution: "by you" because performed_by matches the mocked user id.
    expect(screen.getAllByText(/by you/i).length).toBe(2)
    expect(screen.getByText(/first stock/i)).toBeInTheDocument()
  })

  it('renders displacement and unsorted states distinctly', () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({ flows: { select: { data: [], error: null } } })
    render(
      <InventoryRowDetails
        {...baseProps}
        displacementState="displaced"
        homeLocationPath="Kitchen › Cabinet 2"
      />,
    )
    expect(screen.getByText(/displaced/i)).toBeInTheDocument()
  })
})
