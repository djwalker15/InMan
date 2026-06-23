import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import BarcodeScanPage from './scan'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const SCANNED = '012345678905'

// Replace the camera with a button that emits a fixed barcode.
vi.mock('@/components/inventory/barcode-scanner', () => ({
  BarcodeScanner: ({ onDetected }: { onDetected: (c: string) => void }) => (
    <button type="button" onClick={() => onDetected(SCANNED)}>
      emit-barcode
    </button>
  ),
}))

const crewMembers = {
  crew_members: {
    select: {
      data: [
        {
          crew_id: 'crew_abc',
          role: 'admin',
          crews: { name: 'Test', owner_id: 'user_1' },
        },
      ],
      error: null,
    },
  },
}

const masterProduct = {
  product_id: 'prod_master_1',
  crew_id: null,
  name: 'Tomato Paste',
  brand: 'Heinz',
  barcode: SCANNED,
  image_url: null,
  size_value: 6,
  size_unit: 'oz',
  default_category_id: null,
}

const existingItem = {
  inventory_item_id: 'item_1',
  crew_id: 'crew_abc',
  product_id: 'prod_master_1',
  current_space_id: 'space_a',
  quantity: 3,
  unit: 'count',
}

const sampleSpaces = [
  { space_id: 'space_a', name: 'Cabinet 1', parent_id: 'space_p' },
  { space_id: 'space_p', name: 'Kitchen', parent_id: null },
]

const refData = {
  categories: { select: { data: [], error: null } },
  unit_definitions: {
    select: { data: [{ unit: 'count', unit_category: 'count' }], error: null },
  },
}

async function scan() {
  fireEvent.click(await screen.findByRole('button', { name: /emit-barcode/i }))
}

describe('BarcodeScanPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    mockClerk({ user: { id: 'user_1' } })
  })

  it('routes an unknown barcode to custom-product creation, barcode pre-filled', async () => {
    makeSupabaseMock({
      ...crewMembers,
      ...refData,
      products: { select: { data: [], error: null } },
    })
    renderWithRouter(<BarcodeScanPage />)
    await scan()

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /create a custom product/i }),
      ).toBeInTheDocument()
    })
    expect(screen.getByLabelText(/barcode/i)).toHaveValue(SCANNED)
  })

  it('routes a found, not-yet-stocked product to the details form', async () => {
    makeSupabaseMock({
      ...crewMembers,
      ...refData,
      products: { select: { data: [masterProduct], error: null } },
      inventory_items: { select: { data: [], error: null } },
      spaces: { select: { data: sampleSpaces, error: null } },
    })
    renderWithRouter(<BarcodeScanPage />)
    await scan()

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /add to inventory/i }),
      ).toBeInTheDocument()
    })
  })

  it('offers restock when the scanned product is already in inventory', async () => {
    makeSupabaseMock({
      ...crewMembers,
      ...refData,
      products: { select: { data: [masterProduct], error: null } },
      inventory_items: { select: { data: [existingItem], error: null } },
      spaces: { select: { data: sampleSpaces, error: null } },
    })
    renderWithRouter(<BarcodeScanPage />)
    await scan()

    await waitFor(() => {
      expect(
        screen.getByText(/already in your inventory/i),
      ).toBeInTheDocument()
    })
    expect(
      screen.getByRole('button', { name: /restock this/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Kitchen › Cabinet 1/)).toBeInTheDocument()
  })
})
